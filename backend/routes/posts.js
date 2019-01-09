const express = require('express');
const multer = require('multer');  // for storing stuff

const bodyParser = require('body-parser');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid)
    {
      callback(null, 'backend/images');  // path is relative to server.js
    }
    else
    {
      callback(error, 'backend/images');
    }

  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  //body added to request by body parser
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then((createdPost) => {
    console.log("post saved and id is " + createdPost._id);
    console.log(createdPost);

    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    })
  });

});

router.put('/:id',
  multer({storage: storage}).single('image'),
  (req, res, next) => {
    console.log(req.file);
    let imagePath = req.body.imagePath;
    if(req.file){
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({_id: req.params.id}, post).then((response) => {
    console.log(response);
    res.status(200).json(
      {
        message: 'Update successful',
        post: {
          id: response._id,
          title: response.title,
          content: response.content,
          imagePath: response.imagePath
      }
    })
      ;
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
        content: post.content,
        imagePath: post.imagePath
      });
    }
    else {
      res.status(404).json({
        id: null,
        title: null,
        content: null,
        imagePath: null
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
