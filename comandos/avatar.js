const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args, commandFlag) => {
  // sendHelp
  if (args.length > 0 && args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.avatar')
      .setDescription('Retorna o avatar de um dado usuário, ou o seu próprio avatar caso não haja argumento.')
      .addField('**Aliases**', '``av``', true)
      .addField('**Argumentos**', '``user (number)``', true)
      .addField('**Como usar**', '``avatar [idDoUsuário]``')
      .setFooter('.help')
    );
  }

  const argumentos = utils.getArgs(msg.content.slice(msg.content.split(' ')[0].length + 1));

  let url = msg.author.avatarURL(msg.author.avatar);
  let size = 512;
  let format = 'png';
  let flag = false;

  if (argumentos.length > 0) {
    argumentos.forEach(arg => {
      if (arg.name.startsWith('message') && arg.value !== '') {
        arg.value = utils.formatUserID(arg.value);

        const user = client.users.cache.get(arg.value)

        if (user) {
          url = user.avatarURL(client.users.cache.get(arg.value).avatar);
        } else {
          return msg.channel.send(utils.showError(400));

          flag = true;
        }
      } else if (arg.name === 'size') {
        size = arg.value;
      } else if (arg.name === 'format') {
        format = arg.value;
      }
    });
  }

  if (flag) {
    return false;
  }

  if (!commandFlag) {
    return msg.channel.send(`${url}?size=${size}`.replace('webp', format));
  } else {
    return `${url}?size=${size}`.replace('webp', format);
  }
};

exports.help = {
  name: 'avatar',
  aliases: [
    'av'
  ],
  description: 'Retorna o avatar de um dado usuário, ou o seu próprio avatar caso não haja argumento.',
  args: [{
    name: 'user',
    expects: 'number',
    alias: ''
  }],
  usage: 'avatar [idDoUsuário]'
};