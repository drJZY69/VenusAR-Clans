import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";

export default {
  name: "set-results-channel",
  data: new SlashCommandBuilder()
    .setName("set-results-channel")
    .setDescription("تحديد الروم الذي يرسل فيه البوت النتائج الأسبوعية")
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("الروم المطلوب")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    // تحديث config.json
    const config = JSON.parse(fs.readFileSync("./config.json"));
    config.resultsChannel = channel.id;
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));

    return interaction.reply(`📢 تم تحديد روم النتائج: <#${channel.id}>`);
  }
};
