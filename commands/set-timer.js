import Clan from "../database/clanModel.js";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  name: "set-timer",
  data: new SlashCommandBuilder()
    .setName("set-timer")
    .setDescription("تحديد الوقت لكل كلان (10-60 دقيقة)")
    .addStringOption(option =>
      option.setName("clan")
        .setDescription("اسم الكلان")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("minutes")
        .setDescription("الوقت بالدقائق")
        .addChoices(
          { name: "10", value: 10 },
          { name: "20", value: 20 },
          { name: "30", value: 30 },
          { name: "40", value: 40 },
          { name: "50", value: 50 },
          { name: "60", value: 60 }
        )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const clan = interaction.options.getString("clan");
    const minutes = interaction.options.getInteger("minutes");

    const found = await Clan.findOne({ name: clan });
    if (!found) return interaction.reply("❌ الكلان غير موجود.");

    found.timer = minutes;
    await found.save();

    return interaction.reply(`⏱️ تم تعيين الوقت لكلان **${clan}** إلى **${minutes} دقيقة**.`);
  }
};
