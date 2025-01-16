const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { analyzeDocument, maskSensitiveData } = require("../services/documentAnalyzer");
const PDFDocument = require("pdfkit");
const pdf = require("pdf-parse"); // Ensure you import the pdf-parse package

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File type validation setup
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported File Type"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/analyzeDocument", upload.single("file"), async (req, res) => {
  const file = req.file;
  try {
    const analysisResult = await analyzeDocument(file.path);
    res.status(200).json({ sensitiveData: analysisResult, filePath: file.path });
  } catch (err) {
    console.error("Error in /analyzeDocument endpoint:", err.message);
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
});

router.post("/mask", async (req, res) => {
  const { fieldsToMask, filePath } = req.body;

  try {
    // Validate file existence
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "File not found at the specified path." });
    }

    // Read PDF file
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdf(pdfBuffer); // Extract text using pdf-parse
    const originalText = data.text;

    // Mask sensitive data
    const maskedText = maskSensitiveData(originalText, fieldsToMask);

    // Generate new PDF with masked data
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=masked_output.pdf");

    doc.pipe(res);
    doc.fontSize(12).text(maskedText, { align: "left" });
    doc.end();
  } catch (error) {
    console.error("Error in /mask endpoint:", error.message);
    res.status(500).json({ message: "An error occurred while masking the document.", error: error.message });
  }
});

module.exports = router;
