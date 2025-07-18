const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (fromUserId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([fromUserId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", async ({ firstName, fromUserId, targetUserId }) => {
      const roomId = getSecretRoomId(fromUserId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, fromUserId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(fromUserId, targetUserId);
          io.to(roomId).emit("messageReceived", { firstName, text });
          console.log(firstName + ":" + roomId);
          let chat = await Chat.findOne({
            participants: { $all: [fromUserId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [fromUserId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: fromUserId,
            text,
          });
          await chat.save();
        } catch (err) {
          console.error(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
