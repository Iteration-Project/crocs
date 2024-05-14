const Message = require('../models/messageModel');
const addNewMessage = require('./addNewMessage');

module.exports = (socket, sender, room) => async (data) => {
  // console.log(data);
  const { from, to, content } = JSON.parse(data);

  // Store message (in database)
  const message = await Message.create({ from, to, content, room });

  // Add message to recipient's newMessage field
  addNewMessage(sender, to);

  // Send message to recipient
  socket.to(room).emit('messages', JSON.stringify(message));
};
