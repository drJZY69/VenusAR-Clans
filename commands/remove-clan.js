import Clan from "../database/clanModel.js";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  name: "remove-clan",
  data: new SlashCommandBuilder()
    .setName("remove-clan")
    .setDescription("حذف كلان من النظام")
    .addStringOption(option =>
      option.setName("name")
        .setDescription("اسم الكلان")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const name = interaction.options.getString("name");

    const clan = await Clan.findOne({ name });
    if (!clan) {
      return interaction.reply({ content: "❌ الكلان غير موجود!", ephemeral: true });
    }

    await Clan.deleteOne({ name });

    return interaction.reply(`🗑️ تم حذف الكلان **${name}** بنجاح.`);
  }
};
