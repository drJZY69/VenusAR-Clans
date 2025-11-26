import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Clan from "../database/clanModel.js";
import Member from "../database/memberModel.js";
import Record from "../database/recordModel.js";
import fs from "fs";

export default {
  name: "monthly-results",
  data: new SlashCommandBuilder()
    .setName("monthly-results")
    .setDescription("عرض نتائج الشهر للكلانات")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const clans = await Clan.find();
    if (!clans.length) return interaction.reply("❌ لا يوجد كلانات.");

    const config = JSON.parse(fs.readFileSync("./config.json"));

    let msg = "📅 **نتائج الشهر:**\n\n";

    for (const clan of clans) {
      const members = await Member.find({ clanName: clan.name });

      let top = members.sort((a, b) => b.monthlyPoints - a.monthlyPoints)[0];
      top = top ? `<@${top.userId}> (${top.monthlyPoints})` : "لا يوجد مشاركين";

      const total = members.reduce((sum, m) => sum + m.monthlyPoints, 0);

      msg += `🔵 **${clan.name}**  
👥 الأعضاء: ${members.length}  
👑 أفضل عضو: ${top}  
📊 مجموع نقاط الشهر: ${total}\n\n`;

      if (members.length > 0) {
        await Record.create({
          clanName: clan.name,
          topMemberId: members[0].userId,
          points: members[0].monthlyPoints,
          period: "month"
        });
      }

      for (const m of members) {
        m.monthlyPoints = 0;
        await m.save();
      }
    }

    const channel = client.channels.cache.get(config.resultsChannel);
    if (channel) channel.send(msg);

    return interaction.reply("📨 تم إرسال نتائج الشهر!");
  }
};
