const Discord = require('discord.js');
const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' && arg.value === 'true') || arg.name === 'h')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.cancelar')
      .setDescription('Cancela um dado usuário.')
      .addField('**Aliases**', '``cancel``', true)
      .addField('**Argumentos**', '``user (string)``\n``motivo (string)``', true)
      .setFooter('.help')
    );
  }

  const arg = msg.content.split(' ');

  if (arg[1]) {
    let user = client.users.cache.get(utils.formatUserID(arg[1]));

    if (user) {
      arg[1] = user.username;
    }
  } else {
    return msg.channel.send(utils.showError('missing arguments'));
  }

  return msg.channel.send(`Manas, cancelem o ${arg.splice(1).toString().replace(/,/g, ' ')}!`);
};

exports.help = {
  name: 'cancelar',
  aliases: [
    'cancel'
  ],
  description: 'Cancela um dado usuário.',
  args: [{
    name: 'user',
    expects: 'string',
    alias: ''
  }, {
    name: 'motivo',
    expects: 'string',
    alias: ''
  }]
}