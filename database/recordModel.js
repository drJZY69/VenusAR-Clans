import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  clanName: { type: String, required: true },
  topMemberId: { type: String, required: true },
  points: { type: Number, required: true },
  period: { type: String, required: true }, // week / month / year
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Record", recordSchema);
