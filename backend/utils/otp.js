module.exports.generateAndSaveOTP = async (user) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOTP = otp;
  user.resetOTPExpires = Date.now() + 15 * 60 * 1000;
  await user.save();
  return otp;
};
