 import React, { useEffect, useState } from 'react';
import { user } from '../Join/Join';
import socketIo from 'socket.io-client';
import './Chat.css';
import sendLogo from '../../images/send.png';
import Message from '../Message/Message';
import ReactScrollToBottom from 'react-scroll-to-bottom';
import closeIcon from '../../images/closeicon.png';

const ENDPOINT = 'https://realtimechatapplicationbackend-lbkh.onrender.com';
let socket;

const Chat = () => {
  const [id, setId] = useState('');
  const [messages, setMessages] = useState([]);

  const send = () => {
    const message = document.getElementById('chatInput').value;

    if (message.trim()) {
      socket.emit('message', { message, id });
      document.getElementById('chatInput').value = '';
    }
  };

  useEffect(() => {
    socket = socketIo(ENDPOINT, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setId(socket.id);
    });

    socket.emit('joined', { user });

    socket.on('welcome', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('user joined', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('leave', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on('sendMessage', handleMessage);

    return () => {
      socket.off('sendMessage', handleMessage);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h1>ⒸⒸⓗⓐⓣ</h1>
          <a href="/">
            <img className="icon" src={closeIcon} alt="close" />
          </a>
        </div>

        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              key={i}
              user={item.user}
              message={item.message}
              classs={item.id === id ? 'right' : 'left'}
            />
          ))}
        </ReactScrollToBottom>

        <div className="inputBox">
          <input
            type="text"
            id="chatInput"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                send();
              }
            }}
          />

          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
