"use strict";
const express = require("express");
const router = express.Router();

const { streamTS, streamMP4 } = require("./controllers/stream");

router.route("/:videoId/:item.(txt|html|png|jpg)").get(streamTS);
//router.route("/:videoId.mp4").get(streamMP4);

const { serverCreate } = require("./controllers/server");
router.get("/server/create", serverCreate);

router.all("*", async (req, res) => {
  return res.status(200).end('streaming by zembed.xyz');
});

module.exports = router;
