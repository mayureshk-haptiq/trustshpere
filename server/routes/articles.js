const express = require("express");
const router = express.Router();
const classifyArticle = require('../services/classifyArticle')

const axios = require("axios");
const cheerio = require("cheerio");
const { startsWith, endsWith } = require("lodash");

router.get("/", async (req, res) => {
  try {
    // Fetch the relevant page from the website
    const { data } = await axios.get(
      "https://timesofindia.indiatimes.com/topic/Cyber-crime/news"
    );

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Define an array to hold the articles
    const articles = [];

    // Select and process only relevant elements
    $(".uwU81").each((index, element) => {
      const linkElement = $(element).find("a");
      const title = $(linkElement).find(".fHv_i span").text().trim();
      const link = linkElement.attr("href") || "#";
      const date = $(element).find(".ZxBIG").text().trim();

      const imgElement = $(linkElement).find("img");
      const image = imgElement.attr(endsWith("src") && startsWith)['src'];

      // Push the article to the array
      articles.push({
        title,
        link: link.startsWith("http")
          ? link
          : `https://timesofindia.indiatimes.com${link}`,
        date,
        image,
      });
    });

    // Return the articles as JSON response
    // console.log("Cyber Crime Articles:", articles);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles" });
  }
});

router.post("/analyze", async (req, res) => {
  console.log("Start")
  try {
    const { articleLink } = req.body;
    const { data } = await axios.get(articleLink);
    const $ = cheerio.load(data);

    const heading = $('.HNMDR').text();
    const description = $('.js_tbl_article').text();

    const article = `Heading : ${heading}. \n Description : ${description}`;
    try {
      const classification = await classifyArticle(article);
      res.json({classification, heading, description});
    } catch (error) {
      console.error("Error during classification:", error.message);
      res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
  console.log("END")
})

module.exports = router;
