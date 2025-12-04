const express = require("express");
const db = require("../db");
const upload = require("./multer");
const compressVideo = require("../utils/compress");
const generateThumb = require("../utils/thumb");
const fs = require("fs");

const router = express.Router();

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file received" });

    const inputPath = req.file.path;
    const compressedPath = "uploads/videos/c_" + req.file.filename;
    const thumbPath = "uploads/thumbs/" + req.file.filename + ".jpg";

    // Compress
    await compressVideo(inputPath, compressedPath);

    // Thumbnail
    await generateThumb(compressedPath, thumbPath);

    // Delete original big file
    fs.unlinkSync(inputPath);

    // Save to DB
    const sql = "INSERT INTO videos (video, thumbnail) VALUES (?, ?)";
    await db.promise().query(sql, [compressedPath, thumbPath]);

    res.json({
      msg: "Uploaded successfully",
      video: compressedPath,
      thumb: thumbPath
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Upload failed" });
  }
});


router.get("/all", (req, res) => {
  const sql = "SELECT * FROM videos ORDER BY id DESC";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(
      rows.map((v) => ({
        id: v.id,
        filename: v.video,
        video: v.video,
        thumbnail: v.thumbnail
      }))
    );
  });
});



module.exports = router;