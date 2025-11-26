import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Tracker from "../utils/tracker.js";

export default {
  name: "start-tracking",
  data: new SlashCommandBuilder()
    .setName("start-tracking")
    .setDescription("تشغيل نظام تتبع النقاط للكلانات")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    if (Tracker.running) {
      return interaction.reply({ content: "⚠️ التتبع يعمل بالفعل!", ephemeral: true });
    }

    Tracker.start(client);

    return interaction.reply("✅ تم تشغيل نظام التتبع بنجاح!");
  }
};
