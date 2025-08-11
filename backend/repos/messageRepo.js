const Message = require("../models/message.model");

exports.createMessage = (data) => Message.create(data);
exports.getAllMessages = () => Message.find().sort({ createdAt: -1 });
exports.getUserMessages = (userEmail) => Message.find({ userEmail });
