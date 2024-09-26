import React from "react"
import formatDate from "../utils/formatDate"
import styled from "styled-components"

const MessageBubble = styled.div`
  max-width: 450px;
  padding: 15px;
  border-radius: ${(props) =>
    props.side === "right" ? "16px 16px 0px 16px" : "16px 16px 16px 0px"};
  color: ${(props) => (props.side === "right" ? "white" : "#101728")};
  background: ${(props) => (props.side === "right" ? "#7f56d9" : "#f2f4f7")}; ;
`
const MessageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`
const MessageInfoName = styled.div`
  margin-right: 10px;
  font-weight: bold;
`
const MessageInfoTime = styled.div`
  font-size: 0.85em;
`
const Message = styled.div`
  display: flex;
  flex-direction: ${(props) =>
    props.side === "right" ? "row-reverse" : "row"};
  align-items: flex-end;
  margin-bottom: 10px;

  &:last-of-type {
    margin: 0;
  }
`

export const ChatMessage = ({ message, currentUser, recipient }) => {
  const self = message.from === currentUser.email
  const side = self ? "right" : "left"
  const name = self ? currentUser.name : recipient.name

  return (
    <Message side={side}>
      <MessageBubble side={side}>
        <MessageInfo>
          <MessageInfoName>{name}</MessageInfoName>
          <MessageInfoTime>{formatDate(message.sentAt)}</MessageInfoTime>
        </MessageInfo>
        <div>{message.content}</div>
      </MessageBubble>
    </Message>
  )
}
