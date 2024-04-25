import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/appLayout.css'
import '../style/chatInterface.css'; 

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input + emoji);
    };
  const addPhoto = (e) => {
    let photo = e.native;
    setInput(input + photo);
    };
  const addVideo = (e) => {
    let video = e.native;
    setInput(input + video);
    };

  let { id } = useParams();


  const sendMessage = (event) => {
    event.preventDefault();
    if (input.trim()) {
      const newMessage = {
        text: input,
        timestamp: new Date().toLocaleTimeString(),
        id: messages.length
      };
      setMessages([...messages, newMessage]);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <p className="text">{message.text}</p>
            <p className="timestamp">{message.timestamp}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-input">
        <button onClick={addEmoji}>😊</button>
        <button onClick={addPhoto}>📷</button>
        <button onClick={addVideo}>🎥</button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatInterface;
