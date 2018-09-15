var db = require('../models');
var cheerio = require('cheerio');

var request = require('request');


module.exports = function(app) {
  app.get('/scrape', function(req, res) {
    var url = 'https://old.reddit.com';
    request(url + '/r/aww/', function(error, response, html) {
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // An empty array to save the data that we'll scrape
      var results = [];
      var result = {};

      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $('p.title').each(function(i, element) {


        // Save the text of the element in a "title" variable
        result = {};
        result.title = $(element).text();

        // Find the h4 tag's parent a-tag, and save it's href value as "link" 
        if ($(element).children().attr('href').startsWith("http:" || "https")) {
          result.link = $(element).children().attr('href')
        } 
        else {
        result.link = url + $(element).children().attr('href');
        }
        // result.img = $(".thumbnail").attr()



        // Make an object with data we scraped for this h4 and push it to the results array
        results.push({
          result
        });

        // Save these results in an object that we'll push into the results array we defined earlier
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            if (err.code === 11000) {
              console.log('Duplicate Entry');
            } else {
              console.log(err);
            }
          });
      });
      // Log the results once you've looped through each of the elements found with cheerio
      console.log(results);
      res.redirect('/articles');
      res.finished = true;
      res.end();
    });
  });

  app.get('/articles', function(req, res) {
    // Grab every document in the Articles collection
    var data = {};

    db.Article.find({})
      .then(function(dbArticles) {
        // If we were able to successfully find Articles, send them back to the client
        data.articles = dbArticles;
        res.render('index', data);
        console.log('Articles pulled from database');
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get('/saved', function(req, res) {
    // Grab every document in the Articles collection
    var data = {};

    db.Article.find({ isSaved: true })
      .populate('note')
      .then(function(dbArticles) {
        // If we were able to successfully find Articles, send them back to the client
        data.article = dbArticles;
        res.render('saved',data);
        console.log(dbArticles);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get('/', function(req, res) {
    res.redirect('/articles');
  });

  app.post('/save/:id', function(req, res) {
    var thisId = req.params.id;

    db.Article.findOneAndUpdate(
      { _id: thisId },
      {
        $set: { isSaved: true }
      },
      function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('updated' + res);
        }
      }
    );
    res.render('article');
    console.log('Saved');
  });

  app.get('/article/:id', function(req, res) {
    var thisId = req.params.id;

    var data = [];

    db.Article.find({ _id: thisId })
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        data.article = dbArticle;
        res.render('article', data);
        console.log(dbArticles);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        console.log(err);
      });
  });

  app.post('/addNote/:id', function(req, res) {
    console.log(req.body);
    var articleId = req.params.id;

    db.Note.create(req.body)
      .then(function(note) {
        // If we were able to successfully find Articles, send them back to the client

        console.log('note created');
        return db.Article.findOneAndUpdate(
          { _id: articleId },
          { $push: { note: note._id } }
        );
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app
};