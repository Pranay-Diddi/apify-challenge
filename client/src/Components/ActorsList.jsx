import React, { useState } from "react";
import "./ActorsList.css";

const ActorsList = ({ actors, onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
    onSelect(id);
  };

  if (!actors.length) {
    return (
      <p className="no-actors">
        No actors to display. Please enter a valid API key.
      </p>
    );
  }

  return (
    <div className="actors-list">
      {actors.map((actor) => (
        <div
          key={actor.id}
          className={`actor-card ${selectedId === actor.id ? "selected" : ""}`}
          onClick={() => handleSelect(actor.id)}
        >
          <h3>{actor.title}</h3>
          <p>
            <strong>ID:</strong> {actor.actorId}
          </p>
          <p>
            <strong>Total Runs:</strong> {actor.totalRuns}
          </p>
          <p>
            <strong>Last Run:</strong>{" "}
            {new Date(actor.lastRun).toLocaleString()}
          </p>
        </div>
      ))}
      {selectedId && (
        <div className="selected-msg">
          ✅ Selected Actor ID: <strong>{selectedId}</strong>
        </div>
      )}
    </div>
  );
};

export default ActorsList;
