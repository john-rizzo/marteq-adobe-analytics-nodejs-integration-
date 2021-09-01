var express = require('express');
const AdobeAnalytics = require('../helpers/AdobeAnalytics');
var router = express.Router()
var Adobe = require('../helpers/AdobeAnalytics')
var Marteq = require('../helpers/Marteq')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
});

router.get('/generate_and_submit_file', function(req, res, next) {
  
  // Call marteq API and generate CSV files
  Marteq.createCSVWithCustomerBrowsingData().then((filePath) => {

    // submit generated file to adobe analytics
    AdobeAnalytics.bulkDataRequest(filePath).then(response => {
      res.send(response);
    }).catch(err => {
      res.send(err);  
    });
  }).catch((err) => {
    res.send(err);
  });

})

router.get('/access_token', function(req, res, next) {
  Adobe.getAccessToken().then(data => {
    console.log('Access token > ', data);
    res.send("ok");
  }).catch(err => {
    console.log('Error when fetching token... ', err);
    res.send("ok");
  });
})

module.exports = router;
