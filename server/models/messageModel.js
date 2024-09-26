const mongoose = require("mongoose")
const { Schema } = mongoose

const messageSchema = new Schema(
  {
    from: {
      type: String,
      required: [true, "Please provide email of origin"],
    },
    to: {
      type: String,
      required: [true, "Please provide email of destination"],
    },
    content: { type: String, required: [true, "Message cannot be empty"] },
    sentAt: {
      type: Date,
      default: Date.now(),
    },
    room: {
      type: String,
      required: [true, "Message must beling to a chat"],
      ref: "Chat",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

const Message = mongoose.model("Message", messageSchema)

module.exports = Message
