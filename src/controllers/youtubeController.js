const axios = require("axios");
const db = require("../models/db");
const winston = require("../middleware/logger");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Fetch and store channel details
const getChannelDetails = async (req, res) => {
    const channelId = req.params.channelId;
    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required" });
    }
  try {
    const url =  `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet&key=${YOUTUBE_API_KEY}`;
    winston.info(`Fetching YouTube API: ${url}`);
    const response = await axios.get(url);

    if (!response.data.items.length) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const { id, snippet } = response.data.items[0];
    const { title, description, thumbnails } = snippet;
    const thumbnailUrl = thumbnails.default.url;

    await db.execute(
      "INSERT INTO channels (id, title, description, thumbnail_url) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=?, description=?, thumbnail_url=?",
      [id, title, description, thumbnailUrl, title, description, thumbnailUrl]
    );

    winston.info(`Stored channel: ${title}`);
    res.json({ id, title, description, thumbnailUrl });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch and store playlist details
const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlists?id=${playlistId}&part=snippet&key=${YOUTUBE_API_KEY}`
    );

    if (!response.data.items.length) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const { id, snippet } = response.data.items[0];
    const { title, description, channelId } = snippet;

    await db.execute(
      "INSERT INTO playlists (id, title, description, channel_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=?, description=?",
      [id, title, description, channelId, title, description]
    );

    winston.info(`Stored playlist: ${title}`);
    res.json({ id, title, description, channelId });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getChannelDetails, getPlaylistDetails };
