const { exec } = require("child_process");

function generateThumb(inputPath, thumbPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i ${inputPath} -ss 00:00:01 -vframes 1 ${thumbPath}`;

    exec(cmd, (error) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
}

module.exports = generateThumb;