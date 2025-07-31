const express = require('express');
const cors = require('cors');
const axios = require('axios'); // ✅ You missed this import
require('dotenv').config();

const app = express();

// ✅ FIX 1: You forgot to *call* cors() — this line was incorrect before
app.use(cors()); 

app.use(express.json());

app.get("/actors/:username/:actorName/schema", async (req, res) => {
  const { username, actorName } = req.params;
  const apiKey = req.headers.authorization?.split(" ")[1];

  try {
    const LINK = `https://api.apify.com/v2/acts/${username}~${actorName}`;
    const actorDetailsRes = await axios.get(
      LINK,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const buildId = actorDetailsRes.data.data.taggedBuilds.latest.buildId;
    // console.log(buildId);
    if (!buildId) {
      return res.status(404).json({ error: "Build ID not found." });
    }

    // Step 2: Use buildId to get input schema
    const buildDetailsRes = await axios.get(
      `https://api.apify.com/v2/actor-builds/${buildId}`,
    );

    const inputSchema = buildDetailsRes.data.data.inputSchema;
    // console.log(inputSchema);

    if (!inputSchema) {
      return res.status(404).json({ error: "Input schema not found." });
    }
    // console.log(inputSchema.title);
    res.json({
      data: inputSchema,
    });
  } catch (error) {
    // console.error("Error fetching input schema:", error.message);
    res.status(500).json({ error: "Failed to fetch input schema." });
  }
});



app.post("/actors/:username/:actorName/run", async (req, res) => {
    console.log("Receieved request");
  const { username, actorName } = req.params;
  const { input, apiKey } = req.body;

  if (!apiKey) {
    return res.status(401).json({ error: "API key missing in request body" });
  }

  try {
    // 1. Start actor run
    const startRun = await axios.post(
      `https://api.apify.com/v2/acts/${username}~${actorName}/runs`,
      input,
      {
        params: { token: apiKey },
        headers: { "Content-Type": "application/json" },
      }
    );

    const { id: runId, defaultDatasetId } = startRun.data.data;
    console.log(`✅ Started actor run: ${runId}`);

    // 2. Poll for completion
    let runStatus = "READY";
    let maxPolls = 30;
    let pollInterval = 2000;
    let attempt = 0;

    while (attempt < maxPolls) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));

      const statusCheck = await axios.get(
        `https://api.apify.com/v2/actor-runs/${runId}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );

      runStatus = statusCheck.data.data.status;
      console.log(`⏳ Poll #${attempt + 1}: status = ${runStatus}`);

      if (runStatus === "SUCCEEDED") break;
      if (["FAILED", "ABORTED", "TIMED-OUT"].includes(runStatus)) {
        throw new Error(`Actor run ${runId} ended with status: ${runStatus}`);
      }

      attempt++;
    }

    if (runStatus !== "SUCCEEDED") {
      throw new Error(`Actor run did not complete in time (status: ${runStatus})`);
    }

    // 3. Fetch output dataset
    const datasetFetch = await axios.get(
      `https://api.apify.com/v2/datasets/${defaultDatasetId}/items`,
      {
        params: { format: "json", clean: true, limit: 100 },
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    // 4. Send results
    res.json({ items: datasetFetch.data });

  } catch (err) {
    const errMsg = err.response?.data || err.message;
    console.error("❌ Error running actor:", errMsg);
    res.status(500).json({
      error: "Failed to run actor or retrieve results",
      details: errMsg,
    });
  }
});



app.get("/actors", async (req, res) => {
  const apiKey = req.headers.authorization?.split(" ")[1];

  if (!apiKey) {
    return res.status(401).json({ error: "❌ API key missing in request headers" });
  }

  try {
    // Step 1: Validate API key by calling /users/me
    const userRes = await axios.get("https://api.apify.com/v2/users/me", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const userData = userRes.data.data; // Optional: use this info if needed

    // Step 2: Fetch actors if API key is valid
    const result = await axios.get("https://api.apify.com/v2/acts", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    res.json(result.data);
  } catch (err) {
    if (err.response) {
      // Handle known errors
      const status = err.response.status;
      const message = err.response.data?.message || err.message;

      if (status === 401) {
        return res.status(401).json({ error: "❌ Invalid API key. Authentication failed." });
      }

      return res.status(status).json({ error: "❌ Failed to fetch actors", details: message });
    }

    // Handle unknown or network errors
    res.status(500).json({ error: "❌ Server error", details: err.message });
  }
});

// app.get("/actors", async (req, res) => {
//     console.log("Hitting /actors route...");
//     console.log("API KEY:", apiKey);

//     try {
//         const result = await axios.get(`https://api.apify.com/v2/acts`, {
//             headers: {
//                 Authorization: `Bearer ${apiKey}`
//             }
//         });

//         console.log("Result received:", result.data);
//         res.json(result.data);
//     } catch (err) {
//         console.error("Error fetching actors:", err.message);
//         res.status(400).json({ err: 'Failed to fetch actors', details: err.message });
//     }
// });

const port = 3000;
app.listen(port, () => {
    console.log(`✅ Server running on port: ${port}`);
});
