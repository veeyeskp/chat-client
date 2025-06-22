import React, { useState, useEffect } from "react";

const backend = process.env.REACT_APP_BACKEND_URL;

function Chat() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${backend}/datasets`)
      .then(res => res.json())
      .then(data => {
        setDatasets(data.datasets);
        if (data.datasets.length) setSelectedDataset(data.datasets[0]);
      });
  }, []);

  const handleAsk = async () => {
    setLoading(true);
    const res = await fetch(`${backend}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        dataset: selectedDataset,
      }),
    });
    const data = await res.json();
    setResponse(data.response || "No response");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>🔍 Renewable Dataset Q&A</h2>

      <label>Select Dataset</label>
      <select
        value={selectedDataset}
        onChange={(e) => setSelectedDataset(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        {datasets.map((ds, i) => (
          <option key={i} value={ds}>{ds}</option>
        ))}
      </select>

      <textarea
        placeholder="Ask a question..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      <div style={{ marginTop: 20 }}>
        <h4>💬 Response:</h4>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default Chat;
