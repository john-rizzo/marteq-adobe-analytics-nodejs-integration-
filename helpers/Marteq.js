var request = require('request');
var csvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
var uuid = require('uuid');
const zlib = require('zlib');
const fs = require('fs');

var obj = {};

obj.createCSVWithCustomerBrowsingData = () => {
    return new Promise((resolve, reject) => {
        
        if(!process.env.MARTEQ_API_URL) {
            console.log('No API keyfound');
            return reject({error: 'No API keyfound'});
        }

        console.log('Requesting data from MarteQ...');

        const options = {
        url: process.env.MARTEQ_API_URL,
        headers: {
            'User-agent': 'MarteQ-SDK',
            'x-auth': process.env.MARTEQ_API_KEY
        }};
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                const info = JSON.parse(body);
                console.log('Received data from marteq... ');

                var fileName = 'data-' + moment().format('mm-DD-yyyy') + '-' + uuid.v4() + '.csv';
                var filePath = require('path').resolve('./') + '/public/csv-files/' + fileName;

                console.log('Preparing to write into CSV...');
                const csvObj = csvWriter({
                    path: filePath,
                    header: [
                        {id: 'marketingCloudVisitorID', title: 'marketingCloudVisitorID'},
                        {id: 'pageURL', title: 'pageURL'},
                        {id: 'pageName', title: 'pageName'},
                        {id: 'reportSuiteID', title: 'reportSuiteID'},
                        {id: 'timestamp', title: 'timestamp'},
                        {id: 'userAgent', title: 'userAgent'},
                      ]
                });

                var newArr = [];

                info.data.forEach(d => {
                    newArr.push({
                        marketingCloudVisitorID: d.customer_id ? d.customer_id  : '12',
                        pageURL: d.active_tab,
                        pageName: d.name,
                        timestamp: moment(d.date).format(),
                        userAgent: d.web_server,
                        reportSuiteID: process.env.ANALYTICS_REPORT_SUIT_ID
                    });
                });

                console.log(newArr);

                csvObj.writeRecords(newArr).then(()=> console.log('Data written into csv successfully.'));

                console.log('gzipping the file...');

                const fileContents = fs.createReadStream(filePath);
                const writeStream = fs.createWriteStream(filePath + '.gz');
                const gzip = zlib.createGzip();
                fileContents.pipe(gzip).pipe(writeStream).on('finish', (err) => {
                    if(err) {
                        reject(err)
                    } else {
                        console.log('File gzipped and saved.');
                        resolve(filePath + '.gz')
                    }
                });
            } else {
                reject(error);
            }
        }

        // send marteq Data API request
        request(options, callback);
    });
};

obj.getCustomerBrowsingData = () => {
    return new Promise((resolve, reject) => {
        
        if(!process.env.MARTEQ_API_URL) {
            console.log('No API keyfound');
            return reject({error: 'No API keyfound'});
        }

        console.log('Requesting data from MarteQ...');

        const options = {
        url: process.env.MARTEQ_API_URL,
        headers: {
            'User-agent': 'MarteQ-SDK',
            'x-auth': process.env.MARTEQ_API_KEY
        }};
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                const info = JSON.parse(body);
                // do something with info
                resolve(info);
            } else {
                reject(error);
            }
        }

        // send marteq Data API request
        request(options, callback);
    });
};

module.exports = obj;
