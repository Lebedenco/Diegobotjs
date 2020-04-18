const { DMChannel, Client, MessageEmbed, MessageAttachment } = require('discord.js');
const dotenv = require('dotenv').config();
const Jikan = require('jikan-node');
const cron = require('node-cron');
const Danbooru = require('danbooru');
const axios = require('axios');

const mcServerCheck = require('./mcServerCheck');
const canvas = require('./canvas');

const booru = new Danbooru();
const mal = new Jikan();
const client = new Client();

const token = process.env.TOKEN;
const mcServerIP = process.env.IP;
const mcServerPort = process.env.PORT;
const craftoApi = process.env.CRAFTOAPIKEY;
const diegoId = process.env.DIEGOID;
const memeChannelID = process.env.MEMECHANNELID;
const botId = process.env.DIEGOBOTID;

let status = 'Iniciando Ping...';
let mcServerMOTD = 'N/A';
let mcServerVersion = 0;
let mcServerPlayersOnline = 0;
let mcServerMaxPlayers = 0;

const showError = (error) => {
  let err = 'Error!';

  if (error === 'Response: 400' || error === 400) {
    err = 'Requisição inválida.';
  } else if (error === 'Response: 404' || error === 404) {
    err = 'Conteúdo não encontrado.';
  } else if (error === 'not nsfw') {
    err = 'Este comando só pode ser usado em um canal NSFW!';
  } else if (error === 'not permission') {
    err = 'Você não tem acesso à este comando!';
  } else {
    err = 'Erro!';
  }

  const embed = new MessageEmbed()
    .setTitle(`Erro!`)
    .setDescription(err)
    .setColor(0xff0000);

  return embed;
};

const sendMondayMeme = () => {
  client.channels.fetch(memeChannelID)
    .then(channel => channel.send('https://www.youtube.com/watch?v=9R4MtYRk6bA'));
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  
  return Math.floor(Math.random() * (max - min)) + min;
}

client.on('ready', () => {
  console.log('Iniciando...');

  setInterval(() => {
    mcServerCheck.start(mcServerPort, mcServerIP, (res) => {
      if (mcServerCheck.isOnline) {
        status = `Status do Servidor: Online!`;
        mcServerPlayersOnline = mcServerCheck.mcServerCurPlayers;
        mcServerMaxPlayers = mcServerCheck.mcServerMaxPlayers;
        mcServerVersion = mcServerCheck.mcServerVersion;
        mcServerMOTD = mcServerCheck.mcServerMOTD;
      } else {
        status = `Status do Servidor: Offline!`;
      }
    })
    client.user.setActivity(`${status} ${mcServerPlayersOnline}/${mcServerMaxPlayers} jogadores online.`, {
      type: 0
    })
  }, 5000);

  // Minute(0-59) Hour(0-24) Day(1-31) Month(1-12) DayOfTheWeek(0-6)
  cron.schedule('0 8 * * 1', sendMondayMeme);
});

