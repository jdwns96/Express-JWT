// module
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { WebSocket, WebSocketServer } = require("ws");
// built in module
const path = require("path"); // 경로 설정
// create module
// const routes = require("./routes");

// DB
const userTable = [
  {
    id: "1",
    user_id: "foo",
    password: "123",
    name: "foo",
    refresh_token: null,
  },
  {
    id: "2",
    user_id: "boo",
    password: "123",
    name: "boo",
    refresh_token: null,
  },
];

// express instance
const app = express();
// port
app.set("port", process.env.PORT || 8888);
// cors
app.use(cors());
// body parser
app.use(express.json());
// static path
app.use(express.static(path.join(__dirname, "public")));
// log
app.use(morgan("dev"));
// routes
// app.use(routes);

app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
  // res.status(200).json({
  //   massage: "OK",
  // });
});

app.post("/login", async (req, res) => {
  const { user_id, password } = req.body;

  const value = userTable.find(
    (elem, index) => elem.user_id === user_id && elem.password === password
  );
  if (value) {
    return res.status(403).json({
      massage: "NO",
    });
  }
  return;
  // DB
});

// run
app.listen(app.get("port"), () => {
  console.log(app.get("port"), " : server listening !");
});
