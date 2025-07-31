import React from "react";

const ResultsGrid = ({ results }) => (
  <div className="resultsContainer">
    <h3>Results:</h3>
    <div className="grid">
      {results.map((item, index) => (
        <div className="card" key={index}>
          <h4>Result #{index + 1}</h4>
          {Object.entries(item).map(([k, v]) => (
            <div key={k}>
              <strong>{k}:</strong>{" "}
              <span>
                {typeof v === "object" ? JSON.stringify(v) : v?.toString()}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default ResultsGrid;
