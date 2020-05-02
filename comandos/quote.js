const Discord = require('discord.js');

const utils = require('../utils/utils');
const config = require('../config/config.json');
const fs = require('fs');
const path = require('path');

exports.run = async (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.quote')
      .setDescription('Retorna uma citação.')
      .addField('**Aliases**', '``citacao``\n``citação``\n``q``', true)
      .addField('**Argumentos**', '``número (number)``\n``add | a (boolean)``\n``mensagem (string)``', true)
      .addField('**Como usar**', '``quote [númeroDaQuote] [--add idDaMensagem]``')
      .setFooter('.help')
    );
  }

  const storedGuild = config.guild.find(g => g.id === msg.guild.id);
  let guildID;

  if (storedGuild) {
    guildID = storedGuild.id;
  } else {
    guildID = msg.guild.id;
  }

  const messageID = args.find(arg => arg.name === 'message1') ? args.find(arg => arg.name === 'message1').value : undefined;
  const number = args.find(arg => arg.name === 'number1') ? args.find(arg => arg.name === 'number1').value : undefined;

  if (!messageID && !number) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('Citações')
      .addField('Citações', `${config.guild.find(g => g.id === guildID) ? config.guild.find(g => g.id === guildID).quotes.map(quote => `\`\`${quote.quote}\`\`\nAutor: \`\`${quote.author}\`\`\nCriada por: \`\`${quote.createdBy}\`\`\n\n`) : 'Este servidor não possui citações.'}`)
    );
  }

  if (args.find(arg => (arg.name === 'add' || arg.name === 'a') && arg.value.toString() === 'true')) {
    let message;

    for await (value of msg.guild.channels.cache.values()) {
      if (value instanceof Discord.VoiceChannel || value instanceof Discord.CategoryChannel) {
        continue;
      }

      await value.messages.fetch(messageID)
        .then(msg => {
          message = msg;
        })
        .catch(err => console.log(err));

      if (message) {
        break;
      }
    }

    if (!message) {
      return msg.channel.send(utils.showError(404));
    }

    const existingQuote = storedGuild ? storedGuild.quotes.find(quote => quote.id === messageID) : undefined;

    if (existingQuote) {
      return msg.channel.send(`Essa citação já foi adicionada!\n\`\`${existingQuote.author}\`\`: ${existingQuote.quote}`);
    }

    if (!storedGuild) {
      config.guild.push({
        id: guildID,
        quotes: [{
          id: message.id,
          quote: message.content,
          author: message.author.username,
          createdBy: msg.author.username
        }]
      });
    } else {
      storedGuild.quotes.push({
        id: message.id,
        quote: message.content,
        author: message.author.username,
        createdBy: msg.author.username
      });
    }

    fs.writeFileSync(path.join(__dirname, '../config/config.json'), JSON.stringify(config), (err) => {
      if (err) {
        return utils.showError(err);
      }
    });

    return msg.channel.send(`Citação adicionada com sucesso! ` +
      `Use \`\`.quote ${storedGuild ? storedGuild.quotes.length - 1 : 0}\`\` para ver a citação.`);
  }


  if (storedGuild) {
    const quote = storedGuild.quotes[parseInt(number)];

    if (quote) {
      return msg.channel.send(`\`\`${quote.author}\`\`: ${quote.quote}`);
    }
  }

  return msg.channel.send(utils.showError(404));
};

exports.help = {
  name: 'quote',
  aliases: [
    'citacao',
    'citação',
    'q'
  ],
  description: 'Retorna uma citação.',
  args: [{
    name: 'número',
    expects: 'number',
    alias: ''
  }, {
    name: 'add',
    expects: 'boolean',
    alias: 'a'
  }, {
    name: 'mensagem',
    expects: 'string',
    alias: ''
  }],
  usage: 'quote [númeroDaQuote] [--add idDaMensagem]'
}