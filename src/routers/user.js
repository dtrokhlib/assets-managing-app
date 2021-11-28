const express = require("express");
const router = new express.Router();
const { AvatarUploader } = require("../middleware/fileUpload");
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users/log-in', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.username, req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        });

    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/sign-in', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({
            user,
            token
        });

    } catch(e) {
        res.status(400).send(e);
    }
});

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
        
    } catch(e) {
        res.status(400).send(e)
    }
});

router.patch('/users/me/avatar', auth, AvatarUploader.single('upload'), async (req, res) => {
    try { 
        const buffer = await sharp(req.file.buffer).resize({ width: 100, height: 100 }).png().toBuffer();

        req.user.userPhoto = buffer;

        await req.user.save();
        
        res.send();

    } catch(e) {
        res.status(500).send(e);
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

module.exports = router;

