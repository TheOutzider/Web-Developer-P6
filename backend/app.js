/** Require */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");
const path = require("path");
/** Constantes */
const app = express();
/** connextion à Mongo DataBase */
mongoose.connect(process.env.MONCON_URL);

/** Applications des Headers */

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/** Routes et uses */

app.use(bodyParser.json());
app.use(express.json());
app.use("/api/sauces/", saucesRoutes);
app.use("/api/auth/", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
