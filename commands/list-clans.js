import Clan from "../database/clanModel.js";
import { SlashCommandBuilder } from "discord.js";

export default {
  name: "list-clans",
  data: new SlashCommandBuilder()
    .setName("list-clans")
    .setDescription("عرض جميع الكلانات المسجلة"),

  async execute(interaction) {
    const clans = await Clan.find();

    if (!clans.length) {
      return interaction.reply("❌ لا يوجد أي كلان مسجل بعد.");
    }

    let text = "📋 **قائمة الكلانات:**\n\n";

    for (const c of clans) {
      const roles = c.roleIds.map(r => `<@&${r}>`).join(" , ");
      text += `• **${c.name}**\n   🟪 الرتب: ${roles}\n   🎧 الروم: <#${c.voiceChannelId}>\n\n`;
    }

    return interaction.reply(text);
  }
};
