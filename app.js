// module
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { WebSocket, WebSocketServer } = require("ws");
// built in module
const path = require("path"); // 경로 설정
// create module
// const routes = require("./routes");

const app = express();

// port
app.set("port", process.env.PORT || 8888);
// static path
app.use(express.static(path.join(__dirname, "public")));
// log
app.use(morgan("dev"));
// routes
// app.use(routes);

app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

app.post("/login", (req, res) => {});

// run
app.listen(app.get("port"), () => {
  console.log(app.get("port"), " : server listening !");
});
