const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
    .then(()=>console.log("Mongo DB Connected..."))
    .catch(err=>console.log(err));

const articleSchema = new mongoose.Schema({
    title:String,
    content:String
});

const Article = mongoose.model("Article",articleSchema);


///////////////////////////////////////// Request Targeting all Articles ////////////////////////////////////////////////////////////

app.route("/articles")
  .get(function(req,res){
    Article.find()
    .then((results)=>{
      res.send(results);
    })
    .catch((err)=>{
      res.send(err);
    });
  })
  .post(async function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    try {
        await newArticle.save();
        res.send("Success!");
      } catch (err) {
        res.send(err);
      }
      
  })
  .delete(function(req, res) {
    Article.deleteMany()
    .then((result)=>{
      res.send("Successfully deleted all articles");
    })
    .catch((err) => {
      res.send(err);
    });
  });

// app.get("/articles", function(req,res){
//   Article.find()
//   .then((results)=>{
//     res.send(results);
//   })
//   .catch((err)=>{
//     res.send(err);
//   });
// });

// app.post('/articles',async function(req,res){
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     try {
//         await newArticle.save();
//         res.send("Success!");
//       } catch (err) {
//         res.send(err);
//       }
      
// });

// app.delete('/articles', function(req, res) {
//   Article.deleteMany()
//   .then((result)=>{
//     res.send("Successfully deleted all articles");
//   })
//   .catch((err) => {
//     res.send(err);
//   });
// });

///////////////////////////////////////// Request Targeting A Specific Articles ////////////////////////////////////////////////////////////

//localhost:3000/articles/Jack-Bauer
//req.params.articleTitle = "Jack-Bauer"
app.route("/articles/:articleTitle")
.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle})
    .then((results)=>{
      res.send(results);
    })
    .catch((err)=>{
      res.send("Not Found");
    });
  })
  .put(function (req, res) {
    Article.updateMany(
      {title:req.params.articleTitle}, //The first argument is an object that specifies which article to update. In this case, it searches for an article with a title that matches the "articleTitle" parameter in the route URL.
      {title:req.body.title, content:req.body.content}) //The second argument is an object that specifies the new values for the article's "title" and "content" fields. These values are taken from the HTTP request's body, which should contain a JSON object with "title" and "content" properties.
      .then((result)=>{
        res.send("Successfully updated the article");
      })
      .catch((error)=>{
        res.send(error);
      });
  })
  .patch(function (req, res) {
    Article.updateMany(
      {title:req.params.articleTitle},
      {$set:req.body})
      .then((result)=>{
        res.send(result)
      })
      .catch((err)=>{
        res.send(err);
      });
  })
  .delete(function(req, res) {
    Article.deleteOne(
      {title:req.params.articleTitle} //{title:req.params.articleTitle} is an object in JavaScript. In this case, it is being used as a filter to find articles in the MongoDB database based on their title. req.params.articleTitle is a parameter in the URL of the request, and it contains the value of the article title that the client is requesting. By passing this value as a property in the filter object, the Article model in the MongoDB database can be queried to find the article that matches this title.
    )
    .then((result)=>{
      res.send("Successfully delete");
    })
    .catch((err) => {
      res.send(err);
    });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});