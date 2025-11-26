import Clan from "../database/clanModel.js";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  name: "add-clan",
  data: new SlashCommandBuilder()
    .setName("add-clan")
    .setDescription("إضافة كلان جديد للنظام")
    .addStringOption(option =>
      option.setName("name")
        .setDescription("اسم الكلان")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName("role")
        .setDescription("رتبة الكلان")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName("voice_channel")
        .setDescription("روم الصوت الخاص بالكلان")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const role = interaction.options.getRole("role");
    const channel = interaction.options.getChannel("voice_channel");

    if (channel.type !== 2) {
      return interaction.reply({ content: "❌ يجب اختيار روم صوتي فقط", ephemeral: true });
    }

    // تحقق إذا الكلان موجود مسبقًا
    const existing = await Clan.findOne({ name });
    if (existing) {
      return interaction.reply({ content: "❌ هذا الكلان موجود مسبقاً!", ephemeral: true });
    }

    // حفظ الكلان
    await Clan.create({
      name,
      roleId: role.id,
      voiceChannelId: channel.id,
      timer: 30,
      totalPoints: 0,
      membersCount: 0
    });

    return interaction.reply(`✅ تم إضافة الكلان **${name}** بنجاح!`);
  }
};
