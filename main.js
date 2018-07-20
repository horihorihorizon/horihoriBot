var mineflayer = require('mineflayer');
var Loop_Proc = require("./src/Loop_Proc");
var TelegramBot = require('node-telegram-bot-api');
var Vec3 = require('vec3').Vec3;

regTelegram();
regEventAndStart();

function regEventAndStart(){
  var bot = mineflayer.createBot({
              host: process.argv[2],
              port: process.argv[3],
              username: process.argv[4],
              password: process.argv[5]
  });
  var username = process.argv[6];

  require('./src/Chat_Proc')(bot, telbot);
  require('./src/Command')(bot);
//  require('./src/VillageMonitor')(bot);

  bot.on('end', function(){
    bot.console_out("[bot:end]");
//    Loop_Proc1.stop;
    setTimeout(function(){regEventAndStart();},10000);
  });

  bot.on('connect', function(){
    bot.console_out("[bot:connect]");
//    Loop_Proc1 = new Loop_Proc(bot);
//    Loop_Proc1.Start(1000);
//    bot.VillageMonitor.init(username);
  });

  bot.on('entityMoved', function(entity){
//    if(entity.type=="mob")  bot.VillageMonitor.EntityCheck(entity);
      if(entity.type == "player"){
        var dst = bot.entity.position.distanceTo(entity.position);
        if(dst < 0.8){
          var mypos = new Vec3(bot.entity.position.x, 0, bot.entity.position.z);
          var yourpos = new Vec3(entity.position.x, 0, entity.position.z);
          mypos.subtract(yourpos);
          mypos = mypos.scaled(60);
          bot.entity.velocity.add(mypos);
        }
      }
  });

  bot.on('entitySpawn', function(entity){
 //   if(entity.type=="mob")  bot.VillageMonitor.SpawnCounter(entity);
  });
}

var telbot;
function regTelegram(){
 
  var telegram = {
    token:  process.argv[7],
    chatid: process.argv[8],
    enable: false,
    callfirst: true
  }

  if(typeof telegram.token != "undefined"){
    telegram.enable = true;
    telbot = new TelegramBot(telegram.token, { polling: true });
  

  telbot.sendMcChat = function sendMcChat(text){

    if(telegram.enable){
      // ログインメッセージを転送しない
      if(telegram.callfirst == true){
          if(text == "================") telegram.callfirst = false;
          return;
      }

      // 不要なメッセージを転送しない
      if(m = text.match(/.*が.*ore.*を.*個発見しました/));
      else if(m = text.match(/バックアップしています/));
      else if(m = text.match(/Complete./));
      else if(m = text.match(/\[Japanize].*/));
      else{
          telbot.sendMessage(telegram.chatid, `${text}`);
      }
    }
  }

  }
  
  if(telegram.enable){
    telbot.on('message', (message) => {
        const { text } = message;
        bot.chat(text);
    });
  }
}