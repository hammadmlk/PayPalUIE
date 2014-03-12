var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");


// function requestHandlers.XXX is called for each handle[/XXX]. where /XXX is the uri
// all files in static folder are automatically mapped. See router.js

var handle = {}     

handle["/"] = requestHandlers.home;
handle["/home"] = requestHandlers.home;

handle["/send_payment_api"] = requestHandlers.send_payment_api;
handle["/sample"] = requestHandlers.sample;

handle["/get_transactions"] = requestHandlers.get_transactions;

server.start(router.route, handle);
