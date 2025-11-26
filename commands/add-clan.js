import Clan from "../database/clanModel.js";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  name: "add-clan",
  data: new SlashCommandBuilder()
    .setName("add-clan")
    .setDescription("إضافة كلان جديد للنظام")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("اسم الكلان")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName("role1")
        .setDescription("الرتبة الأولى للكلان")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName("role2")
        .setDescription("الرتبة الثانية (اختياري)")
        .setRequired(false)
    )
    .addRoleOption(option =>
      option
        .setName("role3")
        .setDescription("الرتبة الثالثة (اختياري)")
        .setRequired(false)
    )
    .addChannelOption(option =>
      option
        .setName("voice_channel")
        .setDescription("روم الصوت الخاص بالكلان")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const role1 = interaction.options.getRole("role1");
    const role2 = interaction.options.getRole("role2");
    const role3 = interaction.options.getRole("role3");
    const channel = interaction.options.getChannel("voice_channel");

    if (channel.type !== 2) {
      return interaction.reply({
        content: "❌ يجب اختيار روم صوتي فقط",
        ephemeral: true
      });
    }

    // التحقق من وجود الكلان مسبقاً
    const exists = await Clan.findOne({ name });
    if (exists) {
      return interaction.reply({
        content: "❌ هذا الكلان موجود مسبقاً!",
        ephemeral: true
      });
    }

    // تجميع كل الرتب المختارة في مصفوفة
    const roles = [role1?.id, role2?.id, role3?.id].filter(Boolean);

    // إنشاء الكلان
    await Clan.create({
      name,
      roleIds: roles, // مصفوفة الرتب الجديدة
      voiceChannelId: channel.id,
      timer: 30,
      totalPoints: 0,
      membersCount: 0
    });

    let rolesText = roles.map(r => `<@&${r}>`).join(" , ");

    return interaction.reply(
      `✅ تم إضافة الكلان **${name}** بنجاح!\n` +
        `📌 **الرتب المسجلة:** ${rolesText}\n` +
        `🎧 **الروم الصوتي:** <#${channel.id}>`
    );
  }
};
