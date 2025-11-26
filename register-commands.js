import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import config from "./config.json" assert { type: "json" };

// اكتب هنا ID السيرفر اللي تبغى ترفع فيه الأوامر
const GUILD_ID = "اكتب_هنا_رقم_السيرفر";

const commands = [];
const commandsPath = "./commands";
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

// قراءة ملفات الأوامر
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);

async function uploadCommands() {
  try {
    console.log("⏳ جاري رفع الأوامر إلى Discord...");

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, GUILD_ID),
      { body: commands }
    );

    console.log("✅ تم رفع أوامر الـ Slash بنجاح!");
  } catch (error) {
    console.error("❌ خطأ أثناء رفع الأوامر:", error);
  }
}

uploadCommands();
