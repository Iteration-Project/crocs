/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import socket from "../socket";
import styled from "styled-components";
import Modal from "../component/Modal/Modal";
import { ChatMessageList } from "./ChatMessageList";
import { ChatMessage } from "./ChatMessage";
import { X } from "react-feather";

const MsgerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 2px solid #ddd;
  background: #eee;
  color: #666;
`;

const Close = styled.span`
  margin-right: 4px;
  cursor: pointer;
  color: #666;
`;

const InputArea = styled.form`
  display: flex;
  padding: 10px;
  border-top: var(--border);
  background: #eee;

  & * {
    padding: 10px;
    border: none;
    border-radius: 3px;
    font-size: 1em;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  background: #ddd;
`;

const SendButton = styled.button`
  margin-left: 10px;
  background: rgb(0, 196, 65);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.23s;

  &:hover {
    background: rgb(0, 180, 50);
  }
`;

const Chat = ({ currentUser, recipient, setRecipient }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const closeChat = () => {
    setRecipient(null);
    socket.disconnect();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text) return;

    // Add message to sender's messages
    const message = {
      from: currentUser.email,
      to: recipient.email,
      content: text,
      sentAt: Date.now(),
    };
    setMessages([...messages, message]);

    // Send message to recipient
    socket.emit("message", JSON.stringify(message));

    setText("");
  };

  // SOCKET IO EVENT LISTENERS
  // // 1) get all online users
  // socket.on('online users', (onlineUsers) => {
  //   setOnlineUsers(onlineUsers);
  // });
  socket.on("message", (message) => {
    setMessages([...messages, JSON.parse(message)]);
  });

  socket.on("messages", (data) => {
    const messages = JSON.parse(data);
    // console.log('messages:', messages);
    setMessages(messages);
  });

  // Connect to socket io on component mount
  useEffect(async () => {
    console.log("in useEffect chat.js");
    socket.auth = {
      recipientEmail: recipient.email,
      user: currentUser,
    };
    console.log("users in zoom", currentUser.email, recipient.email);
    socket.connect();
  }, []);

  return (
    <Modal>
      {/* Header section */}
      <MsgerHeader>
        <div>
          {recipient.name === currentUser ? currentUser.name : recipient.name}
        </div>
        <Close
          onClick={closeChat}
          onKeyDown={closeChat}
          role="button"
          tabIndex={0}
        >
          <X />
        </Close>
      </MsgerHeader>
      {/* Message section */}
      <ChatMessageList>
        {messages.map((message, i) => {
          return (
            <ChatMessage
              message={message}
              key={i}
              index={i}
              currentUser={currentUser}
              recipient={recipient}
            />
          );
        })}
      </ChatMessageList>
      {/* Input area section */}
      <InputArea onSubmit={handleSubmit}>
        <MessageInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Enter your message..."
        />
        <SendButton>Send</SendButton>
      </InputArea>
    </Modal>
  );
};

export default Chat;
