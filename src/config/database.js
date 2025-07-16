const mongoose = require("mongoose");

const connectDB = async () => {
  // console.log("mongodb+srv://gowtham01raj:ElonMusk%4001@projectmongo.g99yxxs.mongodb.net/devTinder");
  await mongoose.connect(
    "mongodb+srv://gowtham01raj:ElonMusk%4001@projectmongo.g99yxxs.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
