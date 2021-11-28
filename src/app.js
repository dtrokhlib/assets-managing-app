const express = require('express');
const app = express();
const path = require('path');
require('./db/mongoose');

const userRouter = require('./routers/user');
const assetsRouter = require("./routers/assets");

const StaticPublicPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(StaticPublicPath));

app.use(userRouter);
app.use(assetsRouter);

module.exports = app;



