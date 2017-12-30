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

  bot.on('message', function(jmes){
    try{
      var text = "";
      jmes.extra.forEach(function(v, i, a){text += v.text;});
      console_out(text);
    }
    catch(e){}
  });

  bot.on('end', function(){
    console_out("[bot:end]");
    Loop_Proc1.stop;
    setTimeout(function(){regEventAndStart();},10000);
  });

  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', function (stdin_txt){
    bot.chat(stdin_txt);
  });

  bot.on('connect', function(){
    console_out("[bot:connect]");
    Loop_Proc1 = new Loop_Proc(bot);
    Loop_Proc1.Start(1000);
  });

}

function console_out(text){
  now = new Date();
  header = "[" 
         + ("0" + now.getHours()).slice(-2) + ":"
         + ("0" + now.getMinutes()).slice(-2) + ":" 
         + ("0" + now.getSeconds()).slice(-2) 
         + "] ";
  console.log(header + text);
}