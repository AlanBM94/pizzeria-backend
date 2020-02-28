const multer = require("multer");
const uuid = require("uuid/v1");

const MYME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MYME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MYME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid myme type");
    cb(error, isValid);
  }
});

module.exports = fileUpload;
