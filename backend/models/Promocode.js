const mongoose = require("mongoose");

const promocodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    percentage: { type: Number, required: true },
    type: {
      type: String,
      enum: ["category", "collection", "product"],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetName: { type: String, required: true },
    maxUses: { type: Number, required: true },
    uses: { type: Number, default: 0 },
    expiry: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promocode", promocodeSchema);
