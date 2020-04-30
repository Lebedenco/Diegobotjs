const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.statusServidor')
      .setDescription('Retorna o status do Servidor de Minecraft com Mods.')
      .addField('**Aliases**', '``serverStatus``\n``server``\n``servidor``', true)
      .addField('**Argumentos**', 'Não possui argumentos.', true)
      .setFooter('.help')
    );
  }

  let color = 0x00FF00;

  if (client.status === 'Status do Servidor: Offline!') {
    color = 0xff0000;
  } else if (client.status === 'Iniciando Ping...') {
    color = 0xFFFF00;
  }

  const embed = new Discord.MessageEmbed()
    .setTitle('Diegocraft | The 1.12.2 Pack')
    .setColor(color)
    .setDescription(client.status)
    .setThumbnail('https://avatars2.githubusercontent.com/u/31379034?s=460&u=69f122143dde7a2a8b3d9dbfac2aa44d208b92e8&v=4')
    .addField('Players', `${client.mcServerPlayersOnline}/${client.mcServerMaxPlayers}`, true)
    .addField('Versão', client.mcServerVersion, true)
    .addField('MOTD', client.mcServerMOTD, true);

  return msg.channel.send(embed);
};

exports.help = {
  name: 'statusServidor',
  aliases: [
    'serverStatus',
    'server',
    'servidor'
  ],
  description: 'Retorna o status do Servidor de Minecraft com Mods.',
  args: []
};