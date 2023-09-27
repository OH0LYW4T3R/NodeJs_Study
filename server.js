const express = require("express"); // include express
const app = express(); // Generate Object
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, function () {
  // Open Server
  console.log("listening on 8080");
}); // 1 parameter : port, 2 parameter : Server on -> Run code

app.get("/pet", function (request, response) {
  // Get request : route(/pet)
  response.send("펫 용품 쇼핑할 수 있는 페이지입니다.");
}); // 1 parameter : route,
// 2 parameter : route -> Run code and this parameter requires two - parameters (request, response)
/* 
request : request information
response : response way
*/

app.get("/beauty", function (req, res) {
  // Get request : route(/beauty)
  res.send("뷰티 용품 쇼핑 페이지 입니다.");
});

app.get("/", function (req, res) {
  // Get request : route(/)
  res.sendFile(__dirname + "/index.html");
  console.log(req);
});

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.post("/add", function (req, res) {
  res.send("전송완료");
  console.log(req.body.title); // req.body = form contents (object) ex) { title: 'asdf', date: 'fads' }
});
