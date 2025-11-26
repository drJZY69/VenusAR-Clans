import mongoose from "mongoose";

const timerSchema = new mongoose.Schema({
  clanName: { type: String, required: true },
  lastTick: { type: Date, default: Date.now }
});

export default mongoose.model("Timer", timerSchema);
