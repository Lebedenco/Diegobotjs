const guildMemberRemove = (client, member) => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'geral');

  if (!channel) {
    return;
  }

  channel.send(`${member} saiu do servidor... Ah! Agora que a brincadeira tava ficando boa...`);
};

module.exports = {
  name: 'guildMemberRemove',
  run: guildMemberRemove
}