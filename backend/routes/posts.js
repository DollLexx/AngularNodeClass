const express = require('express');
const bodyParser = require('body-parser');

const Post = require('../models/post');

const router = express.Router();

router.post('',(req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then((response) => {
    console.log(response);
    res.status(200).json({message: 'Update successful'});
  });
});

router.get('',(req, res, next) => {
  console.log('Am in the get posts service');
  Post.find().then((documents)=>{
    console.log(documents);
    return res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  });
});

router.get('/:id', (req, res, next) => {
  console.log('am in the single get post service');
  Post.findById(req.params.id).then((post) => {
    console.log("database returned " + post);
    if (post) {
      res.status(200).json({
        id: post._id,
        title: post.title,
        content: post.content
      });
    }
    else {
      res.status(404).json({
        id: null,
        title: null,
        content: null
      });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
  .then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'Post deleted'
    });
  });
});

module.exports = router;
