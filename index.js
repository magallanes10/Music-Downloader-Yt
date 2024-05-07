const express = require('express');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.get('/music', async (req, res) => {
    try {
        const song = req.query.query;
        if (!song) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const searchResults = await yts(song);
        if (!searchResults.videos.length) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const video = searchResults.videos[0];
        const videoUrl = video.url;

        const stream = ytdl(videoUrl, { filter: 'audioonly' });

        // Set content type to audio/mp3
        res.set('Content-Type', 'audio/mp3');

        // Pipe audio stream to response
        stream.pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
