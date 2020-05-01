const Discord = require('discord.js');
const fs = require('fs');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.help')
      .setDescription('Retorna a descrição do bot, e uma lista de comandos. Também serve para retornar a descrição de cada comando. Exemplo: \`\`.help <comando>\`\`')
      .addField('**Aliases**', '``h``', true)
      .addField('**Argumentos**', '``comando (string)``', true)
      .setFooter('.help')
    );
  }

  const arg = args.find(a => a.name === 'message1');

  if (arg) {
    const files = fs.readdirSync(__dirname);
    let command = files.find(file => file === `${arg.value}.js`);

    if (!command) {
      let cmd;

      files.forEach(file => {
        cmd = require(`./${file}`);

        for (let i = 0; i < cmd.help.aliases.length; i++) {
          if (cmd.help.aliases[i] === arg.value) {
            command = file;
          }
        }
      })
    }

    if (command) {
      command = require(`./${command}`);

      return msg.channel.send(new Discord.MessageEmbed()
        .setTitle(`.${command.help.name}`)
        .setDescription(command.help.description)
        .addField('**Aliases: **', command.help.aliases.length > 0 ? command.help.aliases : 'Não possui aliases.', true)
        .addField('**Argumentos: **', command.help.args.length > 0 ? command.help.args.map(a => (a.alias ? a.name + ' | ' + a.alias : a.name) + (a.expects ? ' (' + a.expects + ')' : '')) : 'Não possui argumentos.', true)
        .setFooter('.help')
      );
    }
  }

  const files = fs.readdirSync(__dirname);

  let help = '';

  files.forEach(file => {
    const command = require(`./${file}`);

    help += `.\`\`${command.help.name}\`\`\n`;
  });

  const embed = new Discord.MessageEmbed()
    .setTitle('Diegobot')
    .setDescription('Bot para uso pessoal.')
    .addField('**Comandos: **', help, true)
    .setColor(0xFF1493)
    .setThumbnail('https://avatars2.githubusercontent.com/u/31379034?s=460&u=69f122143dde7a2a8b3d9dbfac2aa44d208b92e8&v=4')
    .setImage('https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/41/41e82d8c2716b4847af3ef01a0270462dff4b3fc_full.jpg')
    .setTimestamp();

  return msg.channel.send(embed);
};

exports.help = {
  name: 'help',
  aliases: [
    'h'
  ],
  description: 'Retorna a descrição do bot, e uma lista de comandos. Também serve para retornar a descrição de cada comando. Exemplo: \`\`.help <comando>\`\`',
  args: [{
    name: 'comando',
    expects: 'string',
    alias: ''
  }]
}