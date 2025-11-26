import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import mongoose from "mongoose";
import config from "./config.json" assert { type: "json" };
import Tracker from "./utils/tracker.js";

// تحميل التوكن من Railway
const TOKEN = process.env.TOKEN || config.token;
const CLIENT_ID = process.env.CLIENT_ID || config.clientId;
const MONGO_URI = process.env.MONGO_URI || config.mongoURI;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// تحميل ملفات الأوامر
const commandsFolder = "./commands";
const commandFiles = fs.readdirSync(commandsFolder).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.name, command.default);
  console.log(`✔ Loaded command: ${command.default.name}`);
}

// تشغيل البوت
client.once("ready", async () => {
  console.log(`🔥 Logged in as ${client.user.tag}`);

  // اتصال MongoDB
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✔ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }

  // بدء نظام التتبع
  Tracker.start(client);
});

// استقبال أوامر السلاش
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    interaction.reply({ content: "❌ حدث خطأ أثناء تنفيذ الأمر.", ephemeral: true });
  }
});

client.login(TOKEN);
