"use strict";
const express = require("express");
const router = express.Router();

const {
  streamTS,
  streamMP4,
  RedirectstreamTS,
} = require("./controllers/stream");

router.route("/:videoId/:item.(txt|html|png|jpg)").get(streamTS);
router.route("/re/:videoId/:item.(txt|html|png|jpg)").get(RedirectstreamTS);
//router.route("/:videoId.mp4").get(streamMP4);

const { serverCreate } = require("./controllers/server");
router.get("/server/create", serverCreate);

router.all("*", async (req, res) => {
  const html = `
  <html>
    <head>
      <title>zembed.xyz</title>
      <style>
        html,body{
          padding: 0;
          margin: 0;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          width: 100%;
          background: #000;
          color: #fff;
        }
        p{
          width: 100%;
          text-align: center;
          font-size: 2rem;
          padding: 0.25rem;
          line-height: 2.5rem;
        }
      </style>
    </head>
    <body>
      <p>Power by zembed.xyz</p>
    </body>
  </html>
  `;
  return res.status(200).end(html);
});

module.exports = router;
