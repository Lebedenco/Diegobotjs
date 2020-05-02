const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = async (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.avatar')
      .setDescription('Ao fornecer um usuário, retorna uma montagem de seu avatar fazendo análise.')
      .addField('**Aliases**', 'Não possui aliases.', true)
      .addField('**Argumentos**', '``user (string)``', true)
      .addField('**Como usar**', 'analise [idDoUsuário | imagem]', true)
      .setFooter('.help')
    );
  }
  
  const canvas = require('../utils/canvas');
  const avatar = require('./avatar');
  const path = require('path');

  let user, img;

  img = args.find(arg => arg.name === 'number1') ? args.find(arg => arg.name === 'number1').value : undefined;

  if (!img) {
    for await (value of msg.attachments.values()) {
      value.url ? img = value.url : img = undefined;
    }

    if (!img) {
      img = args.find(arg => arg.name === 'link1') ? args.find(arg => arg.name === 'link1').value : undefined;

      if (!img) {
        img = avatar.run(client, msg, [], true);
      }
    }
  } 

  const image = await canvas.analise(img, path.join(__dirname, '../media/analise.png'));

  const attachment = new Discord.MessageAttachment(image, 'image.png');

  return msg.channel.send(new Discord.MessageEmbed()
    .setTitle('Análise')
    .attachFiles(attachment)
    .setImage('attachment://image.png')
  );
};

exports.help = {
  name: 'analise',
  aliases: [],
  description: 'Ao fornecer um usuário, retorna uma montagem de seu avatar fazendo análise.',
  args: [{
    name: 'user',
    expects: 'number',
    alias: ''
  }, {
    name: 'imagem',
    expects: 'link/attachment',
    alias: ''
  }],
  usage: 'analise [idDoUsuário | imagem]'
}