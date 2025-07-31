import React, { useEffect, useState } from "react";
// import { useState } from "react";
import axios from "axios";
import ActorForm from "./ActorForm";
import ResultsGrid from "./ResultsGrid";
import "./styles.css";

const FetchSchema = ({ username, actorName, apiKey }) => {
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    setFormValues({});
    setResults([]);
    setHasSubmitted(false);
  }, [username, actorName]);

  useEffect(() => {
    const fetchSchema = async () => {
      setResults([]);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:3000/actors/${username}/${actorName}/schema`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        const parsed = JSON.parse(res.data.data);
        setSchema(parsed);

        const initial = {};
        Object.entries(parsed.properties || {}).forEach(([key, conf]) => {
          if (conf.editor === "select" && Array.isArray(conf.enum)) {
            initial[key] = conf.enum[0];
          } else if (conf.default !== undefined) {
            initial[key] = conf.default;
          }
        });
        setFormValues(initial);
      } catch (err) {
        console.error("❌ Error fetching schema", err);
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            setError("Invalid or unauthorized API key.");
            alert(
              "❌ Invalid or unauthorized API key. Please check and try again."
            );
          } else {
            setError(`Failed to load input schema: ${err.response.statusText}`);
            alert(`❌ Error: ${err.response.statusText}`);
          }
        } else {
          setError("Failed to load input schema.");
          alert("❌ Network error or server not reachable.");
        }
      }
    };

    fetchSchema();
  }, [username, actorName, apiKey]);

  const validateInput = () => {
    const errors = [];
    for (const [key, config] of Object.entries(schema.properties)) {
      const value = formValues[key];
      if (value === undefined || value === "") continue;

      if (config.type === "string") {
        if (config.pattern && !new RegExp(config.pattern).test(value)) {
          errors.push(`${key} does not match required format.`);
        }
        if (config.enum && !config.enum.includes(value)) {
          errors.push(`${key} must be one of: ${config.enum.join(", ")}`);
        }
        if (config.minLength && value.length < config.minLength) {
          errors.push(
            `${key} must be at least ${config.minLength} characters.`
          );
        }
        if (config.maxLength && value.length > config.maxLength) {
          errors.push(`${key} must be at most ${config.maxLength} characters.`);
        }
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRunning) {
      alert("A request is already running. Please wait.");
      return;
    }

    const validationErrors = validateInput();
    if (validationErrors.length > 0) {
      alert("Invalid input:\n" + validationErrors.join("\n"));
      return;
    }

    setHasSubmitted(true);
    setIsRunning(true);
    setIsLoading(true);
    setResults([]);

    try {
      const response = await axios.post(
        `http://localhost:3000/actors/${username}/${actorName}/run`,
        {
          input: formValues,
          apiKey,
        }
      );
      setResults(response.data.items.slice(0, 10));
      alert("✅ Actor run completed successfully!");
    } catch (err) {
      console.error("❌ Actor run failed", err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          alert("❌ Invalid API key. Please check your credentials.");
        } else {
          alert(
            `❌ Error: ${err.response.statusText} (${err.response.status})`
          );
        }
      } else {
        alert("❌ Network or server error.");
      }
    } finally {
      setIsRunning(false);
      setIsLoading(false);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!schema || !schema.properties)
    return <p className="info">Loading or no schema found</p>;

  return (
    <div className="container">
      <h2 className="heading">{schema.title || "Run Actor"}</h2>

      <ActorForm
        schema={schema}
        formValues={formValues}
        setFormValues={setFormValues}
        handleSubmit={handleSubmit}
        isRunning={isRunning}
      />

      {isLoading && (
        <p className="loading">
          ⏳ Please wait, your request is being processed...
        </p>
      )}

      {!isLoading && hasSubmitted && results.length === 0 && (
        <p style={{ textAlign: "center" }}>No results found</p>
      )}

      {results.length > 0 && <ResultsGrid results={results} />}
    </div>
  );
};

export default FetchSchema;
