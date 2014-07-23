var http = require("http");
var fs = require('fs');
var cwd = process.cwd(); // does not end with a slash
var mime = require('mime');

module.exports = {
  start: function (options) {

    options = options || {};
    options.port = options.port || 8080;

    this.server = http.createServer(function (request, response) {
      var match = request.url.match(/(^[^\?]*).*/);
      var filePath = cwd + match[1];
      if (!filePath.match(/\.[^\/]+$/)) {
        if (request.method === 'GET') {
          filePath += '.json';
        } else {
          filePath += ('_' + request.method + '.json');
        }
      }

      if (fs.existsSync(filePath)) {
        var stat = fs.statSync(filePath);
        var headers = {
          "Content-Type": "text/json",
          "Content-Length": stat.size
        };
        var contentType = mime.lookup(filePath);
        if (contentType) {
          headers['Content-Type'] = contentType;
        }
        if (options.cors) {
          headers['Access-Control-Allow-Origin'] = '*';
        }
        if (filePath.match(/.*\.json/)) {
          var statusCode = 200;
          var _headers = {};
          fs.readFile(filePath, 'utf8', function (err, data) {
            var content = data;
            var match = data.match(/\*({[^}]*})\s*\n(.*)/);
            if (match) {
              try {
                var meta = JSON.parse(match[1]);
                statusCode = meta.code || 200;
                headers = meta.headers || {};
              } catch (e) {
                console.log('invalid meta data for ' + filePath + ': ' + e);
              }
              content = match[2];
            }
            for (var name in _headers) {
              headers[name] = _headers[_name];
            }
            response.writeHead(statusCode, headers);
            response.write(content);
            response.end();
          });
        } else {
          response.writeHead(200, headers);

          var readStream = fs.createReadStream(filePath);
          readStream.on('data', function (data) {
            response.write(data);
          });
          readStream.on('end', function () {
            response.end();
          });
        }
      } else {
        response.writeHead(404, {});
        response.write(filePath);
        response.end();
      }
    });

    this.server.listen(options.port);
    console.log('server started on port: ' + options.port);
  }
};
