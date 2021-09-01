var request = require('request');
var fs = require('fs');

module.exports = {
    getAccessToken : function() {
        return new Promise((resolve, reject) => {
          var options = {
            'method': 'POST',
            'url': 'https://ims-na1.adobelogin.com/ims/exchange/jwt?client_id='+ process.env.ADOBE_CLIENT_ID +'&client_secret='+ process.env.ADOBE_CLIENT_SECRET +'&jwt_token='+ process.env.ADOBE_JWT_TOKEN,
            'headers': {
              'Cookie': 'ftrset=160; relay=5b383fd9-5979-47b9-9bdb-c086f89f1149'
            }
          };
          request(options, function (error, response) {
            if (error) return reject(error);
            else resolve(JSON.parse(response.body));
          });
        });
    },

    bulkDataRequest : function(filePath) {
      return new Promise((resolve, reject) => {
        console.log("Submitting " + filePath + " to adobe analytics...");

        var options = {
          'method': 'POST',
          'url': 'https://analytics-collection.adobe.io/aa/collect/v1/events',
          'headers': {
            'Authorization': 'Bearer ' + process.env.ADOBE_ANALYTICS_API_ACCESS_TOKEN,
            'Cookie': 'ftrset=160; relay=5b383fd9-5979-47b9-9bdb-c086f89f1149',
            'x-api-key': process.env.ADOBE_CLIENT_ID,
            'x-adobe-vgid': 'customer'
          },
          formData: {
            'file': fs.createReadStream(filePath)
          }
        };
        request(options, function (error, response, body) {
          console.log("okay")
          if (error) {
            console.log("Err > ", error);
            reject(error)
          } else {
            console.log('response > ', body);
            resolve(JSON.parse(body))
          }
        });
      });
    }
};