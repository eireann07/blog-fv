//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Thanks so much for stopping by my blog! I'm Erin, a full-stack developer currently based in the United States. On this blog, I'm excited to share more about my journey from teaching into programming and technology. This blog's creation was part of a final set of projects for my bootcamp, which I completed in July of 2022. It's written in JavaScript and EJS, and styled with the Bootstrap CSS framework and uses a Mongo Atlas database.";
const aboutContent = "I'm a junior full-stack developer who's recently graduated from The London App Brewery's Complete Web Development Bootcamp. I'm proficient in HTML, CSS, JavaScript, SQL, Python, and the MERN stack and I'm interested in UX/UI elements as well! I've been writing code since January 2022, and I'm happy to share more with you about what I've learned in that time. I'm a proud member of Girl Develop It, an organization that helps women build the skills necessary to succeed in tech. I believe passionately in helping women and girls in STEM. Prior to my career in web dev, I was a public school educator -- high school English -- and team lead. In addition to web development, I love to read, bake, run, paint, and practice yoga.";
const contactContent = "If you would like to know more about me and who I am as a developer (or if you just want to say hi!), feel free to contact me!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Persist data to mongodb
mongoose.connect("mongodb:localhost/27017/blogDB"); //security: update to hide authetification

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

//Functionality & content
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

//Compose & display new posts
app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

//Secondary pages
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
