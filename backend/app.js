const express = require('express');
const bodyParser = require("body-parser");

const app = express();

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
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  })
});

app.get('/api/posts',(req, res, next) => {

  const posts = [
    {
      id: 'askefhjaklh',
      title: 'First server side post',
      content: 'This is coming from the server'
    },
    {id: 'asrkjwel;j', title: 'Second server side post', content: 'This is coming from the server!'}
  ];

  return res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });

});


module.exports = app;
