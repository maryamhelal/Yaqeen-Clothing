const generateEmailTemplate = ({ title, subtitle, body, specialtext }) => {
  return `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
      <div style="background-color: #b388cc; padding: 16px; text-align: center;">
        <img src="https://protoinfrastack.ivondy.com/media/XjM642wlbGinVtEapwWpTAKGJyfQq6p27KnN" alt="Yaqeen Logo" width="120" />
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 20px; margin-top: 0;">${title}</p>
        <p style="font-size: 16px;">${subtitle}</p>
        ${
          specialtext
            ? `<div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 16px 0; text-align: center; color: #b388cc;">
                ${specialtext}
            </div>`
            : ""
        }
        ${body ? `<p style="font-size: 14px;">${body}</p>` : ""}
        <p style="font-size: 14px; color: #555;">If you feel this email was a mistake, please reply to this email or contact us at <a href="mailto:${
          process.env.EMAIL_USER
        }" style="color: #b388cc; text-decoration: underline;">${
    process.env.EMAIL_USER
  }</a>.</p>
      </div>

      <div style="background: #f1f1f1; text-align: center; padding: 12px; font-size: 12px; color: #888;">
        <p>&copy; Yaqeen Clothing. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
};

module.exports = {
  generateEmailTemplate,
};
