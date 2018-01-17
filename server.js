// dependencies
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
mongoose.Promise = Promise;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scraperdb");
var db = mongoose.connection;

db.on("error", error => {
    console.log("Mongoose Error: ", error);
});

db.once("open", () => {
    console.log("Mongoose connection successful.");
});

// routes
app.get("/", (req, res) => {
    res.send("Hello, User!");
});

app.get("/scrape", (req, res) => {
  request("https://www.reddit.com/r/Archaeology/", function(error, response, html) {
    var $ = cheerio.load(html);
    $("p.title").each(function(i, element) {

      var result = {};

      result.title = $(this).text();
      result.link = $(this).children("a").attr("href");

      var entry = new Article(result);

      entry.save((err, doc) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
  res.send("Articles have been scraped.");
});

app.get("/articles", (req, res) => {
  Article.find({}, (error, doc) => {
    if (error) {
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

app.get("/articles/:id", (req, res) => {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

// set app to listen on port 3000
app.listen(3000, () => {
    console.log("App running on port 3000!");
});