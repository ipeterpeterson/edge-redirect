'use strict';

var obj = require('./redirects.json');

// console.log(obj.http);

var objX = obj.http;

exports.handler = (event, context, callback) => {
  /*
   * Generate HTTP redirect response with 302 status code and Location header.
   */

   // get request
   const request = event.Records[0].cf.request;
   // console.log(request);

   // get path from request
   const path = request.uri;
   console.log(path);

   // strip / from path
   var pathX = path.replace('/', '');

   let response={};

   // redirect logic
   if (pathX in objX){
     // path exists
     console.log('Redirecting from a known link...');
     response = {
         status: '302',
         statusDescription: 'Found',
         headers: {
             location: [{
                 key: 'Location',
                 value: objX[pathX],
             }],
         },
     };
   } else {
     // path does not exist
     console.log('Redirecting from an unknown link...');
     response = {
         status: '302',
         statusDescription: 'Found',
         headers: {
             location: [{
                 key: 'Location',
                 value: 'https://www.google.com',
             }],
         },
     };
   }

   // adding cf lambda@edge region to header
   response.headers['x-lambda-region'] = [{key: 'X-Lambda-Region', value: process.env.AWS_REGION}];
   callback(null, response);
};
