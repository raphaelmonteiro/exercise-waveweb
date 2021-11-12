const express = require('express');
const router = express.Router();
const { paginate } = require('../middleware')

router
  .get('/', paginate(), (req, res) => {
    try {
        res.json(res.paginated);
    } catch (error) {
        res.status(500).send(error.message)
    }
  })

module.exports = router;