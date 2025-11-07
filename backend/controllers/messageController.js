const messageService = require("../services/messageService");

exports.createMessage = async (req, res) => {
  try {
    const message = await messageService.createMessage(req.body);
    res.status(201).json({
      success: true,
      message: "Your message has been sent to the admin.",
      data: message,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await messageService.getAllMessages();
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserMessages = async (req, res) => {
  try {
    const messages = await messageService.getUserMessages(req.params.userEmail);
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.resolveMessage = async (req, res) => {
  try {
    const message = await messageService.resolveMessage(req.params.id);
    res.status(200).json({
      success: true,
      message: "Message resolved successfully.",
      data: message,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
