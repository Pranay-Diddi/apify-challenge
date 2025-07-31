const express = require("express");
const axios = require("axios");
const router = express.Router();

// Get your API key from .env

require("dotenv").config();
// const apiKey = process.env.API_KEY;
// console.log(apiKey);


// ✅ GET all actors
router.get("/actors", async(req, res) => {
    console.log(apiKey);
    try {
        const result = await axios.get(`https://api.apify.com/v2/acts?token=${apiKey}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        console.log(result.data);
        res.json(result.data);
    } catch (err) {
        console.error(err);
        res.status(400).json({ err: 'Failed to fetch actors', details: err.message });
    }
});

// ✅ POST input schema for a specific actor
router.post("/actors/:id/schema", async (req, res) => {
    const actorId = req.params.id;

    try {
        const result = await axios.get(`https://api.apify.com/v2/acts/${actorId}/input-schema`, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        console.log(result.data);
        res.json(result.data);
    } catch (err) {
        console.error(err);
        res.status(400).json({ err: "Failed to fetch input schema", details: err.message });
    }
});

// ✅ POST run an actor
router.post("/actors/:id/run", async (req, res) => {
    const actorId = req.params.id;
    const input = req.body.input;

    try {
        const response = await axios.post(
            `https://api.apify.com/v2/acts/${actorId}/runs?wait=true`,
            input,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(response.data);
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(400).json({ err: 'Failed to run actor', details: err.message });
    }
});

module.exports = router;
