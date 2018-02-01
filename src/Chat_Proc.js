var fs = require('fs');

module.exports = function(bot) {
    this.bot = bot;
    this.callfirst = true;

    var tps_callback = {};

    bot.on('message', function(jmes){
        try{
            var text = "";
            jmes.extra.forEach(function(v, i, a){text += v.text;});
            bot.console_out(text);
            if((m = text.match(/^\[.*?\]<(.*?)> ほりほり (.*)/)) ||
            (m = text.match(/(.*?) whispers: ほりほり (.*)/))){
                    bot.command_det(m[2]);
            }
            else if(m = text.match(/^TPS from last 1m, 5m, 15m: (.*),(.*),(.*)/)){
                tps_callback(m[1],m[2],m[3]);
                tps_callback = {};
            }
        }
        catch(e){}
    });

    //標準入力をチャットに送信する
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', function (stdin_txt){
        if(m = stdin_txt.match(/-(.*)/))  bot.command_det(m[1]);
        else    bot.chat(stdin_txt);
    });

    //現在時刻を付けて標準出力に流す
    this.bot.console_out = function console_out(text){
        now = new Date();
        header = "[" 
            + ("0" + now.getHours()).slice(-2) + ":"
            + ("0" + now.getMinutes()).slice(-2) + ":" 
            + ("0" + now.getSeconds()).slice(-2) 
            + "] ";
        console.log(header + text);
        logfile_out(header + text);
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

}