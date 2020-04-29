const cron = require('node-cron');

const ready = async () => {
  // Minute(0-59) Hour(0-24) Day(1-31) Month(1-12) DayOfTheWeek(0-6)
  cron.schedule('0 8 * * 1', () => {
    utils.sendMondayMeme(client, memeChannelID);
  });
};

module.exports = {
  name: 'ready',
  run: ready
}