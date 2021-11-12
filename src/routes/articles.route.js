const express = require('express');
const router = express.Router();
const ArticlesServices = require('../services/articles.services');

const articlesServices = new ArticlesServices();

router
  .post('', (req, res) => {
    try {
        const result = articlesServices.post(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message)
    }
  })
  .patch('', (req, res) => {
    try {
        articlesServices.update(req.body)
        res.status(200).send('The articles were updated.');
    } catch (error) {
        res.status(500).send(error.message)
    }
  })
  .delete('', (req, res) => {
    try {
        articlesServices.delete(req.body)
        res.status(200).send('The articles were deleted.');
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router;