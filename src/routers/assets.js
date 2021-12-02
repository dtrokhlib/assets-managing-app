const express = require("express");
const router = new express.Router();
const removeFile = require('../helprers/removeFile');
const { FileUploader } = require("../middleware/fileUpload");

const Assets = require('../models/assets');
const auth = require('../middleware/auth');

router.get("/assets/:id", auth, async (req, res) => {
    try {
        const asset = await Assets.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if(!asset) {
            return res.status(404).send();
        }

        res.send(asset);
    } catch(e) {
        res.status(500).send(e);
    }
});


router.get("/assets", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if(req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === 'desc' ? 1 : -1;
  }

  if(req.query.filename) {
      match.filename = { $regex: req.query.filename };
  }

  if(req.query.name) {
      match.name = { $regex: req.query.name } ;
  }

  try {
    await req.user.populate({
        path: 'assets',
        match,
        options: {
            limit: parseInt(req.query.limit) || 10,
            skip: parseInt(req.query.skip) || 0,
            sort
        }
    });

    res.send(req.user.assets)

  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/assets/upload/:id", auth, FileUploader.single('upload'), async (req, res) => {
    try {
        const asset = new Assets({
          filename: req.file.filename,
          destination: req.file.destination,
          name: req.body.assetName,
          owner: req.user._id,
        });

        await asset.save();
        res.send(asset);
    } catch(e) {
        res.status(500).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.patch("/assets/:id", auth, FileUploader.single('upload') ,async (req, res) => {
    try {
        const asset = await Assets.findOne({
            _id: req.params.id,
            owner: req.user._id
        });
        
        if(!asset) {
            return res.status(404).send();
        }

        await removeFile(asset.filename, asset.destination);

        asset.filename = req.file.filename;
        asset.destination = req.file.destination;

        await asset.save();

        res.send(asset);

    } catch(e) {
        res.status(400).send(e);
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete("/assets/:id", auth, async (req, res) => {
    try {

        const asset = await Assets.findOneAndDelete({
          _id: req.params.id,
          owner: req.user._id,
        });

        if (!asset) {
          return res.status(404).send();
        }

        await removeFile(asset.filename, asset.destination);

        res.send(asset);
    } catch(e) {
        res.status(500).send(e);
    }
});

module.exports = router;
