const User = require("../models/User");

exports.unsubscribe = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Unsubscribe token is required" });
    }

    const user = await User.findOne({ 'emailPreferences.unsubscribeToken': token });
    
    if (!user) {
      return res.status(404).json({ error: "Invalid unsubscribe token" });
    }

    // Update user preferences to unsubscribe from promotional emails
    user.emailPreferences.promotionalEmails = false;
    await user.save();

    res.json({ 
      success: true, 
      message: "You have been successfully unsubscribed from promotional emails",
      email: user.email 
    });
  } catch (err) {
    console.error("Error processing unsubscribe:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.resubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Resubscribe user to promotional emails
    user.emailPreferences.promotionalEmails = true;
    await user.save();

    res.json({ 
      success: true, 
      message: "You have been successfully resubscribed to promotional emails" 
    });
  } catch (err) {
    console.error("Error processing resubscribe:", err);
    res.status(500).json({ error: err.message });
  }
};
