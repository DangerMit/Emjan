const Discord = require("discord.js");
const client = new Discord.Client();
const { Client, Util } = require("discord.js");
const fs = require("fs");
require("./util/eventLoader")(client);
const db =require("quick.db");

client.ayarlar = { 
"token": "NzE0ODA5MDcxNjM4Njc1NTA3.Xs0D0w.N3wAqBvTCchSRMzciFkAQZwN1jo", // token
"prefix": "!", // prefix
"sahip": "389432496707600386",// sahip
}
client.en = require("./en.js");
client.tr = require("./tr.js");
client.avatarURL = `https://i.hizliresim.com/9rFGaO.png`;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  const data = require('quick.db');
  console.log('')
  console.log(`${files.length} kadar komut yüklenecek.`)
  files.forEach(async f => {
    let props = require(`./commands/${f}`);
    console.log(`Yüklendi: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
  console.log('')

});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./commands/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.permissions.has("BAN_MEMBERS")) permlvl = 2;
  if (message.member.permissions.has("ADMINISTRATOR")) permlvl = 2;
 //if (message.author.id === message.guild.owner.id) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g

client.login(client.ayarlar.token);
const moment = require('moment');
moment.locale('tr');
const { S_IFREG } = require("constants");
const data = require('quick.db');
const logs = require('discord-logs');
logs(client);
process.on('uncaughtException', function(err) { 
    console.log(err) 
}) 
client.emojiler = {
  
  x: "763460413504356362", // X İŞARETİ
  xxx: "765182807454253066", // ayarlar xi
  tik: "765182833567727636", // ayarlar tiki
  
};
client.on('ready', async () => {

 client.user.setActivity(`DangerMit Tarafından Editleniyor...`); 
  client.user.setStatus('idle');
console.log(`${client.user.username} ismiyle bağlandım.`);
})

client.on('message', async message => {
if(message.channel.type !== 'text') return;
const datas = await data.fetch(`tag.${message.guild.id}`);
if(message.content.toLowerCase().toString().includes('tag')) {
if(datas) return message.channel.send('`'+datas+'`');
};
});

client.on('message', async message => {
  var DURATION = require('humanize-duration');
const chimped = await data.fetch(client.user.id+':))');
var TIMESTAMP = Date.now() - chimped.time;
var RESULT = DURATION(TIMESTAMP, { language: 'tr', round: true, conjunction: ', ', serialComma: false });
if(message.channel.type !== 'text') return;
if(message.author.bot) return;
if(message.content.startsWith(client.ayarlar.prefix+'afk')) return;
if(message.mentions.members.first()) {
let mention = message.mentions.members.first();
const est = await data.fetch(`kullanıcı.${mention.id}.${message.guild.id}`);
if(est) {
message.channel.send(new Discord.MessageEmbed()
.setColor('RANDOM')
.setThumbnail(mention.user.avatarURL() ? mention.user.avatarURL({dynamic: true}) : 'https://cdn.glitch.com/8e70d198-9ddc-40aa-b0c6-ccb4573f14a4%2F6499d2f1c46b106eed1e25892568aa55.png')

                     
           
  .addField(`• Etiketlediğiniz Kişi ***AFK*** `,`\n**• __Sebep;__ \`${est}\`**\n ***• Afk Olma Süresi; \`${RESULT}\`***`)
   .setAuthor('FearLess Afk Sistemi ',client.avatarURL)
                     
   
);
  
}
}
const stat = await data.fetch(`name.${message.author.id}.${message.guild.id}`);
 
if(stat) {
message.member.setNickname(stat);
data.delete(`kullanıcı.${message.author.id}.${message.guild.id}`);
data.delete(`name.${message.author.id}.${message.guild.id}`);
message.channel.send(new Discord.MessageEmbed()
                     .setColor('RANDOM')
  .setDescription(`• ${message.author} **Adlı Kullanıcı Geri Geldi HojGeldin Bea <a:danstkmin:765901292593348658>**\n\n***• Afk Kalma Süresi; \`${RESULT}\`***`)
                     .setThumbnail(message.author.avatarURL() ? message.author.avatarURL({dynamic: true}) : 'https://cdn.glitch.com/8e70d198-9ddc-40aa-b0c6-ccb4573f14a4%2F6499d2f1c46b106eed1e25892568aa55.png')
 .setAuthor('FearLess Afk Sistemi ',client.avatarURL)
                     

);
}
})

client.on('userUpdate', (oldUser, newUser) => {
client.guilds.cache.forEach(async guild => {
if(!guild.members.cache.get(newUser.id)) return;
const tagFetch = await data.fetch(`roltag.${guild.id}`);
const roleFetch = await data.fetch(`tag.role.${guild.id}`);
const logFetch = await data.fetch(`tag.log.${guild.id}`);
if(!tagFetch || !roleFetch || !logFetch) return;
let tag = tagFetch;
let role = guild.roles.cache.get(roleFetch);
let log = guild.channels.cach.eget(logFetch);
if(oldUser.username === newUser.username) return;
if(newUser.username.includes(tag) && !oldUser.username.includes(tag)) {
log.send(new Discord.MessageEmbed()
.setTitle('FearLess - TAG Alındı.')
.setDescription(`${newUser} **Aramıza hoşgeldin. \`${tag}\` tagını aldığı için ${role} rolü verildi!**`));
guild.members.cache.get(newUser.id).roles.add(role.id);
}
if(oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
log.send(new Discord.MessageEmbed()
.setTitle('FearLess - TAG Çıkarıldı.')
.setColor('#f1c335')
.setDescription(`${newUser} **Aramızdan ayrıldı. \`${tag}\` tagını çıkardığı için ${role} rolü alındı!**`));
guild.members.cache.get(newUser.id).roles.remove(role.id);
}
})
})


