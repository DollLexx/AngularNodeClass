const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb://localhost:27017/PostDB', {useNewUrlParser: true})
  .then(() => {
    console.log("Connected to the database -- PostDB");
}).catch(() => {
    console.log("Encountered an error connecting to the database");
});

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts',(req, res, next) => {
  //body added to request by body parser
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(() => {
    console.log("post saved and id is " + post._id);
    console.log(post);

    res.status(201).json({
      message: "Post added successfully",
      postId: post._id
    })
  });

});

app.get('/api/posts',(req, res, next) => {

  Post.find().then((documents)=>{
    console.log(documents);
    return res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
  .then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'Post deleted'
    });
  });
});

module.exports = app;
