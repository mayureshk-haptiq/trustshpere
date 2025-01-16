// router.js
const express = require("express");
const router = express.Router();
const classifyArticle = require("../services/classifyArticle");

/**
 * POST /classify - Classify a cybercrime article.
 * Request Body: {
 *   heading: "Article Heading",
 *   description: "Article Description"
 * }
 * Response: Analysis result in JSON format.
 */

router.post("/classify", async (req, res) => {
  const { heading, description } = req.body;

  if (!heading || !description || typeof heading !== "string" || typeof description !== "string") {
    return res.status(400).json({ error: "Both heading and description are required as strings." });
  }

  const article = heading.trim() + " " + description.trim();

  try {
    const classification = await classifyArticle(article);
    res.json(classification);
  } catch (error) {
    console.error("Error during classification:", error.message);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

module.exports = router;
