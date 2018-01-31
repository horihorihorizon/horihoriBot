module.exports = function(bot) {
    this.bot = bot;

    //コマンド解析
    this.bot.command_det = function command_det(text){
        command = text.split(" ");
        if(command[0]=="yaw"){
            pitch = bot.entity.pitch;
            yaw = command[1] / 180 * Math.PI;
            bot.look(yaw, pitch, false, false);
        }
        else if(command[0]=="pitch"){
            yaw = bot.entity.yaw;
            pitch = command[1] / 180 * Math.PI;
            bot.look(yaw, pitch, false, false);
        } 
        else if(command[0]=="forward"){
            bot.setControlState("forward",true);
            setTimeout(function(){bot.setControlState("forward", false);},command[1]);
        }
    }

}