client.on('message', async (msg) => {
  if (msg.channel instanceof DMChannel && msg.author.id !== botId) {
    const diego = client.users.cache.get(diegoId);

    diego.send(`${msg.author}: ${msg.content}`);
  }

  if (msg.content === '.ip') {
    if (msg.member.roles.cache.find(r => r.name === 'Minecraft')) {
      msg.author.send(`IP do servidor de Minecraft com Mods! ${process.env.IP}`);
    } else {
      msg.channel.send(showError('not permission'));
    }
  }

  if (msg.content.startsWith('.mal')) {
    const user = msg.content.split(' ')[1];

    mal.findUser(user)
      .then((res) => {
        const embed = new MessageEmbed()
          .setTitle(`MyAnimeList de ${user}`)
          .setColor(0xffc0cb)
          .setDescription(`Last online: ${res.last_online}`)
          .addField(`Days`, res.anime_stats.days_watched, true, true)
          .addField(`Watching`, res.anime_stats.watching, true, true)
          .addField(`Completed`, res.anime_stats.completed, true, true)
          .addField(`On hold`, res.anime_stats.on_hold, true, true)
          .addField(`Dropped`, res.anime_stats.dropped, true, true)
          .addField(`Plan to Watch`, res.anime_stats.plan_to_watch, true, true)
          .addField(`Episodes Watched`, res.anime_stats.episodes_watched, true, true)
          .setThumbnail(res.image_url);

        msg.channel.send(embed);
      })
      .catch(err => msg.channel.send(showError(err)));
  }

  if (msg.content === '.statusServidor') {
    let color = 0x00FF00;

    if (status === 'Status do Servidor: Offline!') {
      color = 0xff0000;
    } else if (status === 'Iniciando Ping...') {
      color = 0xFFFF00;
    }

    const embed = new MessageEmbed()
      .setTitle('Diegocraft | The 1.12.2 Pack')
      .setColor(color)
      .setDescription(status)
      .setThumbnail('https://avatars2.githubusercontent.com/u/31379034?s=460&u=69f122143dde7a2a8b3d9dbfac2aa44d208b92e8&v=4')
      .addField('Players', `${mcServerPlayersOnline}/${mcServerMaxPlayers}`, true)
      .addField('Versão', mcServerVersion, true)
      .addField('MOTD', mcServerMOTD, true);

      msg.channel.send(embed);
  }

  if (msg.content === '.queEngracado') {
    const attachment = new MessageAttachment(__dirname + '/media/backdoor.mp4');

    msg.channel.send(attachment);
  }

  if (msg.content.startsWith('.correioAnonimo')) {
    const content = msg.content.split('|');
    
    let target = content[1];

    if (target.startsWith(' <')) {
      target = target.slice(2, -2);
    }

    if (target.startsWith('<')) {
      target = target.slice(2, -1);
    }

    if (target.startsWith('@')) {
      target = target.slice(1)
    }
    
    if (target.startsWith('!')) {
      target = target.slice(1);
    }

    const message = content[2];

    console.log(target)

    const user = client.users.cache.get(target);

    console.log(user)

    user.send(`"${message}"`);
  }

  if (msg.content.startsWith('.danbooru')) {
    const posts = await booru.posts({
      tags: `${msg.content.split(' ')[1]} rating:safe`
    })
      .then(posts => {
        const index = Math.floor(Math.random() * posts.length)
        const post = posts[index]

        if (post !== undefined) {
          msg.channel.send(post.large_file_url);
        } else {
          msg.channel.send(showError(404));
        }
      })
  }

  if (msg.content.startsWith('.18danbooru') && msg.channel.nsfw) {
    const posts = await booru.posts({
        tags: `${msg.content.split(' ')[1]} rating:explicit`
      })
      .then(posts => {
        const index = Math.floor(Math.random() * posts.length)
        const post = posts[index]

        if (post !== undefined) {
          msg.channel.send(post.large_file_url);
        } else {
          msg.channel.send(showError(404));
        }
      })
      .catch(err => msg.channel.send(showError(err)));
  }

  if (msg.content.startsWith('.18danbooru') && !msg.channel.nsfw) {
    msg.channel.send(showError('not nsfw'));
  }

  if (msg.content.startsWith('.crafting')) {
    const request = msg.content.split(' ')[1];
    
    if (request === undefined) {
      msg.channel.send(showError('Response: 400'));
      
      return;
    }

    const version = request.split(':')[0];
    const itemName = request.split(':')[1];

    if (version === undefined || itemName === undefined) {
      msg.channel.send(showError('Response: 404'));
      
      return;
    }

    axios.get(`https://craftoapi.herokuapp.com/crafting/${version}/${itemName}`)
      .then(async (req) => {
        if (req.data.status === 200) {
          let image = [];

          for(let i = 0 ; i < req.data.crafting.length ; i++) {
            if (req.data.crafting[i] === 'minecraft:planks') {
              image.push(__dirname + '/media/planks.png');
            } else if (req.data.crafting[i] === 'minecraft:iron_ingot') {
              image.push(__dirname + '/media/iron_ingot.png');
            } else if(req.data.crafting[i] === 'minecraft:stick') {
              image.push(__dirname + '/media/stick.png');
            } else if(req.data.crafting[i] === 'minecraft:cobblestone') {
              image.push(__dirname + '/media/cobblestone.png');
            } else {
              image.push(__dirname + '/media/nothing.png');
            }
          }
           
          const img = await canvas.start(image);
          const attachment = new MessageAttachment(img, 'crafting.png');

          msg.channel.send(new MessageEmbed()
            .setTitle(`Crafting de ${itemName[0].toUpperCase()}${itemName.substring(1)}`)
            .attachFiles([attachment])
            .setImage('attachment://crafting.png')
          );

        } else if (req.data.status === 500) {
          msg.channel.send(showError(500));
        } else {
          msg.channel.send(showError('error'));
          console.log(req.status);
        }
      });
  }

  if (msg.content.startsWith('.addCrafting') && msg.member.id === diegoId) {
    const item = msg.content.split(' ')[1];
    const crafting = msg.content.split(' ')[2];

    const version = item.split(':')[0];
    const name = item.split(':')[1];

    axios.post(`https://craftoapi.herokuapp.com/crafting/`, {
      version,
      name,
      crafting,
      auth: craftoApi
    })
      .then((res) => {
        res.data.status === 200 ? msg.channel.send('Crafting adicionado com sucesso!') : msg.channel.send(showError(res.data.status));
      })
      .catch(err => {
        msg.channel.send(showError(err.data.status));
      });
  }

  if (msg.content === '.github') {
    msg.channel.send('https://github.com/Lebedenco/Diegobotjs');
  }

  if (msg.content === '.help') {
    const embed = new MessageEmbed()
      .setTitle('Diegobot')
      .setDescription('Bot para uso pessoal.')
      .addField('**Comandos: **', '``.statusServidor``\n``.ip``\n``.crafting [versão:nome_do_item]``\n``.mal [usuário]``\n``.queEngracado``\n``.danbooru [tag]``\n``.18danbooru [tag]``\n``.correioAnonimo|[menção/ID do usuário]|[Mensagem] (WIP)``\n``.github``', true)
      .setColor(0xFF1493)
      .setThumbnail('https://avatars2.githubusercontent.com/u/31379034?s=460&u=69f122143dde7a2a8b3d9dbfac2aa44d208b92e8&v=4')
      .setImage('https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/41/41e82d8c2716b4847af3ef01a0270462dff4b3fc_full.jpg')
      .setTimestamp();

    msg.channel.send(embed);
  }
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'geral');

  if (!channel) return;

  channel.send(`Olá ${member}! Seja bem-vindo ao ${channel.guild.name}`);
});

client.login(token);