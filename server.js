// const express = require("express"); // include express
// const app = express(); // Generate Object
// const bodyParser = require("body-parser");
// const { MongoClient } = require("mongodb");

// app.set("view engine", "ejs");

// let db;
// const url =
//   "mongodb+srv://admin:<password>@mongodb-cluster.duazndc.mongodb.net/?retryWrites=true&w=majority";
// new MongoClient(url)
//   .connect() // Mongodb connect
//   .then((client) => {
//     // if connect
//     console.log("DB연결성공");
//     db = client.db("forum");

//     app.listen(8080, function () {
//       // Open Server
//       console.log("listening on 8080");
//     }); // 1 parameter : port, 2 parameter : Server on -> Run code
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/pet", function (request, response) {
//   // Get request : route(/pet)
//   response.send("펫 용품 쇼핑할 수 있는 페이지입니다.");
// }); // 1 parameter : route,
// // 2 parameter : route -> Run code and this parameter requires two - parameters (request, response)
// /*
// request : request information
// response : response way
// */

// app.get("/beauty", function (req, res) {
//   // Get request : route(/beauty)
//   res.send("뷰티 용품 쇼핑 페이지 입니다.");
// });

// app.get("/", function (req, res) {
//   // Get request : route(/)
//   res.sendFile(__dirname + "/index.html");
// });

// app.get("/write", function (req, res) {
//   res.sendFile(__dirname + "/write.html");
// });

// app.get("/list", async (req, res) => {
//   let result = await db.collection("post").find().toArray(); // 처리가 오래 걸리므로 await을 써서 잠깐 기달려 달라는 의미 찾을게 여려개 일땐 toArray
//   console.log(result);

//   res.render("list.ejs", { posts: result });
// });

// app.post("/add", async (req, res) => {
//   res.send("전송완료");
//   //console.log(req.body.title); // req.body = form contents (object) ex) { title: 'asdf', date: 'fads' }

//   let result = await db.collection("counter").findOne({ name: "게시물개수" });

//   db.collection("post").insertOne(
//     { _id: result.totalPost + 1, Title: req.body.title, Date: req.body.date },
//     function (err, result) {}
//   );

//   await db
//     .collection("counter")
//     .updateOne(
//       { name: "게시물개수" },
//       { $inc: { totalPost: 1 } },
//       (err, result) => {
//         if (err) {
//           return console.log(err);
//         }
//       }
//     );
// });

// app.delete("/delete", async (req, res) => {
//   console.log(req.body);

//   req.body._id = parseInt(req.body._id);

//   await db.collection("post").deleteOne(req.body, (err, result) => {
//     console.log("삭제완료");
//     res.status(200).send({ message: "성공했습니다" });
//   });
// });

const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
let db;
const url =
  "mongodb+srv://admin:004025cks@mongodb-cluster.duazndc.mongodb.net/?retryWrites=true&w=majority";
const methodOverrid = require("method-override");

app.use(methodOverrid("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");

    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/news", (req, res) => {
  //응답.send("오늘 비옴");
});

app.get("/list", async (req, res) => {
  let result = await db.collection("post").find().toArray();

  res.render("list.ejs", { posts: result });
});

app.get("/time", (req, res) => {
  const KR_TIME_OFFSET = 9 * 60 * 60 * 1000;
  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const KR_DATE = new Date(utc + KR_TIME_OFFSET);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  const formattedDate = KR_DATE.toLocaleString("ko-KR", options);

  res.render("time.ejs", { time: formattedDate });
});

app.get("/write", (req, res) => {
  res.render("write.ejs");
});

app.post("/add", async (req, res) => {
  console.log(req.body);

  try {
    if (req.body.title == "" || req.body.content == "") {
      res.send("제목 혹은 내용이 입력 되지 않았습니다.");
    } else {
      await db
        .collection("post")
        .insertOne({ title: req.body.title, content: req.body.content });

      res.redirect("/list");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("서버 에러");
  }
});

app.get("/detail/:id", async (req, res) => {
  try {
    let result = await db
      .collection("post")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (result == null) res.status(404).send("이상한 url 입력함");

    res.render("detail.ejs", { result: result });
  } catch (e) {
    console.log(e);
    res.status(404).send("이상한 url 입력함");
  }
});

app.get("/edit/:id", async (req, res) => {
  let result = await db
    .collection("post")
    .findOne({ _id: new ObjectId(req.params.id) });

  res.render("edit.ejs", { result: result });
});

app.put("/edit", async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.title == "" || req.body.content == "") {
      console.log("Client error");
      res.send("Value Error");
    } else {
      await db
        .collection("post")
        .updateOne(
          { _id: new ObjectId(req.body._id) },
          { $set: { title: req.body.title, content: req.body.content } }
        );

      res.redirect("/list");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("DB Error");
    console.log("DB error");
  }
});
