const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config.env" });
require("./db/connection");
app.use(express.json());
const User = require("./models/UserSchema");
app.use(cookieParser(process.env.SECRET_KEY));
app.use(require("./router/auth"));
app.use(require("./router/post"));
app.use(require("./router/questions"));
app.use(require("./router/opp"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Connected to PORT : ${PORT}`);
});
