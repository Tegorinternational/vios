const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/videos");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".mp4");
    }
});

module.exports = multer({ storage });