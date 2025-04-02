const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "sending", "unsent", "read"],
    default: "sent",
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  receivedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
