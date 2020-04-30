const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = async (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.crafting')
      .setDescription('Retorna a receita de crafting de um dado item. Ex: crafting stone_pickaxe -> Retornará a receita de crafting da Picareta de Pedra.' +
        '\nSe não for informado um argumento, será retornada uma lista com todos os itens registrados.')
      .addField('**Aliases**', '``craft``', true)
      .addField('**Argumentos**', '``nomeDoItem (string)``', true)
      .setFooter('.help')
    );
  }

  const canvas = require('../utils/canvas');
  const axios = require('axios');
  const request = msg.content.split(' ')[1];

  let flag = false;

  const enviarItens = (restantes, restantesFlag, itens, pagina) => {
    this.restantes = restantes,
      this.restantesFlag = restantesFlag;
    this.pagina = pagina;

    let items = '';

    for (let i = restantes; i < itens.length; i++) {
      if (items.length + itens[i].name.length < 1024 && items.length < 1024) {
        items += itens[i].name + '\n';
        restantesFlag = false;
      } else {
        restantesFlag = true;
        restantes = i;
        break;
      }
    }

    items = items.split('\n');
    items = items.filter(item => item !== '');
    
    msg.channel.send(new Discord.MessageEmbed()
      .setTitle(`[Página ${pagina}]\nItens registrados: `)
      .addFields(items.map(item => {
        return {
          name: 'Item',
          value: `\`\`${item}\`\``,
          inline: true
        }
      }))
    );

    if (restantesFlag) {
      enviarItens(restantes, restantesFlag, itens, ++pagina);
    }
  }

  if (!request) {
    await axios.get('http://localhost:3333/crafting/')
      .then(async (req) => {
        if (req.data.status === 200) {
          flag = true;

          enviarItens(0, false, req.data.items, 1);
        }
      })
      .catch(err => msg.channel.send(utils.showError(err)));
  }

  if (flag) {
    return flag;
  }

  const itemName = request;

  if (!itemName) {
    msg.channel.send(utils.showError(400));

    return;
  }

  axios.get(`http://localhost:3333/crafting/${itemName}`)
    .then(async (req) => {
      if (req.data.status === 200) {
        if (req.data.crafting.length > 0) {
          for (let i = 0; i < req.data.crafting.length; i++) {
            const image = await canvas.load(req.data.craftingImages[i]);
            const attachment = new Discord.MessageAttachment(image, 'crafting.png');

            const embed = new Discord.MessageEmbed()
              .setTitle(`Crafting de ${req.data.itemName}`)
              .attachFiles(attachment)
              .setImage('attachment://crafting.png')
              .setFooter(req.data.crafting[i].mod)
              .setThumbnail(req.data.itemImage);

            msg.channel.send(embed);
          }
        }
      } else if (req.data.status === 400) {
        msg.channel.send(utils.showError(400));
      } else {
        msg.channel.send(utils.showError(req.status));
      }
    });
};

exports.help = {
  name: 'crafting',
  aliases: [
    'craft'
  ],
  description: 'Retorna a receita de crafting de um dado item. Ex: crafting stone_pickaxe -> Retornará a receita de crafting da Picareta de Pedra.' +
    '\nSe não for informado um argumento, será retornada uma lista com todos os itens registrados.',
  args: [{
    name: 'nomeDoItem',
    expects: 'string',
    alias: ''
  }]
}