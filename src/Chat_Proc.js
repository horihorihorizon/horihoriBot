var fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

module.exports = function(bot, telegram) {
    this.bot = bot;
    this.callfirst = true;
    this.telegramParam = {
        first : true,
    }

    var tps_callback = {};
    var telbot;

    if(typeof telegram.token != "undefined"){
        telbot = new TelegramBot(telegram.token, { polling: true });
    }

    bot.on('message', function(jmes){
        try{
            var text = "";
            jmes.extra.forEach(function(v, i, a){text += v.text;});
            if((m = text.match(/^\[.*?\]<(.*?)> ほりほり (.*)/)) ||
            (m = text.match(/(.*?) whispers: ほりほり (.*)/))){
                bot.console_out(text);
                bot.command_det(m[2]);
            }
            else if(m = text.match(/^TPS from last 1m, 5m, 15m: (.*),(.*),(.*)/)){
                tps_callback(m[1],m[2],m[3]);
                tps_callback = {};
            }
            else{
                bot.console_out(text);
            }
            telegramSend(text);
        }
        catch(e){}
    });

    //標準入力をチャットに送信する
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', function (stdin_txt){
        if(m = stdin_txt.match(/-(.*)/))  bot.command_det(m[1]);
        else    bot.chat(stdin_txt);
    });

    if(telbot){
        telbot.on('message', (message) => {
            const { text } = message;
            bot.chat(text);
        });
    }

    //現在時刻を付けて標準出力に流す
    this.bot.console_out = function console_out(text){
        now = new Date();
        header = "[" 
            + ("0" + now.getHours()).slice(-2) + ":"
            + ("0" + now.getMinutes()).slice(-2) + ":" 
            + ("0" + now.getSeconds()).slice(-2) 
            + "] ";
        console.log(header + text);
        //logfile_out(header + text);
    }

    this.bot.get_tps = function get_tps(callback){
        bot.chat("/tps");
        tps_callback = callback;
    }

    function logfile_out(text){
        if(this.callfirst){
            now = new Date();
            date = "["
                + now.getFullYear() + ":"
                + ("0" + now.getMonth() + 1).slice(-2) + ":"
                + ("0" + now.getDate()).slice(-2)
                + "] ";
            fs.appendFile('../log/chat.log', " ---------- " + date + " ---------- \r\n", 'UTF-8', function(){});
            this.callfirst = false;
        }
        fs.appendFile('../log/chat.log', text + "\r\n", 'UTF-8', function(){});
    }

    function telegramSend(text){
        if(telbot){
            // ログインメッセージを転送しない
            if(this.telegramParam.first == true){
                if(text == "================") this.telegramParam.first = false;
                return;
            }
            // 不要なメッセージを転送しない
            if(m = text.match(/.*が.*ore.*を.*個発見しました/));
            else if(m = text.match(/バックアップしています/));
            else if(m = text.match(/Complete./));
            else{
                telbot.sendMessage(telegram.chatid, `${text}`);
            }
        }
    }
}