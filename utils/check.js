exports.contentType = (ext) => {
  switch (ext) {
    case "txt":
      return "text/plain";
    case "html":
      return "text/html";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";

    default:
      return `image/${ext}`;
  }
};

exports.cacheControl = (sec = 60) => {
  return `public, max-age=${sec}`;
};
