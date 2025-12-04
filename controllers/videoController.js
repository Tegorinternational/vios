const db = require("../db");
const compressVideo = require("../utils/compress");
const generateThumb = require("../utils/thumb");
const fs = require("fs");

exports.uploadVideo = async (req, res) => {
  try {
    const originalPath = req.file.path;
    const compressedPath = "uploads/videos/c_" + req.file.filename;
    const thumbName = req.file.filename + ".jpg";

    // compress
    await compressVideo(originalPath, compressedPath);

    // generate thumb
    await generateThumb(compressedPath, thumbName);

    // delete original
    fs.unlinkSync(originalPath);

    // save DB
    const sql = "INSERT INTO videos (video, thumbnail) VALUES (?, ?)";
    db.query(sql, [compressedPath, "uploads/thumbs/" + thumbName]);

    res.json({ success: true, video: compressedPath });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

exports.getVideos = (req, res) => {
  db.query("SELECT * FROM videos ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};