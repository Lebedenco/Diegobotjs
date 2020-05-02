const Discord = require('discord.js');

const utils = require('../utils/utils');
const canvas = require('../utils/canvas');

exports.run = async (client, msg, args) => {
  if (args.length > 0 && args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.addTexto')
      .setDescription('Adiciona um texto à uma dada imagem.')
      .addField('**Aliases**', '``at``\n``addText``\n``addT``', true)
      .addField('**Argumentos**', '``imagem (string/attachment)``\n``texto (string)``\n``cor | c (string)``', true)
      .addField('**Como usar**', '``addTexto [imagem texto --cor=cor]``', true)
      .setFooter('.help')
    );
  }
  
  if (msg.attachments.array().length > 0) {
    let image;
    
    for await (value of msg.attachments.values()) {
      value.url ? image = value.url : undefined;
    }

    if (!image) {
      return msg.channel.send(utils.showError(400));
    }

    if (args.find(arg => arg.name === 'message1')) {
      const text = args.find(arg => arg.name === 'message1').value;

      image = await canvas.addText(image, text, args.find(arg => (arg.name === 'color' || arg.name === 'c')) ? args.find(arg => (arg.name === 'color' || arg.name === 'c')).value : undefined);
    } else {
      return msg.channel.send(utils.showError(400));
    }

    const attachment = new Discord.MessageAttachment(image, 'img.png');

    return msg.channel.send(new Discord.MessageEmbed()
      .attachFiles(attachment)
      .setImage('attachment://img.png')
    );
  }

  return msg.channel.send(utils.showError('missing arguments'));
};

exports.help = {
  name: 'addTexto',
  aliases: [
    'addText',
    'addT',
    'at'
  ],
  description: 'Adiciona um texto à uma dada imagem.',
  args: [{
    name: 'imagem',
    expects: 'string/attachment',
    alias: ''
  }, {
    name: 'texto',
    expects: 'string',
    alias: ''
  }, {
    name: 'cor',
    expects: 'string',
    alias: 'c'
  }],
  usage: 'addTexto [imagem texto --cor=cor]'
}