const emailService = require("../services/emailService");
const { generateEmailTemplate } = require("./emailTemplates");

async function sendTemplatedEmail({
  to,
  subject,
  title,
  subtitle,
  body,
  specialtext,
}) {
  let emailWarning = null;

  const html = generateEmailTemplate({ title, subtitle, body, specialtext });

  try {
    await emailService.sendMail({
      to,
      subject,
      text: `${subtitle}\n${specialtext ? specialtext + "\n" : ""}${
        body || ""
      }`,
      html,
    });
  } catch (e) {
    console.error(`Email error (${subject}):`, e);
    emailWarning = `Email send failed for ${subject}`;
  }

  return emailWarning;
}

module.exports = {
  sendTemplatedEmail,
};
