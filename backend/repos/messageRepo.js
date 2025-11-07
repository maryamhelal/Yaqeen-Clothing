const Message = require("../models/Message");

exports.createMessage = (data) => Message.create(data);
exports.getAllMessages = () => Message.find().sort({ createdAt: -1 });
exports.getUserMessages = (userEmail) => Message.find({ userEmail });
exports.resolveMessage = (id) =>
  Message.findByIdAndUpdate(id, { resolved: true }, { new: true });
