const { sendMail } = require("../services/emailService");

exports.sendOrderConfirmation = async (to, order) => {
  const subject = `Order Confirmation - #${order.orderNumber}`;

  // Generate product rows
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 4px; border-bottom: 1px solid #eee;">
            ${
              item.colorImage
                ? `<img src="data:image/png;base64,${item.colorImage.toString(
                    "base64"
                  )}" alt="${
                    item.color
                  }" style="height:32px;vertical-align:middle;margin-right:6px;">`
                : ""
            }
            ${item.name}
          </td>
          <td style="padding: 8px 4px; border-bottom: 1px solid #eee;">${
            item.size
          }</td>
          <td style="padding: 8px 4px; border-bottom: 1px solid #eee;">${
            item.color
          }</td>
          <td style="padding: 8px 4px; border-bottom: 1px solid #eee; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 8px 4px; border-bottom: 1px solid #eee; text-align: right;">${
            item.price
          } EGP</td>
        </tr>
      `
    )
    .join("");

  // Full HTML
  const html = `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #b388cc; padding: 16px; text-align: center;">
          <img src="https://protoinfrastack.ivondy.com/media/XjM642wlbGinVtEapwWpTAKGJyfQq6p27KnN" alt="Yaqeen Logo" width="120" />
            <h1 style="margin: 0; color: #ffffff; font-size: 1.7rem; font-weight: bold; letter-spacing: 1px;">
              Thank you for your order!
            </h1>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <p style="font-size: 1.1rem; margin-bottom: 12px; color: #222;">Hi <b>${
            order.orderer.name || "there"
          }</b>,</p>
          <p style="font-size: 1rem; margin-bottom: 18px; color: #444;">
            We've received your order <b>#${
              order.orderNumber
            }</b>. Here's a summary:
          </p>

          <!-- Product table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
            <thead>
              <tr style="background: #f1f5f9; color: #4f46e5;">
                <th style="padding: 8px 4px; text-align: left; font-size: 0.98rem;">Product</th>
                <th style="padding: 8px 4px; text-align: left; font-size: 0.98rem;">Size</th>
                <th style="padding: 8px 4px; text-align: left; font-size: 0.98rem;">Color</th>
                <th style="padding: 8px 4px; text-align: center; font-size: 0.98rem;">Qty</th>
                <th style="padding: 8px 4px; text-align: right; font-size: 0.98rem;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Total -->
          <div style="font-size: 1.1rem; font-weight: bold; margin-bottom: 18px; text-align: right;">
            Total: <span style="color: #4f46e5;">${order.totalPrice} EGP</span>
          </div>

          <!-- Shipping Info -->
          <div style="margin-bottom: 18px;">
            <h3 style="margin: 0 0 4px 0; font-size: 1.05rem; color: #4f46e5;">Name</h3>
            <div style="color: #333;">${order.orderer.name || ""}</div>
            
            <h3 style="margin: 0 0 4px 0; font-size: 1.05rem; color: #4f46e5;">Phone Number</h3>
            <div style="color: #333;">${order.orderer.phone || ""}</div>
            
            <h3 style="margin: 0 0 4px 0; font-size: 1.05rem; color: #4f46e5;">Shipping Address</h3>
            <div style="color: #333;">
              ${
                order.shippingAddress &&
                typeof order.shippingAddress === "object"
                  ? [
                      order.shippingAddress.city,
                      order.shippingAddress.area,
                      order.shippingAddress.street,
                      order.shippingAddress.landmarks,
                      order.shippingAddress.residenceType,
                      order.shippingAddress.residenceType === "apartment"
                        ? `Floor: ${order.shippingAddress.floor}`
                        : "",
                      order.shippingAddress.residenceType === "apartment"
                        ? `Apt: ${order.shippingAddress.apartment}`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : order.shippingAddress?.address || ""
              }
            </div>
          </div>

          <!-- Contact -->
          <p style="font-size: 0.98rem; color: #555555; margin-bottom: 0;">
            If you have any questions, <a href="mailto:${
              process.env.EMAIL_USER
            }" style="color: #4f46e5; text-decoration: underline;">contact us</a> anytime.
          </p>
          <p style="font-size: 1.05rem; color: #4f46e5; margin-top: 18px; font-weight: 500;">
            We appreciate your trust in Yaqeen Clothing!
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f1f1f1; text-align: center; padding: 14px; font-size: 13px; color: #888;">
          &copy; 2025 Yaqeen Clothing. All rights reserved.
        </div>
      </div>
    </div>
  `;

  await sendMail({
    to,
    subject,
    html,
    text: `Hi ${order.orderer.name || "there"}, your order #${
      order._id
    } was received. Total: ${order.totalPrice} EGP.`,
  });
};
