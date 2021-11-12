const express = require('express');
const router = express.Router();

const authorsRoutes = require('./authors.route');
const articlesRoutes = require('./articles.route');

router
  .use('/authors', authorsRoutes)
  .use('/articles', articlesRoutes);
 
module.exports = router;