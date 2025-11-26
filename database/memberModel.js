import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  clanName: { type: String, required: true },
  weeklyPoints: { type: Number, default: 0 },
  monthlyPoints: { type: Number, default: 0 },
  yearlyPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 }
});

export default mongoose.model("Member", memberSchema);
