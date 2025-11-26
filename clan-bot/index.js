import { Client, GatewayIntentBits, Collection, Partials } from "discord.js";
import fs from "fs";
import mongoose from "mongoose";
import cron from "cron";
import config from "./config.json" assert { type: "json" };

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.name, command.default);
}

// Handle interactions
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "❌ حدث خطأ", ephemeral: true });
  }
});

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.log("❌ Mongo Error:", err));

// Login
client.login(config.token);
console.log("🤖 Bot Started...");
