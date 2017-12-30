module.exports = function(bot) {
    this.bot = bot;

    bot.on('message', function(jmes){
        try{
        var text = "";
        jmes.extra.forEach(function(v, i, a){text += v.text;});
        bot.console_out(text);
        }
        catch(e){}
    });

    //標準入力をチャットに送信する
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', function (stdin_txt){
        bot.chat(stdin_txt);
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
    }

}