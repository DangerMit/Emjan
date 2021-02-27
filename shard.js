const {ShardingManager} = require("discord.js"); 
const config = require("./ayarlar.json");  
const shards = new ShardingManager("./emjan.js", { 
token: "NzE0ODA5MDcxNjM4Njc1NTA3.Xs0D0w.N3wAqBvTCchSRMzciFkAQZwN1jo", 
totalShards: "auto" 
});   
shards.on("shardCreate", shard => { 
console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Başlatılan #${shard.id} Numara`); 
});   
shards.spawn(shards.totalShards, 10000);





