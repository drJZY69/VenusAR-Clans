import { SlashCommandBuilder } from "discord.js";

export default {
  name: "info",
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("معلومات عن أوامر البوت"),

  async execute(interaction) {
    return interaction.reply(`
📘 **أوامر البوت الأساسية:**

• /add-clan — إضافة كلان جديد  
• /remove-clan — حذف كلان  
• /list-clans — عرض الكلانات  
• /set-timer — تعيين وقت لكل كلان  
• /set-results-channel — تحديد روم النتائج  
• /start-tracking — بدء التتبع  
• /stop-tracking — إيقاف التتبع  
• /weekly-results — نتائج أسبوعية  
• /monthly-results — نتائج شهرية  
• /yearly-results — نتائج سنوية  
    `);
  }
};
