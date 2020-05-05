// Simple Nodejs program to pull CSV files from Fivethirtyeight and convert to json
// Run: node data.js
'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
const rp = require('request-promise');
const extract = require('extract-zip');
const csv = require('csvtojson');

// Set request parameters here
// Add CLI functionality and more parameters in the future
const today_date = new Date();
const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today_date);
const month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(today_date);
const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today_date);

// Get CSV file from FiveThirtyEight
const getCSV= async (poll_name) => {
    let csv_path =  __dirname + `/polls/csv/${poll_name}_${year}${month}${day}.csv`;
    request(`https://projects.fivethirtyeight.com/polls-page/${poll_name}.csv`, (error, res, file) => {
        fs.writeFileSync(csv_path, file, { flag: "w" });
        console.log('CSV file saved: ' + csv_path);
    });
    return csv_path;
};

const convertToJSON = async (poll_name) => {
    let csv_path = await getCSV(poll_name);
    let json_path = __dirname + `/polls/json/${poll_name}_${year}${month}${day}.json`;
    // Convert from csv to JSON
    const jsonArray=await csv().fromFile(csv_path);
    // Write JSON Object
    fs.writeFileSync(json_path, JSON.stringify(jsonArray), { flag: "w" }, (err) => {
        if (err) { throw new Error };
        console.log('JSON file saved: ' + json_path);
        return json_path;
    });
};

convertToJSON('governor_polls');
convertToJSON('generic_ballot_polls');
convertToJSON('house_polls');
convertToJSON('senate_polls');
convertToJSON('pres_primary_avgs');
convertToJSON('president_approval_polls');
convertToJSON('president_polls');
convertToJSON('president_primary_polls');

module.exports = convertToJSON;