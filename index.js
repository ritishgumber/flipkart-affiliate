var request = require("request");

var createClient = function (credentials) {
  return {
    keywordSearch: fq(credentials, 'keywordSearch'),
    idSearch: fq(credentials,'idSearch'),
    getAllOffers: fq(credentials,'getAllOffers'),
    getDealsOfDay: fq(credentials,'getDealsOfDay'),
    getOrdersReport: fq(credentials,'getOrdersReport'),
    getAppInstReport: fq(credentials,'getAppInstReport'),
    getCategoryFeed: fq(credentials,'getCategoryFeed'),
    getProductsFeed: fq(credentials,'getProductsFeed')
  };
};
//Flipkart APi Query Link Generator
var fq = function (credentials, method) {
  return function (query, cb) {
    var urll = genUrl(query, credentials, method);
    if (typeof cb === 'function') {
      request.get({
        url : urll,
		method:'GET',
        headers : {
				  'Access-Control-Allow-Origin':'*',
          'Fk-Affiliate-Id' : credentials.FkAffId,
          'Fk-Affiliate-Token' : credentials.FkAffToken
        }
      }, function(err, response, body){
        if (err) {
		console.log("err");
          cb(err);
        }
        else if (!response) {
          cb("No response recieved (check internet connection)");
        }
        else if (response.statusCode == 400) {
          cb("Error: Bad request. Invalid input parameters");
        }
        else if (response.statusCode == 401) {
          cb("Error: Unauthorized. API Token or Affiliate Tracking ID invalid");
        }
        else if (response.statusCode == 403) {
          cb("Error: Forbidden. Tampered URL");
        }
        else if (response.statusCode == 404) {
          cb("Error: Not found");
        }
        else if (response.statusCode == 410) {
          cb("Error: URL expired");
        }
        else if (response.statusCode == 500) {
          cb("Error: Internal server error");
        }
        else if (response.statusCode == 503) {
          cb("Error: Service unavailable");
        }
        else if (response.statusCode == 599) {
          cb("Error: Connection timed out");
        }
        else if (response.statusCode == 200){
          cb(null, body);
        }else{
          cb(response);
        }
      });
    }
  }
}

function genUrl(query,credentials,method)
{
if(method=='keywordSearch')
{
  preUrl = credentials.responseType === 'xml' ? 'https://affiliate-api.flipkart.net/affiliate/search/xml?' : 'https://affiliate-api.flipkart.net/affiliate/search/json?';
    url = preUrl + gqp(query, method, credentials);
  
}

  else if (method === 'idSearch') {
    preUrl = credentials.responseType === 'xml' ? 'https://affiliate-api.flipkart.net/affiliate/product/xml?' : 'https://affiliate-api.flipkart.net/affiliate/product/json?';
    url = preUrl + gqp(query, method, credentials);
  }
  else if (method === 'getAllOffers') {
    preUrl = credentials.responseType === 'xml' ? 'https://affiliate-api.flipkart.net/affiliate/offers/v1/all/xml' : 'https://affiliate-api.flipkart.net/affiliate/offers/v1/all/json';
    url = preUrl;
  }
  else if (method === 'getDealsOfDay') {
    preUrl = credentials.responseType === 'xml' ? 'https://affiliate-api.flipkart.net/affiliate/offers/v1/dotd/xml' : 'https://affiliate-api.flipkart.net/affiliate/offers/v1/dotd/json';
    url = preUrl;
  }
  else if (method === 'getOrdersReport') {
    preUrl = credentials.responseType === 'xml' ? 'https://affiliate-api.flipkart.net/affiliate/report/orders/detail/xml?' : 'https://affiliate-api.flipkart.net/affiliate/report/orders/detail/json?';
    url = preUrl + gqp(query, method, credentials);
  }
  else if (method === 'getAppInstReport') {
    preUrl = credentials.responseType === 'xml' ? 'https://affiliate-api.flipkart.net/affiliate/v1/appInstall/xml?' : 'https://affiliate-api.flipkart.net/affiliate/v1/appInstall/json?';
    url = preUrl + gqp(query, method, credentials);
  }
  else if (method === 'getCategoryFeed') {
    preUrl = credentials.responseType === 'xml' ? '.xml' : '.json';
    url = 'https://affiliate-api.flipkart.net/affiliate/api/' + query['trackingId'] + preUrl + gqp(query, method, credentials);
  }
  else if (method === 'getProductsFeed') {
    url = query['url'];
  }
return url;
}
//Fetch Query Parameters
var gqp = function (query, method, credentials) {
  var params = '';
  if (method === 'getCategoryFeed') {
    for(var pr in query){
      if(pr != 'trackingId'){
        params = params + pr + '=' + query[pr] + '&';
      }
    }
  } else {
    for(var pr in query){
        params = params + pr + '=' + query[pr] + '&';
    }
  }
  params = params.substring(0, params.length - 1);
  return params;
}


exports.createClient = createClient;

