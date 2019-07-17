const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.json');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://" + config.development.db_user + ":" + config.development.db_password + "@" + config.development.db_collection + "/test?retryWrites=true&w=majority", {useNewUrlParser: true })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts/', (req, res, next) => {
  console.log(req.post);
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(createdPost => {
    res.status(201).json({
      msessage: 'Post saved successfully',
      postId: createdPost._id,
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        msessage: 'Post fetched successfully',
        posts: documents,
      });
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(201).json({message: 'Post deleted successfully'});
  }).catch(() => {
    console.log('error occurred');
  });
})

module.exports = app;
