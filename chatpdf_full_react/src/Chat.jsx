import React, { useState } from "react";

const backend = "https://contractgpt.up.railway.app";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await fetch(`${backend}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert("Extracted Text:\n" + data.text);
  };

  const handleSend = async () => {
    const res = await fetch(`${backend}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([...messages, { user: input, bot: data.response }]);
    setInput("");
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <br /><br />
      <div style={{ maxHeight: 300, overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>You:</b> {msg.user} <br />
            <b>Bot:</b> {msg.bot}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Chat;
