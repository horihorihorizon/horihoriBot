var mineflayer = require('mineflayer');
var Loop_Proc = require("./src/Loop_Proc");

regEventAndStart();

function regEventAndStart(){
  var bot = mineflayer.createBot({
              host: process.argv[2],
              port: process.argv[3],
              username: process.argv[4],
              password: process.argv[5]
  });

  require('./src/Chat_Proc')(bot);

  bot.on('end', function(){
    bot.console_out("[bot:end]");
    Loop_Proc1.stop;
    setTimeout(function(){regEventAndStart();},10000);
  });

  bot.on('connect', function(){
    bot.console_out("[bot:connect]");
    Loop_Proc1 = new Loop_Proc(bot);
    Loop_Proc1.Start(1000);
  });

}