const fs = require("fs");
const pdfParse = require("pdf-parse");

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const analyzeDocument = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    console.log("22222222222", data);
    const prompt = `Please take the data and extract all sensitive information. 
    Identify key pieces of sensitive data such as personal details, financial information, 
    or any confidential data, and present them in a structured format of key-value pairs. 
    The key should represent the type of sensitive data (e.g., 'Name', 'Email', 'Phone Number', 
    'Credit Card Number', 'Address', etc.), and the value should be the corresponding information 
    found in the document. If no sensitive information is found, return nothing. 
    The output should be in the following format:"
    
    - Key: "Value"
    
    "Please ensure that no information is missed and provide the most accurate extraction possible."
    
    below is the data ${data.text}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const keyValuePairs = rawText
      .split("\n")
      .map((line) => {
        const match = line.trim().match(/- (.*?): "(.*?)"/);
        if (match) {
          return { [match[1]]: match[2] };
        }
        return null;
      })
      .filter((item) => item !== null);

    // Merging the array of key-value objects into a single object
    const mergedResult = Object.assign({}, ...keyValuePairs);

    // Creating the format where each value is an array
    const sensitiveData = {};
    for (const [key, value] of Object.entries(mergedResult)) {
      sensitiveData[key] = [value];
    }
    console.log(sensitiveData);
    return sensitiveData;
  } catch (error) {
    console.error(
      "Error during analysis :",
      error.response?.data || error.message
    );
    throw new Error("Check the server logs for details.");
  }
};

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters
};

const maskSensitiveData = (text, fieldsToMask) => {
  fieldsToMask.forEach((field) => {
    const escapedField = escapeRegex(field); // Escape special characters
    const regex = new RegExp(escapedField, "g");
    text = text.replace(regex, (match) => {
      const visibleChars = Math.min(2, match.length); // Show the first 2 characters
      const maskedPart = "*".repeat(match.length - visibleChars); // Mask the rest
      return match.slice(0, visibleChars) + maskedPart;
    });
  });
  return text;
};
module.exports = { analyzeDocument, maskSensitiveData };
