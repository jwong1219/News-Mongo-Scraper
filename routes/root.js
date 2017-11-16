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
  // create a response obj
  let resObj = {
    newArticles: false
  };
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
      result.img = $(this).children(".story-photo").children("a").children("img").attr("org-src");
      result.url = "https://www.reuters.com" + $(this).children(".story-photo").children("a").attr("href");
      console.log(result);
      elements.push(result);
    });

    elements.forEach(function(article) {
      db.Article
        // check if article already exists by looking for an identical headline
        .findOne({"headline": article.headline})
        .then(function(data) {
          // if a matching headline was not found, create a new article document
          if(!data) {
            db.Article
              .create(article)
              .then(function(result) {
                console.log({result});
                // change the value in the response object to true so the client knows new articles were scraped and recorded in the db
                resObj.newArticles = true;
              }).catch(function(err) {
                console.log({err});
              })
          }
        })
        .catch(function(err) {
          console.log(err);
        })
    })
    db.Article
      .find({}, null, {"limit": 20})
      .then(function(dbArticles) {
        // console.log(dbArticles);
        resObj.articles = dbArticles;
        console.log(resObj.articles);
        res.render("index", {articles: resObj.articles});
        // res.send(resObj);
      })
      .catch(function(err) {
        console.log({err});
        resObj.error = err;
        res.json(resObj);
      })
    
    // res.json(resObj);
  })
})

module.exports = router;