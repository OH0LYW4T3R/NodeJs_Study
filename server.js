const express = require("express"); // include express
const app = express(); // Generate Object

app.listen(8080, function () {
  console.log("listening on 8080");
}); // 1 parameter : port, 2 parameter : Server on -> Run code

app.get("/pet", function (request, response) {
  response.send("펫 용품 쇼핑할 수 있는 페이지입니다.");
}); // 1 parameter : route,
//2 parameter : route -> Run code and this parameter requires two - parameters (request, response)

app.get("/beauty", function (req, res) {
  res.send("뷰티 용품 쇼핑 페이지 입니다.");
});
