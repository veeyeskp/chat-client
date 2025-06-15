import React, { useState } from "react";
import "./Chat.css";

const backend = "https://contractgpt.up.railway.app";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Today");

  const chatGroups = ["Today", "Yesterday", "This Week", "Last Week", "Month"];

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
    if (!input.trim()) return;

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
    <div className="chat-container">
      <aside className="chat-sidebar">
        <h3>Chat History</h3>
        {chatGroups.map((group) => (
          <div
            key={group}
            className={`chat-group ${selectedGroup === group ? "active" : ""}`}
            onClick={() => setSelectedGroup(group)}
          >
            {group}
          </div>
        ))}
      </aside>

      <main className="chat-main">
        <div className="chat-header">
          <div className="chat-header-left">
            <img src="/logo192.png" alt="Logo" width="28" />
            Contract Analyzer
          </div>
          <div className="chat-header-right">
            <img src="/profile.png" alt="User" />
          </div>
        </div>

        <input type="file" onChange={handleUpload} />

        <div className="chat-window">
          {messages.map((msg, i) => (
            <div key={i} className="chat-bubble-group">
              <div className="chat-bubble user">You: {msg.user}</div>
              <div className="chat-bubble bot">Bot: {msg.bot}</div>
            </div>
          ))}
        </div>

        <div className="chat-input-box">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something about the PDF..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </main>
    </div>
  );
}

export default Chat;
