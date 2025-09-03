const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    city: String,
    area: String,
    street: String,
    landmarks: String,
    building: Number,
    residenceType: {
      type: String,
      enum: ["apartment", "private_house", "work"],
    },
    floor: Number,
    apartment: Number,
    companyName: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: addressSchema,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    emailPreferences: {
      promotionalEmails: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      unsubscribeToken: { type: String, unique: true, sparse: true },
      lastEmailSent: { type: Date },
    },
    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
