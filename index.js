// Simple API to serve JSON objects from Fivethirtyeight public CSV files.
// Need to implement: Parameter matching, Sort, Search functionality.
// node index.js
'use strict';

require('dotenv').config();

// MAIN REQUIRE's
const getData = require('./data.js');

const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');
const async = require('async');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

app.enable('trust proxy');

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
// polls/:resource
// resource can be one of: generic_ballot_polls, governor_polls, senate_polls, house_polls,
// pres_primary_avgs_2020, president_approval_polls, president_polls, president_primary_polls
app.get(`/polls/:resource`, (req, res, next) => {
    let resource = req.params.resource;
    let resource_path = __dirname + '/polls/json/' + resource + `_${year}${month}${day}.json`
    getData(resource);
    res.setHeader('content-type','application/json');
    res.sendFile(resource_path);

});

app.listen(8657, 'localhost',  () => console.log('POLL DATA APP RUNNING PORT 8657'));