client.on('roleDelete', async role => {
  const sistem = await data.fetch(`korumalar.${role.guild.id}`);
  if(!sistem) return;
  
  let guild = role.guild;
  const entry = await guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(audit => audit.entries.first());
  let member = entry.executor;
  
  if(member.id == guild.owner.user.id) return;
  let yetkili = guild.members.cache.get(member.id);
  yetkili.roles.cache.forEach(s => {
  if(s.permissions.has('MANAGE_ROLES')) return member.roles.remove(s.id);
  })
  });
  
  client.on('roleUpdate', async (oldRole, newRole) => {
  const sistem = await data.fetch(`korumalar.${newRole.guild.id}`);
  if(!sistem) return;
  
  let guild = newRole.guild;
  const entry = await guild.fetchAuditLogs({ type: "ROLE_UPDATE" }).then(audit => audit.entries.first());
  let member = entry.executor;
  
  if(oldRole.permissions.has('ADMINISTRATOR') && newRole.permissions.has('ADMINISTRATOR')) {
  if(member.id == guild.owner.user.id) return;
  let yetkili = guild.members.cache.get(member.id);
  yetkili.roles.cache.forEach(s => {
  if(s.permissions.has('ADMINISTRATOR')) return member.roles.remove(s.id);
  })
  }
  });
  
  client.on('guildBanAdd', async member => {
  const sistem = await data.fetch(`korumalar.${member.guild.id}`);
  if(!sistem) return;
  
  let guild = member.guild;
  const entry = await guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD" }).then(audit => audit.entries.first());
  let yetkili = entry.executor;
  
  if(yetkili.id == guild.owner.user.id) return;
  yetkili.roles.cache.forEach(s => {
  if(s.permissions.has('BAN_MEMBERS')) return yetkili.roles.remove(s.id);
  })
  guild.members.unban(member.id);
  })
  
  client.on('channelDelete', async channel => {
  const sistem = await data.fetch(`korumalar.${channel.guild.id}`);
  if(!sistem) return;
  
  let guild = channel.guild;
  const entry = await guild.fetchAuditLogs({ type: "CHANNEL_DELETE" }).then(audit => audit.entries.first());
  let member = entry.executor;
  
  if(member.id == guild.owner.user.id) return;
  let yetkili = guild.members.cache.get(member.id);
  yetkili.roles.cache.forEach(s => {
  if(s.permissions.has('MANAGE_CHANNELS')) return yetkili.roles.remove(s.id);
  })
  
  channel.clone({ name: channel.name });
  })
  
  client.on('emojiDelete', async emoji => {
  const sistem = await data.fetch(`korumalar.${emoji.guild.id}`);
  if(!sistem) return;
  
  let guild = emoji.guild;
  const entry = await guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
  let member = entry.executor;
  
  if(member.id == guild.owner.user.id) return;
  let yetkili = guild.members.cache.get(member.id);
  yetkili.roles.cache.forEach(s => {
  if(s.permissions.has('MANAGE_EMOJIS')) return yetkili.roles.remove(s.id);
  })
  
  guild.emojis.create(emoji.url, emoji.name);
  })

  client.on('guildMemberAdd', async member => {
  let user = member.user;
  let guild = member.guild;
  const sistemKanalID = await data.fetch(`sayaç.kanal.${guild.id}`);
  if(!sistemKanalID) return;
  let channel = guild.channels.cache.get(sistemKanalID);
  const sistemSayı = await data.fetch(`sayaç.sayı.${guild.id}`);
  if(!sistemSayı) return;
  let sayı = Number(sistemSayı);
  if(!sayı) return;
  let rol;
  const otoRole = await data.fetch(`oto.role.${guild.id}`);
  if(otoRole) {
  rol = `>>> **Sunucuya katılan kullanıcıya ${guild.roles.cache.get(otoRole)} rolü direk verildi!**`
  } else {
  rol = ''
  }
  if(guild.memberCount >= sayı) {
  data.delete(`sayaç.sayı.${guild.id}`);
  data.delete(`sayaç.kanal.${guild.id}`);
  channel.send(`> \`${user.tag}\` **az önce katıldı... yoksa katılmadı mı?**
  
  > **Toplam da** \`${guild.memberCount}\` **Kişi olduk! Sayaç tamamlandı! 🎉**
  
  ${rol}`)
  } else {
  channel.send(`> \`${user.tag}\` **az önce katıldı... yoksa katılmadı mı?**
  
  > **Toplam da** \`${guild.memberCount}\` **Kişi olduk!** \`${sayı}\` **Kullanıcı olmasına** \`${sayı-Number(guild.memberCount)}\` **Kullanıcı kaldı!**
  
  ${rol}`)
  }
  
})

