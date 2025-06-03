const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Path for storing votes
const votesFilePath = path.join(__dirname, 'votes.json');

// Initialize votes data
let votes = {};
if (fs.existsSync(votesFilePath)) {
    votes = JSON.parse(fs.readFileSync(votesFilePath, 'utf-8')) || {};
}

// Middleware for serving static files
app.use(express.static('public'));

// Endpoint to get current votes
app.get('/votes', (req, res) => {
    res.json(votes);
});

// Endpoint to cast a vote for a specific image
app.post('/vote/:imageId', (req, res) => {
    const imageId = req.params.imageId;

    // Increment the vote count for the specified image
    if (!votes[imageId]) {
        votes[imageId] = 0;
    }
    votes[imageId]++;
    
    // Save updated votes to the file
    fs.writeFileSync(votesFilePath, JSON.stringify(votes), 'utf-8');
    res.json({ votes });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
