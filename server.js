require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/auth");
const toDos = require("./routes/todos");

app.use(
  cors({
    //origin : to be set later
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api/todos", toDos);

app.post("/api", (req, res, next) => {
  res.send("Connected to express server");
});

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});
