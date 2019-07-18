const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.json');

const postsRoutes = require('./routes/posts');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
