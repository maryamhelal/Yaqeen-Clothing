const messageRepo = require("../repos/messageRepo");
const emailService = require("./emailService");

exports.createMessage = async (data) => {
  const message = await messageRepo.createMessage(data);

  await emailService.sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Message from ${message.name}`,
    html: `
    <h2>New Message from ${message.name}</h2>
    <p><strong>Phone:</strong> ${message.phone}</p>
    <p><strong>Email:</strong> ${message.email}</p>
    <p><strong>Message:</strong></p>
    <p>${message.message}</p>
    `,
  });
};

exports.getAllMessages = async () => {
  return await messageRepo.getAllMessages();
};

exports.getUserMessages = async (userEmail) => {
  return await messageRepo.getUserMessages(userEmail);
}
