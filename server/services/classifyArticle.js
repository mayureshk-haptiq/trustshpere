// classifyArticle.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Analyzes a cybercrime article using generative AI.
 * @param {string} text - The article text to analyze.
 * @returns {Object} - The analysis result in JSON format.
 */
const classifyArticle = async (text) => {
  const prompt = `Please analyze the following cybercrime article by performing the specified tasks and return the response in JSON format:

1. **Categorization**: Classify the article into relevant categories of cybercrimes (e.g., Phishing, Malware, etc.).
2. **Sentiment Analysis**: Determine the sentiment (Positive, Negative, Neutral) and explain the tone.
3. **Fact-Checking**: Identify potentially false claims and verify them with reliable sources.
4. **Entity Extraction and Linkage**: Extract key entities (People, Organizations, Technologies, etc.).
5. **Toxicity Detection**: Detect harmful or toxic language, if any.
6. **Key Phrase Extraction**: Extract relevant keywords summarizing the article.
7. **Trend Analysis**: Identify emerging trends in cybercrime.
8. **Text Similarity and Clustering**: Compare and identify clusters of similar articles.
9. **Timeline Generation**: Generate a timeline of key events if applicable.
10. **Geolocation Analysis**: Identify geographic regions related to the article.
11. **Threat Intelligence Extraction**: Extract indicators of compromise (IOCs).
12. **Risk Assessment**: Analyze the risk and severity of the incident.
13. **Actionable Insights/Recommendations**: Suggest cybersecurity measures to prevent similar incidents.

Return null for all values if the article is not about cybercrime.

Response Format:
{
  "categories": ["Category1", "Category2"],
  "sentiment_tone": "Positive/Negative/Neutral",
  "fact_checking": true/false,
  "entity_involved": {
    "People": ["Person1", "Person2"],
    "Organizations": ["Org1", "Org2"],
    "Technologies_tools": ["Tool1", "Tool2"],
    "Dates": ["Date1", "Date2"],
    "Locations": ["Location1", "Location2"]
  },
  "toxicity_detection": {
    "Toxic Language Found": true/false,
    "Toxicity Details": "Details of toxicity"
  },
  "key_phrase_extraction": ["Key phrase1", "Key phrase2"],
  "trend_analysis": {
    "Emerging Trends": ["Trend1", "Trend2"]
  },
  "timeline": {
    "DD-MM-YYYY": "Event Details"
  },
  "geolocation_analysis": ["Location1", "Location2"],
  "risk_assessment": {
    "Severity": "High/Medium/Low",
    "Impacts": ["Financial loss", "Data breach", "Reputational damage"]
  },
  "actionable_recommendations": ["Recommendation1", "Recommendation2"]
}

Article: "${text}"`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanedText = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error during analysis:", error.response?.data || error.message);
    throw new Error("Failed to analyze the article. Check server logs for details.");
  }
};

module.exports = classifyArticle;