client.on('guildMemberRemove', async member => {
  let user = member.user;
  let guild = member.guild;
  const sistemKanalID = await data.fetch(`sayaç.kanal.${guild.id}`);
  if(!sistemKanalID) return;
  let channel = guild.channels.cache.get(sistemKanalID);
  const sistemSayı = await data.fetch(`sayaç.sayı.${guild.id}`);
  if(!sistemSayı) return;
  let sayı = Number(sistemSayı);
  if(!sayı) return;
  const attachment = new Discord.MessageAttachment('https://cdn.discordapp.com/attachments/766636339361480727/766636500891729930/giphy.gif');
  channel.send(`> \`${user.tag}\` **Gittiğini fark ettim Aaaaaa!**
  
  > **Toplam da** \`${guild.memberCount}\` **Kişi olduk!** \`${sayı}\` **Kullanıcı olmasına** \`${sayı-Number(guild.memberCount)}\` **Kullanıcı kaldı!**`, attachment)
  
})


client.on('message', message => {
  if(message.channel.type !== 'text') return;
  let mesaj = message.content.toLocaleLowerCase();
if(mesaj.includes('FearLess')) message.react('🤫');
})

client.on('message', async message => {
  if(message.channel.type !== 'text') return;
  const küfür = await data.fetch(`küfür.${message.guild.id}`);
  if(!küfür) return;
  const blacklist = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "sik", "yarrak", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "amq"];
  const uyarılar = [
  'İt is Haram bRo! 🤥',
  'Az düzgün konuş günaha girme! 🤧',
  'Aaaa ayıp dostum! 🥴',
  'Vayy ahlaksız çocuk! 🙀',
  'Tövbesteyşin! 🤫'];
  let uyarımesaj = uyarılar[Math.floor(Math.random() * uyarılar.length)];
  let content = message.content.split(' ');
  
  content.forEach(kelime => {
  if(blacklist.some(küfür => küfür === kelime))  {
  if(message.member.permissions.has('BAN_MEMBERS')) return;
  message.delete();
  message.channel.send(new Discord.MessageEmbed().setTitle('Küfür Kısıtlı').setDescription(`${message.author} ${uyarımesaj}`));
  }
  })
  
  });
  
  client.on('message', async message => {
    if(message.channel.type !== 'text') return;
  const reklam = await data.fetch(`reklam.${message.guild.id}`);
  if(!reklam) return;
  const blacklist = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg"];
  const uyarılar = [
  'Kesinlikle yapma bunu okey? ♿',
  'Seni gidi çakal seni hıı! 🍌',
  'Ooo sanırım kendisini uyanık sandı? 🐍',
  'Şşş reklam kötü bir şey dostum! 🎭',
  'Haddini bil ya da çık git sunucudan! ⚰️'
  ];
  let uyarımesaj = uyarılar[Math.floor(Math.random() * uyarılar.length)];
  if(blacklist.some(a => message.content.includes(a)))  {
  if(message.member.permissions.has('BAN_MEMBERS')) return;
  message.delete();
  message.channel.send(new Discord.MessageEmbed().setTitle('Reklam Kısıtlı').setDescription(`${message.author} ${uyarımesaj}`));
  }
  
  });

client.on('message', async message => {
  if(message.channel.type !== 'text') return;
if(message.content.length >= 5) {

const caps = await data.fetch(`caps.${message.guild.id}`);
if(!caps) return;

let kontrol = message.content.toUpperCase()
if(message.content === kontrol) {

if(message.member.permissions.has('BAN_MEMBERS')) return;
if(message.mentions.users.first()) return;

return message.delete();

}}});

//selamlamalar------------------------

