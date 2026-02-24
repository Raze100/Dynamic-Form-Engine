import React, { useState } from 'react';
import './App.css';

const App = () => {
  const initialFields = [
    { "input_id": 1, "label": "Username", "type": "TEXT", "format": "STRING", "validation": { "required": true } },
    { "input_id": 2, "label": "Email", "type": "EMAIL", "format": "STRING", "validation": { "required": true } },
    { "input_id": 3, "label": "Password", "type": "TEXT", "format": "PASSWORD", "validation": { "required": true, "min": 6 } },
    { "input_id": 4, "label": "Mobile", "type": "TEXT", "format": "STRING", "validation": { "required": true, "min": 10, "max": 10 } },
    { "input_id": 5, "label": "Gender", "type": "RADIO", "enum": ["Male", "Female"], "validation": { "required": true } }
  ];

  const [schemaText, setSchemaText] = useState(JSON.stringify(initialFields, null, 2));
  const [fields, setFields] = useState(initialFields);
  const [values, setValues] = useState({});
  const [errs, setErrs] = useState({});
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [parseErr, setParseErr] = useState(null);
  const [revealPass, setRevealPass] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSchemaChange = (e) => {
    const val = e.target.value;
    setSchemaText(val);
    try {
      const parsedSchema = JSON.parse(val);
      setFields(parsedSchema);
      setParseErr(null);
    } catch (err) {
      setParseErr("Invalid JSON format");
    }
  };

  const handleInputChange = (id, val, format) => {
    const processedVal = format === "NUMBER" ? Number(val) : val;
    setValues(prev => ({ ...prev, [id]: processedVal }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrs = {};
    fields.forEach(field => {
      if (field.validation?.required && !values[field.input_id]) {
        validationErrs[field.input_id] = "Required field";
      }
    });

    if (Object.keys(validationErrs).length === 0) {
      const outputData = fields.map(f => ({
        input_id: f.input_id,
        value: values[f.input_id] ?? ""
      }));
      setResult(outputData);
      setShowModal(true); 
    } else {
      setErrs(validationErrs);
    }
  };

  return (
    <div className="wrapper">
      <div className="header">
        DYNAMIC FORM ENGINE
      </div>

      <div className="content">
        
        <div className="editor">
          <div className="editorTop">
            <h3 className="title">1. Edit Schema</h3>
            <button 
              onClick={() => copyToClipboard(schemaText)}
              className="copyBtn"
            >
              Copy JSON
            </button>
          </div>
          <textarea
            
            value={schemaText}
            onChange={handleSchemaChange}
            className={`textarea ${parseErr ? 'error' : ''}`}
          />
        </div>

        <div className="formContainer">
          <h3 className="title">2. Live Form</h3>
          <form onSubmit={handleSubmit} className="form">
            {fields.map((field) => (
              <div key={field.input_id} className="field">
                <label className="label">{field.label}</label>
                <div className="passWrapper">
                  {(field.type === "TEXT" || field.type === "EMAIL") && (
                    <input
                      type={field.format === "PASSWORD" ? (revealPass ? "text" : "password") : (field.type === "EMAIL" ? "email" : "text")}
                      onChange={(e) => handleInputChange(field.input_id, e.target.value, field.format)}
                      className="input"
                    />
                  )}
                  {field.format === "PASSWORD" && (
                    <span 
                      onClick={() => setRevealPass(!revealPass)}
                      className="toggle"
                    >
                      {revealPass ? "HIDE" : "SHOW"}
                    </span>
                  )}
                </div>
                {field.type === "RADIO" && (
                  <div className="radioGroup">
                    {field.enum?.map(opt => (
                      <label key={opt}><input type="radio" name={`f-${field.input_id}`} onChange={() => handleInputChange(field.input_id, opt, "STRING")} /> {opt}</label>
                    ))}
                  </div>
                )}
                {errs[field.input_id] && <div className="errMsg">{errs[field.input_id]}</div>}
              </div>
            ))}
            <button type="submit" className="submitBtn">
              Submit & View Results
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modalTitle">Output Generated!</h3>
            <pre className="output">
              {JSON.stringify(result, null, 2)}
            </pre>
            <div className="btnGroup">
              <button 
                onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                className="btn btnCopy"
              >
                Copy Results
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="btn btnClose"
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



