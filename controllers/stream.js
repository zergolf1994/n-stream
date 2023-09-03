const request = require("request");
const http = require("http");

const { File } = require("../models");
const { Check, Cacher } = require("../utils");

exports.streamTS = async (req, res) => {
  try {
    const { videoId, item } = req.params;
    const ext = req.params[0];

    let row = Cacher.getData(videoId);
    if (row?.error) {
      const rows = await File.Data.aggregate([
        { $match: { _id: videoId, active: true } },
        //server
        {
          $lookup: {
            from: "servers",
            localField: "serverId",
            foreignField: "_id",
            as: "servers",
            pipeline: [
              { $match: { type: "storage" } },
              {
                $project: {
                  _id: 0,
                  svIp: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            server: { $arrayElemAt: ["$servers", 0] },
          },
        },
        //files
        {
          $lookup: {
            from: "files",
            localField: "fileId",
            foreignField: "_id",
            as: "files",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  slug: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            file: { $arrayElemAt: ["$files", 0] },
          },
        },
        {
          $set: {
            svIp: "$server.svIp",
            slug: "$file.slug",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            svIp: 1,
            slug: 1,
          },
        },
      ]);

      row = rows?.at(0);
      if (!row?._id) return res.status(404).end();
      Cacher.saveData(videoId, row);
    }

    const url = `http://${row.svIp}:8889/hls/${row.slug}/file_${row.name}.mp4/seg-${item}-v1-a1.ts`;

    request({ url }, (err, resp, body) => {})
      .on("response", function (res) {
        res.headers["content-type"] = Check.contentType(ext);
        res.headers["Cache-control"] = Check.cacheControl();
      })
      .pipe(res);
  } catch (err) {
    return res.status(500).end();
  }
};

exports.streamMP4 = async (req, res) => {
  try {
    const { videoId } = req.params;

    let row = Cacher.getData(videoId);
    if (row?.error) {
      const rows = await File.Data.aggregate([
        { $match: { _id: videoId, active: true } },
        //server
        {
          $lookup: {
            from: "servers",
            localField: "serverId",
            foreignField: "_id",
            as: "servers",
            pipeline: [
              { $match: { type: "storage" } },
              {
                $project: {
                  _id: 0,
                  svIp: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            server: { $arrayElemAt: ["$servers", 0] },
          },
        },
        //files
        {
          $lookup: {
            from: "files",
            localField: "fileId",
            foreignField: "_id",
            as: "files",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  slug: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            file: { $arrayElemAt: ["$files", 0] },
          },
        },
        {
          $set: {
            svIp: "$server.svIp",
            slug: "$file.slug",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            svIp: 1,
            slug: 1,
          },
        },
      ]);

      row = rows?.at(0);
      if (!row?._id) return res.status(404).end();
      Cacher.saveData(videoId, row);
    }

    const url = `http://${row.svIp}:8889/mp4/${row.slug}/file_${row.name}.mp4`;

    const headers = Object.assign(req.headers);
    delete headers.host;
    delete headers.referer;

    request({ url, headers })
      .on("response", (resp) => {
        res.statusCode = resp.statusCode;
        Object.keys(resp.headers).forEach((key) => {
          res.setHeader(key, resp.headers[key]);
        });
      })
      .pipe(res);
    /*
    res.on("close", () => {
      stream.abort();
    });*/
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};