client.on('message', async message => {
  
if(message.channel.type !== 'text') return;
 if(message.content.toLocaleLowerCase() === 'sa') { 
  await message.react('🇦');
  await message.react('🇸');
const selamlar = await data.fetch(`selams.${message.guild.id}`);
if(!selamlar) return;
return message.channel.send(new Discord.MessageEmbed().setDescription(`Aleyküm Selam, \`${message.author.tag}\` Hoşgeldin Aslan Parçası :trident:`).setColor('RANDOM')); 
}
//--------------------------------------------------
if(message.content.toLocaleLowerCase() === 'selam') { 
  await message.react('🇦');
  await message.react('🇸');
const selamlar = await data.fetch(`selams.${message.guild.id}`);
if(!selamlar) return;
return message.channel.send(new Discord.MessageEmbed().setDescription(`Aleyküm Selam, \`${message.author.tag}\` Hoşgeldin Aslan Parçası :trident:`).setColor('RANDOM')); 
}
//--------------------------------------------------
if(message.content.toLocaleLowerCase() === 's.a') { 
  await message.react('🇦');
  await message.react('🇸');
const selamlar = await data.fetch(`selams.${message.guild.id}`);
if(!selamlar) return;
return message.channel.send(new Discord.MessageEmbed().setDescription(`Aleyküm Selam, \`${message.author.tag}\` Hoşgeldin Aslan Parçası :trident:`).setColor('RANDOM')); 
}
//--------------------------------------------------
if(message.content.toLocaleLowerCase() === 'selamun aleyküm') { 
  await message.react('🇦');
    await message.react('🇱');
    await message.react('🇪');
    await message.react('🇾');
    await message.react('🇰');
    await message.react('🇺');
    await message.react('🇲');
    await message.react('🔹');
    await message.react('🇸');
const selamlar = await data.fetch(`selams.${message.guild.id}`);
if(!selamlar) return;
return message.channel.send(new Discord.MessageEmbed().setDescription(`Aleyküm Selam, \`${message.author.tag}\` Hoşgeldin Aslan Parçası :trident:`).setColor('RANDOM')); 
}
  //--------------------------------------------------
if(message.content.toLocaleLowerCase() === 'selamün aleyküm') { 
  await message.react('🇦');
    await message.react('🇱');
    await message.react('🇪');
    await message.react('🇾');
    await message.react('🇰');
    await message.react('🇺');
    await message.react('🇲');
    await message.react('🔹');
    await message.react('🇸');
const selamlar = await data.fetch(`selams.${message.guild.id}`);
if(!selamlar) return;
return message.channel.send(new Discord.MessageEmbed().setDescription(`Aleyküm Selam, \`${message.author.tag}\` Hoşgeldin Aslan Parçası :trident:`).setColor('RANDOM')); 
}
   //--------------------------------------------------
if(message.content.toLocaleLowerCase() === 'selamın aleyküm') { 
  await message.react('🇦');
    await message.react('🇱');
    await message.react('🇪');
    await message.react('🇾');
    await message.react('🇰');
    await message.react('🇺');
    await message.react('🇲');
    await message.react('🔹');
    await message.react('🇸');
const selamlar = await data.fetch(`selams.${message.guild.id}`);
if(!selamlar) return;
return message.channel.send(new Discord.MessageEmbed().setDescription(`Aleyküm Selam, \`${message.author.tag}\` Hoşgeldin Aslan Parçası :trident:`).setColor('RANDOM')); 
}
   //--------------------------------------------------

if(message.content.toLocaleLowerCase() === 'sea') { 
    await message.react('🇦');
    await message.react('🇸');
    await message.react('🇪');
const selamlar = await data.fetch(`selams.${message.guild.id}`);
if(!selamlar) return;
return message.channel.send(new Discord.MessageEmbed().setDescription(`Aleyküm Selam, \`${message.author.tag}\` Hoşgeldin Aslan Parçası :trident:`).setColor('RANDOM')); 
}
  //--------------------------------------------------
if(message.content.toLocaleLowerCase() === 'sude') { 
    
const selamlar = await data.fetch(`selams.${message.guild.id}`);
if(!selamlar) return;
return message.channel.send(new Discord.MessageEmbed().setImage('https://thumbs.gfycat.com/GoldenMiserlyBlackmamba-small.gif').setDescription(`<@771864136887173141> Analarin Maşallahı, Erkeklerin İnşallahı :heart:`).setColor('#490606')); 
}

  
  
  



});

client.on('guildMemberAdd', async member => {
let user = member.user;
let guild = member.guild;

const systemTagData = await data.fetch(`yasaklı.tag.${guild.id}`);
const systemRoleData = await data.fetch(`yasaklı.tag.role.${guild.id}`);
if(!systemRoleData || !systemTagData) return; 

const systemTag = String(systemTagData);
const systemRole = guild.roles.cache.get(systemRoleData);

let userUsername = user.username;
if(!userUsername.includes(systemTag)) return;
member.roles.cache.forEach(role => member.roles.remove(role.id));
await member.roles.add(systemRole.id);
member.send(new Discord.MessageEmbed()
.setTitle('Yasaklı TAG Kullanıyorsun!')
.setColor('#9c5cb2')
.setDescription(`> \`${guild.name}\` *Sunucusu için yasaklı tagdasınız.*`)
.addField('• Bilgilendirme', '**Sunucu içerisinde ki yetkililere ulaşarak yasaklı tag dan cıkmanızı sağlayabilirsiniz!'));
});

client.on('guildMemberAdd', async member => {
let user = member.user;
let guild = member.guild;

const systemTagData = await data.fetch(`ototag.${guild.id}`);
const systemChannelData = await data.fetch(`ototag.log.${guild.id}`);
const systemNameData = await data.fetch(`otoisim.${guild.id}`);
if(!systemNameData) return;

let systemChannel;
if(systemChannelData) systemChannel = guild.channels.cache.get(systemChannelData);

let systemTag;
if(systemTagData) systemTag = String(systemTagData);

let replacedName;
if(systemTag) {
replacedName = systemNameData.replace('+kullanıcı', user.username).replace('+tag', systemTag);
} else {
replacedName = systemNameData.replace('+kullanıcı', user.username);
};

member.setNickname(replacedName);
if(systemChannel) systemChannel.send(`${member} giriş yaptı. Değişiklik: ${user.username} -> ${replacedName}`);
});


