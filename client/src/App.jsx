import React, { useState } from "react";
import axios from "axios";
import ActorsList from "./Components/ActorsList";
import FetchSchema from "./Components/FetchSchema";
import "./App.css";

const App = () => {
  const [apiKey, setApiKey] = useState("");
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleApiKeySubmit = async () => {
    if (!apiKey || apiKey.trim() === "") {
      alert("❗ Please enter a valid API key.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/actors", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const transformed = res.data.data.items.map((actor) => ({
        id: actor.id,
        title: actor.title,
        actorId: `${actor.username}/${actor.name}`,
        username: actor.username,
        name: actor.name,
        totalRuns: actor.stats.totalRuns,
        lastRun: actor.stats.lastRunStartedAt,
      }));

      if (transformed.length === 0) {
        alert("No actors found for this API key.");
      }

      setActors(transformed);
      setSelectedActor(null); // 🔄 Reset selected actor when refreshing
    } catch (err) {
      console.error("❌ Failed to fetch actors:", err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          alert("❌ Invalid API key. Please check your credentials.");
        } else {
          alert(
            `❌ Server responded with error: ${err.response.status} - ${err.response.statusText}. Check your API credentials`
          );
        }
      } else {
        alert("❌ Network error or server is not reachable.");
      }
    }
  };

  const handleSelectActor = (actorId) => {
    const found = actors.find((a) => a.id === actorId);
    if (found) setSelectedActor(found);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>🚀 Apify Integration</h1>
        <p>Enter your Apify API key to fetch your actors.</p>
      </div>

      <div className="input-box">
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your API key..."
        />
        <button onClick={handleApiKeySubmit}>Get Actors</button>
      </div>

      <ActorsList actors={actors} onSelect={handleSelectActor} />

      {selectedActor && (
        <FetchSchema
          username={selectedActor.username}
          actorName={selectedActor.name}
          apiKey={apiKey}
        />
      )}
    </div>
  );
};

export default App;
