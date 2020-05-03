// Simple API to serve JSON objects from Fivethirtyeight public CSV files.
// node index.js
'use strict';

require('dotenv').config();
// MAIN REQUIRE's
const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');
const async = require('async');
const request = require('request');
const url = require('url');

const lodash = require('lodash');
const express = require('express');
const app = express();

const escapeHTML = require('escape-html');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

app.enable('trust proxy'); // Use for reverse proxy with nginx
app.set('view engine', 'ejs');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply limiter to all requests
app.use(limiter);

// Use Helmet
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.featurePolicy({
  features: {
    fullscreen: ["'self'"],
    vibrate: ["'none'"],
    payment: ["'self'"],
    syncXhr: ["none'"]
  }
}));

// Compression and content, Body parser, content paths
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const today_date = new Date();
const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today_date);
const month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(today_date);
const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today_date);

// START ROUTES
// GET - / 
// Load index page
app.get(`/:resource`, (req, res, next) => {
    let resource = req.params.resource + `_${year}${month}${day}`;
    res.sendFile(__dirname + `/polls/${resource}.json`);
});

app.listen(8657, 'localhost',  () => console.log('POLL DATA APP RUNNING PORT 8657'));