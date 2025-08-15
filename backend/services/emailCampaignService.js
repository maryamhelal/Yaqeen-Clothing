const emailService = require('./emailService');
const User = require('../models/User');

/**
 * In-process email campaign service (no external queue).
 * Sends promotional emails directly using Nodemailer transporter.
 */
class EmailCampaignService {
  async sendSaleEmail(products, salePercentage, saleType = 'product') {
    // Fetch recipients who allow promotional emails
    const users = await User.find({
      'emailPreferences.promotionalEmails': true,
      email: { $exists: true, $ne: '' }
    });

    let sentCount = 0;
    for (const user of users) {
      try {
        // Ensure user has an unsubscribe token
        if (!user.emailPreferences.unsubscribeToken) {
          user.emailPreferences.unsubscribeToken = this.#generateUnsubscribeToken();
          await user.save();
        }

        const html = this.#generateSaleEmailContent(
          products,
          salePercentage,
          saleType,
          { email: user.email, name: user.name, unsubscribeToken: user.emailPreferences.unsubscribeToken }
        );

        await emailService.sendMail({
          to: user.email,
          subject: `🎉 Special Sale Alert - Up to ${salePercentage}% OFF!`,
          html
        });

        sentCount += 1;
        // Gentle throttle to avoid mail provider rate limits
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 75));
      } catch (err) {
        // Continue to next recipient on failure
        // eslint-disable-next-line no-console
        console.error(`Error sending email to ${user.email}:`, err.message);
      }
    }

    // Update lastEmailSent for analytics
    await User.updateMany(
      { _id: { $in: users.map((u) => u._id) } },
      { 'emailPreferences.lastEmailSent': new Date() }
    );

    return { success: true, recipientsCount: sentCount };
  }

  #generateUnsubscribeToken() {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }

  #generateSaleEmailContent(products, salePercentage, saleType, recipient) {
    const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?token=${recipient.unsubscribeToken}`;

    const productsHtml = products
      .map(
        (product) => `
      <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center;">
          ${
            product.images && product.images.length > 0
              ? `<img src="data:image/jpeg;base64,${product.images[0].toString('base64')}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 16px;">`
              : ''
          }
          <div style="flex: 1;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">${product.name}</h3>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="text-decoration: line-through; color: #999; font-size: 16px;">${product.price} EGP</span>
              <span style="color: #e53e3e; font-weight: bold; font-size: 18px;">${
                product.salePrice || Math.round(product.price * (1 - salePercentage / 100))
              } EGP</span>
              <span style="background: #e53e3e; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${salePercentage}% OFF</span>
            </div>
          </div>
        </div>
      </div>`
      )
      .join('');

    return `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 Special Sale Alert!</h1>
            <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 18px;">Up to ${salePercentage}% OFF on ${
              saleType === 'product' ? 'selected products' : saleType
            }</p>
          </div>

          <div style="padding: 32px 24px;">
            <p style="font-size: 18px; margin-bottom: 16px; color: #333;">Hi ${recipient.name || 'there'}!</p>
            <p style="font-size: 16px; margin-bottom: 24px; color: #666;">
              We're excited to bring you amazing deals on our latest collection. Don't miss out on these incredible savings!
            </p>

            <div style="margin: 24px 0;">
              ${productsHtml}
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Shop Now
              </a>
            </div>

            <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>Sale ends soon!</strong> These prices are only available for a limited time. 
                Make sure to grab your favorites before they're gone!
              </p>
            </div>
          </div>

          <div style="background: #f1f1f1; padding: 16px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0 0 8px 0;">&copy; 2025 Yaqeen Clothing. All rights reserved.</p>
            <p style="margin: 0;">
              <a href="${unsubscribeUrl}" style="color: #888; text-decoration: underline;">Unsubscribe from promotional emails</a>
            </p>
          </div>
        </div>
      </div>`;
  }
}

module.exports = new EmailCampaignService();


