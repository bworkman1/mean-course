const express = require('express');


const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const Posts = require('../controllers/posts');

const router = express.Router();

router.post(
  '',
  checkAuth,
  extractFile,
  Posts.createPost
);

router.put(
  '/:id',
  checkAuth,
  extractFile,
  Posts.updatePost
);

router.get(
  '',
  Posts.getPosts
);

router.get(
  '/:id',
  Posts.getPost
);

router.delete(
  '/:id',
  checkAuth,
  Posts.deletePost
);

module.exports = router;

