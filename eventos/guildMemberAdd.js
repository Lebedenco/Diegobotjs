const guildMemberAdd = async (client, member) => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'geral');

  if (!channel) {
    return;
  }

  channel.send(`Olá ${member}! Seja bem-vindo ao ${channel.guild.name}!`);

  if (channel.guild.id === '689981750214131830') {
    const role = await member.guild.roles.cache.find(r => r.name === 'Assalariado');

    member.roles.add(role);
  }
};

module.exports = {
  name: 'guildMemberAdd',
  run: guildMemberAdd
}