client.on('guildMemberAdd', async member => {
let user = member.user;
let guild = member.guild;

const systemRoleData = await data.fetch(`fake.role.${guild.id}`);
if(!systemRoleData) return;

if(user.createdAt.getTime() <= 432000000) {
member.roles.set([]);
member.roles.set([systemRoleData]);
member.user.send(new Discord.MessageEmbed()
.setTitle('Yeni Hesap Kullanıyorsun!')
.setDescription(`>>> \`${guild.name}\` __Sunucusu için, Yeni hesap olduğunuzu tespit ettim. **5 Gün** içerisinde olan hesapları cezalıya atıyorum!__`)
.addField('• Bilgilendirme', '**Sunucu içerisinde ki yetkililere bildirmelisiniz.**')
.setColor('#351742'));
};
});

client.on('message', async message => {
  if(message.channel.type !== 'text') return;
const chimped = await data.fetch(`chimped.${message.guild.id}`);
if(!chimped) return;
let command = chimped.find(a => a.command === message.content.toLocaleLowerCase());
if(command) {
message.channel.send(`${message.author} ${command.respond}`);
};
});




/*----------------OFFLİNE ETİKET--------------------
client.on('message', msg => {
    if(client.bot) return

 const user = msg.mentions.users.first();
    const ben = msg.author.username
    if(user)
      {
        let offlineetiket = db.fetch(`offline_${msg.guild.id}`)
        if(offlineetiket === 1){
        const paras = new Discord.MessageEmbed()

        .setDescription(`[Mesaja ışınlanmak için tıkla ](${msg.url})`)
        .setAuthor(`${ben} Adlı Kullanıcı, ${msg.guild.name} Sunucusunda ${msg.channel.name} Kanalında Senden Bahsetti.`, msg.author.avatarURL())
        .setColor("RANDOM")
        .setTimestamp()
        const kanalid = msg.channel.id
        const statu = user.presence.status
  if(statu === 'offline')
    {
      return user.send(paras)
      
    }

        
      } }

  });

*/
//---------------- BELİRTİLEN KANALA BELİRTİLEN SÜREDE BİR İSTATİSTİKLERİ ATAR --------------------
//--------1-------------
const os = require('os');
client.on('ready', () => {
  const moment = require("moment");
require("moment-duration-format");
 setInterval(() => {
const calismasure = moment.duration(client.uptime).format(" D [gün], H [saat], m [dakika], s [saniye]");
let botdurum = client.channels.cache.find(c => c.id === '761249654935257096')//Botun sürekli mesaj atacağı kanal.
const botistatistik = new Discord.MessageEmbed()
	.setColor('RED')
	.setTitle('⇸ Bot İstatistikleri ⇷')
.addField("» **Botun Sahibi**", "DangerMit#8794  ")
.addField("»  **Geliştirici** ","DangerMit#8794 ")
.addField(`» **RAM** :film_frames:`,`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/512mb`)
.addField(`» **Çalışma Süresi** :clock:`,`${calismasure}`)
.addField(`» **Ping** :red_circle:`,`${client.ws.ping}`)
.addField(`» **discord.js**  :writing_hand:`,`v${Discord.version}`)
.addField("» **Node.JS sürüm**", `${process.version}`, true)
.addField("» **CPU**", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
.addField("» **İşletim Sistemi**", `\`\`${os.platform()}\`\``)
.addField("» **Bit**", `\`${os.arch()}\``, true)
.addField("» **Bot Davet**", " Henüz yok")
.addField("» **Destek Sunucusu**", " Henüz Yok")
.addField("» **Voteleme sayfası**", " Henüz yok")
.setTimestamp()
botdurum.send(botistatistik);
  }, 3600000);
});



//-------------------------------BOTA YAZANLARI LOGA ATAR-----------------------------
client.on('message', msg => {
var dm = client.channels.cache.get("761249654935257096")
if(msg.channel.type === "dm") {
if(msg.author.id === client.user.id) return;
const botdm = new Discord.MessageEmbed()
.setTitle(`${client.user.username} Dm YAZANLAR :writing_hand: `)
.setTimestamp()
.setColor("RED")
.setThumbnail(`${msg.author.avatarURL()}`)
.addField(":bust_in_silhouette: Gönderen", msg.author.tag)
.addField(":id: Gönderen ID", msg.author.id)
.addField(":scroll: Gönderilen Mesaj", msg.content)
  .setFooter(`By Emre can`, `https://resimag.com/p1/3e3397b638a.png`)
dm.send(botdm)

}
if(msg.channel.bot) return;
});


//--------------------------------son üye sesli kanal gösterme-------------------

client.on('guildMemberAdd', async(member) => {
if(member.guild.id != '761249654209511475') return
const kanal = `Son Üye • ${member.user.username}`
let channel = client.channels.cache.get("761249654935257091") 
channel.setName(kanal);
});

//--------------------------------sunucuya katılana mesaj atar--------------------

//--------------------------------girdiği ve atıldığı sunucuları loga gönderir

//-------------------------------------Sunucuya eklendiğinde sunucu sahibine mesaj atar----------------------------

//----------------------------------------- COİN SİSTEMİ  ---------------------------------------
client.on('message', async (msg , bot)=> { 
if(!msg.content.startsWith("cepbank")) return;
  
 const sorted = msg.guild.members.cache.filter(u => !u.bot).array().sort((a, b) => { return (db.fetch(`para.${b.user.id + msg.guild.id}`) ? db.fetch(`para.${b.user.id + msg.guild.id}`) : 0) - (db.fetch(`para.${a.user.id + msg.guild.id}`) ? db.fetch(`para.${a.user.id + msg.guild.id}`) : 0) });
    const top10 = sorted.splice(0, 5)
     const mappedCoin = top10.filter(o => !o.bot).map(s => db.fetch(`para.${s.user.id + msg.guild.id}`) || 0)
     const mappedName = top10.filter(o => !o.bot).map(s => s.user.tag);
let kedjik = []
 for(var i = 0; i < 5; i++) {
            var coin = mappedCoin[i]
            var name = mappedName[i]

            if(coin > 0) {
              kedjik.push(`[${i + 1}] > ${name}\n  Coin: ${coin} \n\n`) 
            }

           
        }
let embed = new Discord.MessageEmbed()
.setColor('RANDOM')
.setTitle("Coin Sıralaması!")
.setDescription(kedjik)
msg.channel.send(embed)
  
  
})

//////////////////////////////////////////PARA DIZLA/////////////////


client.on('message', async (message , bot)=> { 
const db = require("quick.db")
const random = require("random");
if(message.author.bot) return;
if(message.channel.id !== "761249655362682939") return;
let max 
let min
let qwe = random.int(min = 200, max = 250)
let xd1 = db.fetch(`zamanı.${message.guild.id+message.channel.id}`)
if(!xd1) {
db.set(`zamanı.${message.guild.id+message.channel.id}`,qwe)
return;
}
db.add(`zamanı1.${message.guild.id+message.channel.id}`,1)
let xd2 =db.fetch(`zamanı1.${message.guild.id+message.channel.id}`)
if(xd1 == xd2) {


 db.delete(`zamanı.${message.guild.id+message.channel.id}`)
 db.delete(`zamanı1.${message.guild.id+message.channel.id}`)

  let i = Math.round(Math.random() * 200)
message.channel.send(`Birisi yere \`${i}TL\` Düşürdü! Dızlamak için 7 saniye içinde \`dızla\` yaz! \n`).then(() => {
	message.channel.awaitMessages(m => m.content === "dızla" , { max: 1, time: 7000, errors: ['time'] })
		.then(collected => {
			message.channel.send(`${collected.first().author} parayı aldı :moneybag:`);
            db.add(`para.${collected.first().author.id + message.guild.id}`, i)

		})
		.catch(collected => {
			message.channel.send('Kimse Zamanında Dızlayamadı Parayı Cebe Attım Za');
		});
});
}
})
//////////////////////////////////////////PARA ÇAL/////////////////

client.on('message', async (message , bot)=> { 
  
if(!message.content.startsWith("para-çal")) return;
  const ms = require('parse-ms')
  const db = require("quick.db")
  
  
  let cd = 86400000
var kisi = message.mentions.users.first()
let sure = await db.fetch(`aldi_${message.author.id + message.guild.id}`)



 if (sure !== null && cd - (Date.now() - sure) > 0) {
        let timeObj = ms(cd - (Date.now() - sure))
      message.reply(`Daha Önce Para Çaldın **${timeObj.hours} saat ${timeObj.minutes} dakika** sonra tekrar dene\n\`knk çok dikkat çekiyon kendine gel sen profeşınıl bir dızcısın\``)
    } else {

if(!kisi) return message.reply('Birini Etiketlemelisin!')
   if (kisi.bot) return message.reply("Bottan para çalacak kadar fakir misin?!")
if (db.fetch(`para.${kisi.id +  message.guild.id}`) <= '0') return message.reply("Parası Yok Bu Faqirin")
  if (message.author.id === kisi.id) return message.reply("Kendinden de Para Çalmazsın Ulan")
 if (db.has(`para.${kisi.id +  message.guild.id}`) === false) return message.reply("Bu da faqir sen fakir ben fakir onlar madırfakir")
 if (db.fetch(`para.${kisi.id + message.guild.id}`) <='500') return message.reply("Daha Yükselişte Bu Kardeşimiz Parası Az")
  
  
let i = Math.round(Math.random() * 100)
  db.subtract(`para.${kisi.id +message.guild.id}`, i)
  db.add(`para.${message.author.id + message.guild.id}`, i)
  message.reply(`\`${kisi.tag}\` Kişisinden ${i}TL Para Çaldın :moneybag:\n Günah Ulan Günah Allah is Watching...`)
      db.set(`aldi_${message.author.id + message.guild.id}`, Date.now())
    }
})

//-------------------------------------------GÜNLÜK PARA TOPLA-----------------------

client.on('message', async (message , bot)=> { 
  
if(!message.content.startsWith("bonus-topla")) return;
  const ms = require('parse-ms')
  const db = require("quick.db")
  
  
  let cd = 86400000

let sure = await db.fetch(`bonusaldi_${message.author.id + message.guild.id}`)



 if (sure !== null && cd - (Date.now() - sure) > 0) {
        let timeObj = ms(cd - (Date.now() - sure))
      message.reply(`Daha Önce Günlük Bonus Topladın Aç Gözlü Olma. **${timeObj.hours} saat ${timeObj.minutes} dakika** Sonra Tekrar Dene!`)
    } else{
      
      
      
       db.add(`para.${message.author.id + message.guild.id}`, 200)
  message.reply("Günlük `200TL` :moneybag: Bonusunu Topladın Tebriks ")
      db.set(`bonusaldi_${message.author.id + message.guild.id}`, Date.now())
    }

})

//------------------------------------FOTO KAYDET(DEVAMI RESİMLER.JS) -------------------------------------

client.on('message', async message => {
  
  if(message.channel.type === 'dm') return;
  if(message.attachments.size < 0) return;
  
    function extension(attachment) {
    let imageLink = attachment.split('.');
    let typeOfImage = imageLink[imageLink.length - 1];
    let image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return '';
    return attachment;
}
    let image = message.attachments.size > 0 ? await extension(message.attachments.array()[0].url) : null;
    if(!image) return;
console.log(message.attachments.size)
  
    data.push(`linkler.${message.guild.id}.${message.author.id}`, {imagee: image})
  
  
})



//------------------------------------FAKE KATIL-------------------------------------
client.on('message', async message => {
if (message.content === 'fakekatıl') { 
  client.emit('guildMemberAdd', message.member || await message.guild.members.fetch(message.author));
    }
});

//------------------------------------FAKE AYRIL-------------------------------------
client.on('message', async message => {
if (message.content === 'fakeayrıl') { 
  client.emit('guildMemberRemove', message.member || await message.guild.members.fetch(message.author));
    }
});

//-------------------------------------DESTEK TALEBİ------------------------------------

client.on("message", async msg => {
  if (!msg.guild) return;

  let prefix =
    (await db.fetch(`prefix_${msg.guild.id}`)) || client.ayarlar.prefix;

  if (!msg.guild.channels.cache.get(db.fetch(`destekK_${msg.guild.id}`))) return;
  var s = "tr";
  var r = "Destek Ekibi";
  var k = "destek-kanalı";
  if (db.has(`dil_${msg.guild.id}`) === true) {
    var s = "en";
    var r = "Support Team";
    var k = "support-channel";
  }
  const dil = s;

  let rol = "";
  let kanal = "";

  if (db.has(`destekK_${msg.guild.id}`) === true) {
    kanal = msg.guild.channels.cache.get(db.fetch(`destekK_${msg.guild.id}`)).name;
  }

  if (db.has(`destekK_${msg.guild.id}`) === false) {
    kanal = k;
  }

  if (db.has(`destekR_${msg.guild.id}`) === true) {
    rol = msg.guild.roles.cache.get(db.fetch(`destekR_${msg.guild.id}`));
  }

  if (db.has(`destekR_${msg.guild.id}`) === false) {
    rol = r;
  }

  const reason = msg.content
    .split(" ")
    .slice(1)
    .join(" ");
  if (msg.channel.name == kanal) {
    if (msg.author.bot) return;
    /*if (!msg.guild.roles.cache.some("name", rol)) return msg.reply(client[dil].desteksistem.rolyok.replace("{rol}", r)).then(m2 => {
            m2.delete(5000)});*/
    if (
      msg.guild.channels.cache.find(
        c =>
          c.name ===
          `${client[dil].desteksistem.talep}-${msg.author.discriminator}`
      )
    ) {
      msg.author.send(
        client[dil].desteksistem.aciktalepozel
          .replace("{kisi}", msg.author.tag)
          .replace(
            "{kanal}",
            `${msg.guild.channels.cache.get(
              msg.guild.channels.cache.find(
                c =>
                  c.name ===
                  `${client[dil].desteksistem.talep}-${msg.author.discriminator}`
              ).id
            )}`
          )
      );
      msg.guild.channels
        .find(
          c =>
            c.name ===
            `${client[dil].desteksistem.talep}-${msg.author.discriminator}`
        )
        .send(
          client[dil].desteksistem.aciktalep
            .replace("{kisi}", msg.author.tag)
            .replace("{sebep}", msg.content)
        );

      msg.delete();
      return;
    }
    if (
      msg.guild.channels.cache.find(c => c.name === client[dil].desteksistem.kategori)
    ) {
      msg.guild
        .channels.create(
          `${client[dil].desteksistem.talep}-${msg.author.discriminator}`,
          "text"
        )
        .then(c => {
          const category = msg.guild.channels.cache.find(
            c => c.name === client[dil].desteksistem.kategori
          );
          c.setParent(category.id);
          let role = msg.guild.roles.cache.find(r => r.name === rol.name);
          let role2 = msg.guild.roles.cache.find(r => r.name === "@everyone");
          c.createOverwrite(role, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
          });
          c.createOverwrite(role2, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
          });
          c.createOverwrite(msg.author, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
          });

          const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(
              `${client.user.username} | Destek Sistemi`,
              client.user.avatarURL()
            )
            .setTitle(`_Merhaba ${msg.author.username}!_`)
            .addField(
              `» Destek Talebi Hakkında Bilgilendirme «`,
              `Yetkililerimiz en yakın zamanda burada sorunun ile ilgilenecektir! \nDestek talebini kapatmak için \`${prefix}talep-kapat\` yazabilirsiniz`
            )
            .addField(`» Destek Talebi Sebebi «`, `${msg.content}`, true)
            .addField(
              `» Destek Talebini Açan Kullanıcı «`,
              `<@${msg.author.id}>`,
              true
            )
            .setFooter(
              `${msg.guild.name} adlı sunucu ${client.user.username} Destek Sistemi'ni kullanıyor teşekkürler!`,
              msg.guild.iconURL()
            );
          c.send({ embed: embed });
          c.send(
            `** @here | 📞Destek Talebi! ** \n**${msg.author.tag}** adlı kullanıcı \`${msg.content}\` sebebi ile Destek Talebi açtı!`
          );
          msg.delete();
        })
        .catch(console.error);
    }
  }
  if (msg.channel.name == kanal) {
    if (
      !msg.guild.channels.cache.find(
        c => c.name === client[dil].desteksistem.kategori
      )
    ) {
      msg.guild
        .channels.create(client[dil].desteksistem.kategori, "category")
        .then(category => {
          category.setPosition(1);
          let every = msg.guild.roles.cache.find(c => c.name === "@everyone");
          category.createOverwrite(every, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: false
          });
          msg.guild
            .channels.create(
              `${client[dil].desteksistem.talep}-${msg.author.discriminator}`,
              "text"
            )
            .then(c => {
              c.setParent(category.id);
              let role = msg.guild.roles.cache.find(c => c.name === rol.name);
              let role2 = msg.guild.roles.cache.find(c => c.name === "@everyone");
              c.createOverwrite(role, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
              });
              c.createOverwrite(role2, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
              });
              c.createOverwrite(msg.author, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
              });

              const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(
                  `${client.user.username} | Destek Sistemi`,
                  client.user.avatarURL()
                )
                .setTitle(`_Merhaba ${msg.author.username}!_`)
                .addField(
                  `» Destek Talebi Hakkında Bilgilendirme «`,
                  `Yetkililerimiz en yakın zamanda burada sorunun ile ilgilenecektir! \nDestek talebini kapatmak için \`${prefix}talep-kapat\` yazabilirsiniz`
                )
                .addField(`» Destek Talebi Sebebi «`, `${msg.content}`, true)
                .addField(
                  `» Destek Talebini Açan Kullanıcı «`,
                  `<@${msg.author.id}>`,
                  true
                )
                .setFooter(
                  `${msg.guild.name} adlı sunucu ${client.user.username} Destek Sistemi'ni kullanıyor teşekkürler!`,
                  msg.guild.iconURL()
                );
              c.send({ embed: embed });
              c.send(
                `** @here | 📞Destek Talebi! ** \n**${msg.author.tag}** adlı kullanıcı \`${msg.content}\` sebebi ile Destek Talebi açtı!`
              );
              msg.delete();
            })
            .catch(console.error);
        });
    }
  }
});

