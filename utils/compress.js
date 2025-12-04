const { exec } = require("child_process");

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i ${inputPath} -vcodec libx264 -crf 28 ${outputPath}`;

    exec(cmd, (error) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
}

module.exports = compressVideo;