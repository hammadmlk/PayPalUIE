var fs = require("fs"),
    formidable = require("formidable");
var url = require('url');
var database = require('./database');
var database_connection = new database();

//redirect to index.html
function home(response) {
  console.log("Request handler 'home' was called.");

  response.writeHead(302, {'Location': 'index.html'});
  response.end();  
}

//receives payment form and returns confirmation (TODO: adds payment to users transaction log)
function send_payment_api(response, request) {
  console.log("Request handler 'send_payment_api' was called.");

  /*
    add session management code to handle multiple users.
    for now assume only one user
  */
  
  var form = new formidable.IncomingForm();
  
  console.log("about to parse form data");
  
  form.parse(request, function(error, fields, files) {
    //console.log("parsing done");
    
    console.log('Recieved fields: " ', fields)
    
    var responseData = {};
    var to = fields.to;
    var amount = fields.amount;
    
    
    /*
    addValidation check fields code
    */
    var valid=1;
    /*
    Add data to database if valid
    */
    
    // if valid and database success return success
    if (valid && typeof to !== 'undefined' && typeof amount !== 'undefined'){
        // success: respond with to and amount 
        responseData.name = to;
        responseData.amount = amount;
    }
    else{
        // failure response -1
        responseData=-1;
    }
    
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(responseData));
    response.end();
    
  });
}


//send back transaction log received from database_connection
//option1: send latest logs. when latestId=1
//option2: send logLength logs from logStartIndex
    // logLength=2, logStartIndex =10 will send log with id 8 & 9
function get_transactions(response, request) {
    console.log("Request handler 'get_transactions' was called.");

    /*
    Should find out which user is asking for logs
    add session management code to handle multiple users.
    For now assume only one user
    */

    /*
    Talk to database and get transaction logs
    */
    var logs = database_connection.getlogs();
    /* end database */
  
    var query = url.parse(request.url, true).query;  //GET fields
    //console.log('Transaction:Query: ', query)

    // bad validation checks //todo:do better
    var latestId = parseInt(query.latestId);
    var logStartIndex = Math.max(parseInt(query.logStartIndex),0);
    var logLength = Math.max(parseInt(query.logLength),0);

    console.log("Transaction:Query: Summary: ", 'si: ', logStartIndex, 'll: ', logLength, 'lid: ' +latestId);
    
    var responseData;
    
    // if logs from indexStart to indexStart-length requested 
    if (!isNaN(logStartIndex) && !isNaN(logLength)){
        responseData = logs.slice(Math.max(logStartIndex-logLength,0), logStartIndex);
    }
    //if latest logs requested
    else if (!isNaN(latestId)){
        responseData = logs.slice(logs.length-20,logs.length);
    }
    // invalid in GET input
    else {
        responseData=-1;
    }

    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(responseData));
    response.end();
    
}


//sample route handler //TODO: remove
function sample(response) {
    console.log("Request handler 'start' was called.");
    
    var body = 'sample routeHandler';
    
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

exports.home = home;
exports.send_payment_api = send_payment_api;
exports.sample = sample;
exports.get_transactions = get_transactions;