const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = `./public/store/` + req.user._id.toString();
    fs.exists(userFolder, (exists) => {
      if (exists) {
        cb(null, userFolder);
      } else {
        fs.mkdir(userFolder, (err) => cb(err, userFolder));
      }
    });
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 100);

    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

const AvatarUploader = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(
        new Error("File must be one of the following type: .PNG, .JPG, .JPEG")
      );
    }
    cb(undefined, true);
  },
});

const FileUploader = multer({
  storage,
  dest: "./public/store",
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(
        /\.(png|jpg|jpeg|zip|pdf|docx|doc|pptx|ppt|txt)$/
      )
    ) {
      return cb(
        new Error(
          "File must be one of the following type: png|jpeg|jpeg|zip|pdf|docx|doc|pptx|ppt|txt"
        )
      );
    }
    cb(undefined, true);
  },
});

module.exports = { AvatarUploader, FileUploader };
