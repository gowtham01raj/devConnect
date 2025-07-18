const express = require("express");
const { Chat } = require("../models/chat");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const fromUserId = req.user?._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [fromUserId, targetUserId] },
    }).populate({
        path:"messages.senderId",
        select:"firstName lastName emailId"
    });
    if (!chat) {
      chat = new Chat({
        participants: [fromUserId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
  }
});

module.exports = chatRouter;
