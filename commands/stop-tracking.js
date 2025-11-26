import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Tracker from "../utils/tracker.js";

export default {
  name: "stop-tracking",
  data: new SlashCommandBuilder()
    .setName("stop-tracking")
    .setDescription("إيقاف نظام التتبع")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!Tracker.running) {
      return interaction.reply({ content: "⚠️ التتبع متوقف بالفعل!", ephemeral: true });
    }

    Tracker.stop();
    return interaction.reply("🛑 تم إيقاف نظام التتبع.");
  }
};
