// require packages
const express = require("express");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");

// require mongoose models
const db = require("../models");

const router = express.Router();

// set up router, the root route of this router is "/"
router.get('/', function(req, res) {
  // get html from reuters
  request('https://www.reuters.com', function (error, response, body) {
    // console.log(body);
    // load the html into cheerio
    const $ = cheerio.load(body);
    let elements = [];
    // grab the story divs
    $("#hp-top-news-low .story").each(function(i, element) {
      let result = {};

      result.headline = $(this).children(".story-content").children("a").children(".story-title").text().replace("\n\t\t\t\t\t\t\t\t", "");
      result.summary = $(this).children(".story-content").children("p").text();
      result.img = $(this).children(".story-photo").children("a").children("img").attr("src");
      result.url = "https://www.reuters.com" + $(this).children(".story-photo").children("a").attr("href");
      console.log(result);
      elements.push(result);
    });
    
    res.json(elements);
  })
})

module.exports = router;