client.on("message", async message => {
  
      if (db.has(`destekK_${message.guild.id}`) === false)
    return;

  if (!message.guild) return;

  let prefix =
    (await db.fetch(`prefix_${message.guild.id}`)) || client.ayarlar.prefix;

  var s = "tr";
  var r = "Destek Ekibi";
  if (db.has(`dil_${message.guild.id}`) === true) {
    var s = "en";
    var r = "Support Team";
  }
  const dil = s;

  if (message.content.toLowerCase().startsWith(prefix + `talep-kapat`)) {
    if (!message.channel.name.startsWith(`${client[dil].desteksistem.talep}-`))
      return message.channel.send(
        `Bu komut sadece Destek Talebi kanallarında kullanılabilir.`
      );

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`Destek Talebi Kapatma İşlemi!`)
      .setDescription(
        `Destek talebini kapatma işlemini onaylamak için, \n10 saniye içinde \`evet\` yazınız.`
      )
      .setFooter(
        `${client.user.username} | Destek Sistemi`,
        client.user.avatarURL
      );
    message.channel.send({ embed }).then(m => {
      message.channel
        .awaitMessages(response => response.content === "evet", {
          max: 1,
          time: 10000,
          errors: ["time"]
        })
        .then(collected => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit("Destek talebi kapatma isteği zaman aşımına uğradı.").then(
            m2 => {
              m2.delete();
            },
            3000
          );
        });
    });
  }
});

//-------------------------------Girdiği Sunucuya Kanal Açar
client.on("guildCreate", async guild => {
let yardım = guild.channels.create('FearLess', { type: 'text', permissionOverwrites: [], reason: '!yardım Yazarak Yardım Alabilirsiniz' });
await yardım.send("!yardım")
})





//----------------------------------------BELİRTİLEN KANALA LİKE DİSSLİKE EKLER
client.on('message', async (msg) => {
      if (msg.channel.id !== "813183235047161876") return;
await msg. react('👍')
await msg. react('👎')
 
 
});
 


//----------------------------------------BELİRTİLEN KANALA LİKE DİSSLİKE EKLER
client.on('message', async (msg) => {
      if (msg.channel.id !== "813860905636331531") return;
await msg. react('👍')
await msg. react('👎')
 
 
});




