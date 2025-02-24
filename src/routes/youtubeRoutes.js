const express = require("express");
const { getChannelDetails, getPlaylistDetails } = require("../controllers/youtubeController");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.get("/channel/:channelId", rateLimiter, getChannelDetails);
router.get("/playlist/:playlistId", rateLimiter, getPlaylistDetails);

module.exports = router;
