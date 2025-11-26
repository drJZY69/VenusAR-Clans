import Clan from "../database/clanModel.js";
import Member from "../database/memberModel.js";
import Timer from "../database/timersModel.js";
import logger from "./logger.js";

class TrackerSystem {
  constructor() {
    this.running = false;
    this.interval = null;
  }

  async start(client) {
    if (this.running) return;

    this.running = true;
    logger.success("Tracking system started.");

    this.interval = setInterval(async () => {
      if (!this.running) return;

      const clans = await Clan.find();
      if (!clans.length) return;

      for (const clan of clans) {
        try {
          // روم الصوت
          const channel = client.channels.cache.get(clan.voiceChannelId);
          if (!channel) continue;

          // فلترة الأعضاء → كل عضو عنده أي رتبة من مصفوفة roleIds
          const membersInVoice = [...channel.members.values()]
            .filter(member => clan.roleIds.some(r => member.roles.cache.has(r)));

          const count = membersInVoice.length;
          if (count === 0) continue;

          const timerDoc = await Timer.findOne({ clanName: clan.name });
          const now = Date.now();

          if (!timerDoc) {
            await Timer.create({ clanName: clan.name, lastTick: now });
            continue;
          }

          const minutesPassed = (now - timerDoc.lastTick) / (1000 * 60);

          if (minutesPassed >= clan.timer) {
            logger.info(`Adding points for clan ${clan.name}`);

            // نقاط كل عضو
            for (const member of membersInVoice) {
              let memDoc = await Member.findOne({
                userId: member.id,
                clanName: clan.name
              });

              if (!memDoc) {
                memDoc = await Member.create({
                  userId: member.id,
                  clanName: clan.name
                });
              }

              memDoc.weeklyPoints += 1;
              memDoc.monthlyPoints += 1;
              memDoc.yearlyPoints += 1;
              memDoc.totalPoints += 1;
              await memDoc.save();
            }

            // نقاط الكلان
            clan.totalPoints += count;
            clan.membersCount = count;
            await clan.save();

            // تحديث التايمر
            timerDoc.lastTick = now;
            await timerDoc.save();
          }
        } catch (err) {
          logger.error(err);
        }
      }
    }, 10 * 1000); // كل 10 ثواني
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this.interval);
    logger.warning("Tracking system stopped.");
  }
}

export default new TrackerSystem();
