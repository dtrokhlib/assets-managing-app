const express = require('express');

const auth = require('../middleware/auth');
const { loadData } = require('../helprers/data-loader');

const dataListRouter = express.Router();

dataListRouter.get('/data-list/sample', auth, async (req, res) => {
    try {
        const data = await loadData();
        res.send(data);
    } catch (e) {
        res.status(500).send(e)
    }
});

module.exports = dataListRouter;