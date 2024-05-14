/* eslint-disable no-param-reassign */
const app = require('./app');
const server = require('http').createServer(app);
const User = require('./models/userModel');
const Chat = require('./models/chatModel');
const genRoomId = require('./utils/genRoomId');
// const sendMessage = require("./sendMessage");
const Message = require('./models/messageModel');

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use((socket, next) => {
  const { user, recipientEmail } = socket.handshake.auth;

  socket.user = user;
  socket.recipientEmail = recipientEmail;
  // socket.room = room;

  next();
});

io.on('connection', async (socket) => {
  try {
    // console.log('Connected: ' + socket.user._id);
    const { user, recipientEmail } = socket;
    // create room id using sender's and recipient's email
    const room = genRoomId(recipientEmail, user.email);

    let chat;
    // Check if room exists
    chat = await Chat.findOne({ room }).populate('messages');
    // If room does not exist, create a new one
    if (!chat) {
      chat = await Chat.create({ room });
    }

    // Join the room
    socket.join(room);

    // Send chat history to client
    if (chat.messages) socket.emit('messages', JSON.stringify(chat.messages));

    // Send message to room
    socket.on('message', async (data) => {
      // console.log(data);
      const { from, to, content } = JSON.parse(data);

      // Store message (in database)
      const message = await Message.create({ from, to, content, room });

      console.log('MESSAGE: ', message);

      // Add message to recipient's newMessage field

      const recipient = await User.findOne({ email: recipientEmail }).updateOne(
        {
          'newMessages.from': { $ne: user.email },
        },
        { $push: { newMessages: { from: user.email, name: user.name } } },
        {
          new: true,
          runValidators: true,
        },
      );

      // Send message to recipient
      socket.to(room).emit('message', JSON.stringify(message));
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = server;
