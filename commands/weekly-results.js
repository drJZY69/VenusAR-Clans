import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Clan from "../database/clanModel.js";
import Member from "../database/memberModel.js";
import Record from "../database/recordModel.js";
import fs from "fs";

export default {
  name: "weekly-results",
  data: new SlashCommandBuilder()
    .setName("weekly-results")
    .setDescription("عرض ونشر نتائج أسبوعية للكلانات")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const clans = await Clan.find();
    if (!clans.length) {
      return interaction.reply("❌ لا يوجد أي كلان مسجل.");
    }

    const config = JSON.parse(fs.readFileSync("./config.json"));

    let finalMessage = "🏆 **نتائج الأسبوع للكلانات:**\n\n";

    for (const clan of clans) {
      const members = await Member.find({ clanName: clan.name });

      let topMember = members.sort((a, b) => b.weeklyPoints - a.weeklyPoints)[0];
      topMember = topMember ? `<@${topMember.userId}> (${topMember.weeklyPoints})` : "لا يوجد مشاركين";

      const total = members.reduce((sum, m) => sum + m.weeklyPoints, 0);

      finalMessage += `🔥 **${clan.name}**  
👥 عدد الأعضاء: ${members.length}  
👑 أفضل عضو: ${topMember}  
📊 مجموع نقاط الأسبوع: ${total}\n\n`;

      // حفظ سجل الأسبوع
      if (members.length > 0) {
        await Record.create({
          clanName: clan.name,
          topMemberId: members[0].userId,
          points: members[0].weeklyPoints,
          period: "week"
        });
      }

      // تصفير نقاط الأسبوع
      for (const m of members) {
        m.weeklyPoints = 0;
        await m.save();
      }
    }

    const channel = client.channels.cache.get(config.resultsChannel);
    if (channel) channel.send(finalMessage);

    return interaction.reply("📨 تم إرسال نتائج الأسبوع!");
  }
};
