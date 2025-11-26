import mongoose from "mongoose";

const clanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  roleId: { type: String, required: true },
  voiceChannelId: { type: String, required: true },
  timer: { type: Number, default: 30 }, // بالدقائق
  totalPoints: { type: Number, default: 0 }, // مجموع نقاط الكلان
  membersCount: { type: Number, default: 0 }  // عدد اعضاء الكلان المسجلين
});

export default mongoose.model("Clan", clanSchema);
