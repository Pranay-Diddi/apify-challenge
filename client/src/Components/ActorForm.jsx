import React from "react";

const ActorForm = ({
  schema,
  formValues,
  setFormValues,
  handleSubmit,
  isRunning,
}) => {
  const visibleFields = Object.entries(schema.properties).filter(
    ([, config]) => config.type === "string" || config.editor === "select"
  );

  return (
    <form className="form" onSubmit={handleSubmit}>
      {visibleFields.map(([key, config]) => (
        <div key={key}>
          <label className="label">{config.title || key}</label>
          {config.editor === "select" && config.enum ? (
            <select
              name={key}
              value={formValues[key] || config.enum[0]}
              onChange={(e) =>
                setFormValues({ ...formValues, [key]: e.target.value })
              }
              className="input"
            >
              {config.enum.map((option, index) => (
                <option key={option} value={option}>
                  {config.enumTitles?.[index] || option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name={key}
              placeholder={config.placeholderValue || ""}
              value={formValues[key] || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, [key]: e.target.value })
              }
              className="input"
            />
          )}
        </div>
      ))}

      <button type="submit" className="submitBtn" disabled={isRunning}>
        {isRunning ? "Running..." : "Submit"}
      </button>
    </form>
  );
};

export default ActorForm;
