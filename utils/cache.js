const path = require("path");
const fs = require("fs-extra");

exports.getData = (videoId) => {
  try {
    let cacheDir = path.join(global.dir, ".storage"),
      cacheFile = path.join(cacheDir, `${videoId}`);

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    if (fs.existsSync(cacheFile)) {
      const read = fs.readFileSync(cacheFile, "utf8");
      try {
        return JSON.parse(read);
      } catch (error) {
        return { error: true, msg: "JSON" };
      }
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: true };
  }
};

exports.saveData = (videoId, data) => {
  try {
    let cacheDir = path.join(global.dir, ".storage"),
      cacheFile = path.join(cacheDir, `${videoId}`);

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    //console.log(`new-cache`, videoId);
    fs.writeFileSync(cacheFile, JSON.stringify(data), "utf8");
  } catch (error) {
    return { error: true };
  }
};
