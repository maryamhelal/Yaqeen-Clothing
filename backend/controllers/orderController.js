const orderService = require('../services/orderService');
const emailService = require('../services/emailService');

exports.createOrder = async (req, res) => {
  try {
    console.log('Incoming order data:', req.body);
    let orderer = req.body.orderer || {};
    if (req.user) {
      orderer = { userId: req.user._id, name: req.user.name, email: req.user.email };
    }
    const order = await orderService.createOrder({ ...req.body, orderer });
    let emailWarning = null;
    try {
      const itemsHtml = order.items.map(item =>
        `<tr>
          <td style='padding: 8px 4px; border-bottom: 1px solid #eee;'>${item.name}</td>
          <td style='padding: 8px 4px; border-bottom: 1px solid #eee;'>${item.size || ''}</td>
          <td style='padding: 8px 4px; border-bottom: 1px solid #eee;'>${item.color || ''}</td>
          <td style='padding: 8px 4px; border-bottom: 1px solid #eee; text-align: center;'>${item.quantity}</td>
          <td style='padding: 8px 4px; border-bottom: 1px solid #eee; text-align: right;'>${item.price} EGP</td>
        </tr>`
      ).join('');
      await emailService.sendMail({
        to: order.orderer.email,
        subject: 'Order Placed - Yaqeen Clothing',
        text: `Hi ${order.orderer.name || 'there'}, your order #${order.orderNumber} was received.`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #f4f4f8; padding: 0; margin: 0;">
            <div style="max-width: 520px; margin: 32px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #c7d2fe 0%, #a5b4fc 100%); padding: 24px 0; text-align: center;">
                <img src="https://protoinfrastack.ivondy.com/media/XjM642wlbGinVtEapwWpTAKGJyfQq6p27KnN" alt="Yaqeen Logo" style="height: 60px; margin-bottom: 8px;" />
                <h1 style="margin: 0; color: #ffffff; font-size: 1.7rem; font-weight: bold; letter-spacing: 1px;">Thank you for your order!</h1>
              </div>
              <div style="padding: 28px 24px 18px 24px;">
                <p style="font-size: 1.1rem; margin-bottom: 12px; color: #222;">Hi <b>${order.orderer.name || 'there'}</b>,</p>
                <p style="font-size: 1rem; margin-bottom: 18px; color: #444;">We've received your order <b>#${order.orderNumber}</b>. Here's a summary:</p>
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
                  <tbody>${itemsHtml}</tbody>
                </table>
                <div style="font-size: 1.1rem; font-weight: bold; margin-bottom: 18px; text-align: right;">Total: <span style='color: #4f46e5;'>${order.totalPrice} EGP</span></div>
                <div style="margin-bottom: 18px;">
                  <h3 style="margin 0 0 4px 0; font-size: 1.05rem; color: #4f46e5;">Name</h3>
                  <div style="color: #333;">${order.shippingAddress?.name || ''}</div>
                  <h3 style="margin 0 0 4px 0; font-size: 1.05rem; color: #4f46e5;">Phone Number</h3>
                  <div style="color: #333;">${order.shippingAddress?.phone || ''}</div>
                  <h3 style="margin: 0 0 4px 0; font-size: 1.05rem; color: #4f46e5;">Shipping Address</h3>
                  <div style="color: #333;">
                    ${order.shippingAddress && typeof order.shippingAddress === 'object'
                      ? [
                          order.shippingAddress.city,
                          order.shippingAddress.area,
                          order.shippingAddress.street,
                          order.shippingAddress.landmarks,
                          order.shippingAddress.residenceType,
                          order.shippingAddress.residenceType === 'apartment' ? `Floor: ${order.shippingAddress.floor}` : '',
                          order.shippingAddress.residenceType === 'apartment' ? `Apt: ${order.shippingAddress.apartment}` : ''
                        ].filter(Boolean).join(', ')
                      : order.shippingAddress?.address || ''}
                  </div>
                </div>
                <p style="font-size: 0.98rem; color: #555555; margin-bottom: 0;">If you have any questions, <a href="mailto:${process.env.EMAIL_USER}" style="color: #4f46e5; text-decoration: underline;">contact us</a> anytime.</p>
                <p style="font-size: 1.05rem; color: #4f46e5; margin-top: 18px; font-weight: 500;">We appreciate your trust in Yaqeen Clothing!</p>
              </div>
              <div style="background: #f1f1f1; text-align: center; padding: 14px; font-size: 13px; color: #888;">&copy; 2025 Yaqeen Clothing. All rights reserved.</div>
            </div>
          </div>
        `
      });
    } catch (e) {
      emailWarning = 'Order placed, but failed to send confirmation email.';
      console.error('Email error (order confirmation):', e);
    }
    res.status(201).json({ orderNumber: order.orderNumber, order, emailWarning });
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    // Only allow orderer or admin/superadmin
    if (req.user.role === 'user' && (!order.orderer || String(order.orderer.userId) !== String(req.user._id))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.orderNumber, req.body.status);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user._id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};