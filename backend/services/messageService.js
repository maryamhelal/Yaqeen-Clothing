const messageRepo = require("../repos/messageRepo");
const emailService = require("./emailService");

exports.createMessage = async (data) => {
  const message = await messageRepo.createMessage(data);

  // Get all admins and superadmins
  const Admin = require("../models/Admin");
  const admins = await Admin.find({ role: { $in: ["admin", "superadmin"] } });
  const adminEmails = admins.map((a) => a.email).filter(Boolean);

  if (adminEmails.length > 0) {
    await emailService.sendMail({
      to: adminEmails.join(","),
      subject: `New Message from ${message.name}`,
      html: `
        <h2>New Message from ${message.name}</h2>
        <p><strong>Phone:</strong> ${message.phone}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.message}</p>
      `,
    });
  }
};

exports.getAllMessages = async () => {
  return await messageRepo.getAllMessages();
};

exports.getUserMessages = async (userEmail) => {
  return await messageRepo.getUserMessages(userEmail);
};

exports.resolveMessage = async (id) => {
  return await messageRepo.resolveMessage(id);
};
