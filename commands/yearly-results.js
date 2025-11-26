import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Clan from "../database/clanModel.js";
import Member from "../database/memberModel.js";
import Record from "../database/recordModel.js";
import fs from "fs";

export default {
  name: "yearly-results",
  data: new SlashCommandBuilder()
    .setName("yearly-results")
    .setDescription("عرض نتائج السنة للكلانات")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const clans = await Clan.find();
    if (!clans.length) return interaction.reply("❌ لا يوجد كلانات.");

    const config = JSON.parse(fs.readFileSync("./config.json"));
    let msg = "📆 **نتائج السنة:**\n\n";

    for (const clan of clans) {
      const members = await Member.find({ clanName: clan.name });

      let top = members.sort((a, b) => b.yearlyPoints - a.yearlyPoints)[0];
      top = top ? `<@${top.userId}> (${top.yearlyPoints})` : "لا يوجد مشاركين";

      const total = members.reduce((sum, m) => sum + m.yearlyPoints, 0);

      msg += `🟣 **${clan.name}**  
👥 الأعضاء: ${members.length}  
👑 أفضل عضو: ${top}  
📊 مجموع نقاط السنة: ${total}\n\n`;

      if (members.length > 0) {
        await Record.create({
          clanName: clan.name,
          topMemberId: members[0].userId,
          points: members[0].yearlyPoints,
          period: "year"
        });
      }

      for (const m of members) {
        m.yearlyPoints = 0;
