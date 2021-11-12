require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use('/', require('./routes'));

module.exports = app;