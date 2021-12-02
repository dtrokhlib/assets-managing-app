const express = require('express');
const app = express();
const path = require('path');
require('./db/mongoose');

const userRouter = require('./routers/user');
const assetsRouter = require("./routers/assets");
const dataListRouter = require("./routers/data-list");

const StaticPublicPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(StaticPublicPath));

app.use(userRouter);
app.use(assetsRouter);
app.use(dataListRouter);

module.exports = app;



