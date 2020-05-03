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
const getCSV = async (poll_name) => {
    let poll_path =  __dirname + `/polls/${poll_name}_${year}${month}${day}.csv`;
    if(fs.existsSync(poll_path)) {
        return poll_path;
    } else {
        request(poll_path, (error, res, file) => {
            if (error) { throw new Error; }
            else {
                fs.writeFileSync(poll_path, file);
                console.log('CSV file saved: ' + poll_path);
                return poll_path;
            }
        });
        return poll_path;
    }
};

// Convert CSV file to JSON
const convertToJSON = async (poll_name) => {
    const csvFilePath = await getCSV(poll_name);
    const csvconvert = csv().fromFile(csvFilePath);
    return csvconvert;
}

// Finally, Save Data as JSON
const saveDataAsJSON = async (poll_name) => {
    const data = await convertToJSON(poll_name);
    fs.writeFile(__dirname + `/polls/${poll_name}_${year}${month}${day}.json`, JSON.stringify(data), (err) => {
        if (err) { throw new Error };
        console.log('JSON file saved: ' + __dirname + `/polls/${poll_name}_${year}${month}${day}.json`)
    });
};

saveDataAsJSON('president_primary_polls');
saveDataAsJSON('president_polls');
saveDataAsJSON('president_approval_polls');
saveDataAsJSON('pres_primary_avgs_2020');

saveDataAsJSON('senate_polls');
saveDataAsJSON('house_polls');
saveDataAsJSON('governor_polls');
saveDataAsJSON('generic_ballot_polls');

module.exports = saveDataAsJSON;