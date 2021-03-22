const http = require("http");
const fs = require("fs");
const path = require("path");

const hostname = "localhost";
const port = 8080;

const server = http.createServer(function (req, res) {
  let filePath = "." + req.url;
  if (filePath == "./") filePath = "./index.html";

  let extname = path.extname(filePath);
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
  }

  fs.readFile(filePath, function (error, content) {
    if (error) {
      res.writeHead(500);
      console.log("Error: " + error.code);
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });

  if (req.method == "POST") {
    var jsonString = JSON.parse(fs.readFileSync("data.json", "utf8"));

    req.on("data", function (data) {
      jsonString.push(data.toString());
      fs.writeFileSync("data.json", JSON.stringify(jsonString));
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
