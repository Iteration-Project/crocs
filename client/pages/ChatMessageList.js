import React from "react";
import styled from "styled-components";

const Messages = styled.main`
  flex: 1;
  height: 80%;
  overflow-y: auto;
  padding: 10px;
  scroll-behavior: smooth;

  &:-webkit-scrollbar {
    width: 6px;
  }
  &:-webkit-scrollbar-track {
    background: #ddd;
  }
  &:-webkit-scrollbar-thumb {
    background: #bdbdbd;
  }
`;

export const ChatMessageList = ({ children }) => {
  return <Messages>{children}</Messages>;
};
