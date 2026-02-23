import React, { useState } from 'react';
import './App.css';

const App = () => {
  const defaultSchema = [
    { "input_id": 1, "label": "Username", "type": "TEXT", "format": "STRING", "validation": { "required": true } },
    { "input_id": 2, "label": "Email", "type": "EMAIL", "format": "STRING", "validation": { "required": true } },
    { "input_id": 3, "label": "Password", "type": "TEXT", "format": "PASSWORD", "validation": { "required": true, "min": 6 } },
    { "input_id": 4, "label": "Mobile", "type": "TEXT", "format": "STRING", "validation": { "required": true, "min": 10, "max": 10 } },
    { "input_id": 5, "label": "Gender", "type": "RADIO", "enum": ["Male", "Female"], "validation": { "required": true } }
  ];

  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultSchema, null, 2));
  const [schema, setSchema] = useState(defaultSchema);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [output, setOutput] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonError, setJsonError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSchemaChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      setSchema(parsed);
      setJsonError(null);
    } catch (err) {
      setJsonError("Invalid JSON format");
    }
  };

  const handleInputChange = (id, value, format) => {
    const finalValue = format === "NUMBER" ? Number(value) : value;
    setFormData(prev => ({ ...prev, [id]: finalValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    schema.forEach(field => {
      if (field.validation?.required && !formData[field.input_id]) {
        newErrors[field.input_id] = "Required field";
      }
    });

    if (Object.keys(newErrors).length === 0) {
      const result = schema.map(field => ({
        input_id: field.input_id,
        value: formData[field.input_id] ?? ""
      }));
      setOutput(result);
      setIsModalOpen(true); // Open the animated dialog
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        DYNAMIC FORM ENGINE
      </div>

      <div className="main-content">
        
        {/* LEFT: SCHEMA EDITOR */}
        <div className="schema-editor">
          <div className="schema-editor-header">
            <h3 className="section-title">1. Edit Schema</h3>
            <button 
              onClick={() => copyToClipboard(jsonInput)}
              className="copy-json-button"
            >
              Copy JSON
            </button>
          </div>
          <textarea
            
            value={jsonInput}
            onChange={handleSchemaChange}
            className={`schema-textarea ${jsonError ? 'error' : ''}`}
          />
        </div>

        {/* RIGHT: LIVE FORM */}
        <div className="live-form-container">
          <h3 className="section-title">2. Live Form</h3>
          <form onSubmit={handleSubmit} className="form-wrapper">
            {schema.map((field) => (
              <div key={field.input_id} className="form-field">
                <label className="form-label">{field.label}</label>
                <div className="password-field-wrapper">
                  {(field.type === "TEXT" || field.type === "EMAIL") && (
                    <input
                      type={field.format === "PASSWORD" ? (showPassword ? "text" : "password") : (field.type === "EMAIL" ? "email" : "text")}
                      onChange={(e) => handleInputChange(field.input_id, e.target.value, field.format)}
                      className="form-input"
                    />
                  )}
                  {field.format === "PASSWORD" && (
                    <span 
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </span>
                  )}
                </div>
                {field.type === "RADIO" && (
                  <div className="radio-group">
                    {field.enum?.map(opt => (
                      <label key={opt}><input type="radio" name={`f-${field.input_id}`} onChange={() => handleInputChange(field.input_id, opt, "STRING")} /> {opt}</label>
                    ))}
                  </div>
                )}
                {errors[field.input_id] && <div className="error-message">{errors[field.input_id]}</div>}
              </div>
            ))}
            <button type="submit" className="submit-button">
              Submit & View Results
            </button>
          </form>
        </div>
      </div>

      {/* MODAL DIALOG WITH ANIMATION */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Output Generated!</h3>
            <pre className="modal-output">
              {JSON.stringify(output, null, 2)}
            </pre>
            <div className="modal-buttons">
              <button 
                onClick={() => copyToClipboard(JSON.stringify(output, null, 2))}
                className="modal-button modal-button-copy"
              >
                Copy Results
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="modal-button modal-button-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;



