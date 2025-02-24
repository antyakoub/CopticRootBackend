const express = require("express");
const dotenv = require("dotenv");
const youtubeRoutes = require("./routes/youtubeRoutes");

dotenv.config();
const app = express();


app.get("/", (req, res) => {
    res.send("API is running...");
  });

app.use(express.json());
app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
