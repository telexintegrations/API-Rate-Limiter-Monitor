const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');
const tickRoutes = require('./routes/tickRouter');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);
app.use('/', tickRoutes);

module.exports = app;
