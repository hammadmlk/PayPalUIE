fs = require("fs");
var path = require('path');

// calls the route handler if it exists
// if not checks for file matching pathname in static folder
// if not returns 404
function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  
  // call handle function if it exists
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  }
  // find files in static folder
  else{ 
    pathname = "/static"+pathname;
    fs.exists(path.join(__dirname, pathname), function (exists) {
        if (exists) {
            response.writeHead(200, {'Content-Type': ''});
            fs.createReadStream('.'+pathname).pipe(response);
        } 
        else{
            console.log("No request handle or static file found for " + pathname);
            response.writeHead(404, {"Content-Type": "text/html"});
            response.write("404 not found");
            response.end();
        }
    });
  }
}

exports.route = route;
