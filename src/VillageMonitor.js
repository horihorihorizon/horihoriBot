var fs = require('fs');

module.exports = function(bot) {
    this.bot.VillageMonitor = bot;
    var username = "noname";
    var Villager = {};
    var IronGolem = {};
    var StartDate = {};
    var nowtps = 20;

    const SENS_DIST = 30;   // mobの数を数える最大範囲
    const DELETE_TIME = 10; // 動かないmobを除外するまでの時間

    this.bot.VillageMonitor.init = function EntityCheck(name){
        if(name != "")  username = name;
        StartDate = new Date();
        logfile_out();
        tps_update(true);
    }

    // 一定範囲でゴーレムがスポーン時に、その時の村人の数やTPSと一緒に記録
    this.bot.VillageMonitor.SpawnCounter = function SpawnCounter(entity){
        var dist = bot.entity.position.distanceTo(entity.position);
        if (dist < SENS_DIST){
            if (entity.mobType=="Iron golem"){
                IronGolem[Object.keys(IronGolem).length] = new Date();
                IronGolem[Object.keys(IronGolem).length-1].villagerNom = Object.keys(Villager).length;
                IronGolem[Object.keys(IronGolem).length-1].tps = nowtps;
                logfile_out("Spawn");
            }
        }
    }

    // 村人の人数判定用
    this.bot.VillageMonitor.EntityCheck = function EntityCheck(entity){
        var dist = bot.entity.position.distanceTo(entity.position);
        // 一定範囲の村人の数を数える
        if (dist < SENS_DIST){
            if      (entity.mobType=="Villager")    Villager[entity.id] = new Date();
            else                                    return;    
        }
        
        // 一定時間以上、範囲内で動かない村人はカウントから除外
        var now = new Date();
        for(var key in Villager){
            if(Villager[key].getTime() < (now.getTime()-DELETE_TIME*1000))
            delete Villager[key];
        }
    }

    // ほりほり 生産状況 コマンドの処理
    this.bot.VillageMonitor.Report = function Report(){
        var now = new Date();
        var Golem_1h_Cnt = 0;
        var tick_per_spawn = 0;
        var i = 0;
        for(var key in IronGolem){
            if(IronGolem[key].getTime() > (now.getTime()-60*60*1000)) Golem_1h_Cnt++;
            if(i==0){
                tick_per_spawn += (IronGolem[key].getTime() - StartDate.getTime()) / 1000 * IronGolem[key].tps;
            }
            else{
                tick_per_spawn += (IronGolem[key].getTime() - IronGolem[key-1].getTime()) / 1000 * IronGolem[key].tps;
            }
            i++;
        }
        tick_per_spawn = Math.round(tick_per_spawn / Object.keys(IronGolem).length);
        var Time_Sum = now.getTime() - StartDate.getTime();
        Time_Sum = Math.round(Time_Sum / (60*60*10)) / 100
        var Villager_Number = Object.keys(Villager).length
        var IronGolem_Number = Object.keys(IronGolem).length

        //bot.chat("ゴーレムSpawn数："+ Golem_1h_Cnt +"体/直近1h、"+IronGolem_Number+"体/積算"+Time_Sum+"h、1Tick平均：1/"+ tick_per_spawn +"体、村人生存数：" + Villager_Number);
        bot.chat("ゴーレムSpawn数："+ Golem_1h_Cnt +"体/直近1h、"+IronGolem_Number+"体/積算"+Time_Sum+"h、村人生存数：" + Villager_Number);
        setTimeout(function(){report_out();},300);
    }

    function report_out(){
        try {
            var readdata = fs.readFileSync("../chat_template/chat_"+username+".txt", 'UTF-8');
        }
        catch(err){
            return;
        }
        if(readdata!="") bot.chat(readdata);
    }

    // CSVに出力する
    function logfile_out(type){
        var filename = "../log/"+username+"_monitorlog.csv";
        const format = "time,Spawned,Villager,tps";

        //ファイルが無いときは新しいのを作る
        try {
            fs.statSync(filename);
        }
        catch(err) {
            if(err.code === 'ENOENT')   fs.appendFile(filename, format + "\r\n", 'UTF-8', function(){});
        }

        //スポーン情報の記録
        if(type=="Spawn"){
            var lastest_spawn_golem = IronGolem[Object.keys(IronGolem).length-1];
            var time =  
                    (lastest_spawn_golem.getYear() + 1900) + "/"
                    + (lastest_spawn_golem.getMonth() + 1) + "/"
                    + lastest_spawn_golem.getDate() + " "
                    + ("0" + lastest_spawn_golem.getHours()).slice(-2) + ":" 
                    + ("0" + lastest_spawn_golem.getMinutes()).slice(-2) + ":" 
                    + ("0" + lastest_spawn_golem.getSeconds()).slice(-2); 
            fs.appendFile(filename, time + ",1," + lastest_spawn_golem.villagerNom + "," + lastest_spawn_golem.tps + "\r\n", 'UTF-8', function(){});             
        }
    }

    function tps_update(enable){
        if(enable){
            setTimeout(function(){
                bot.get_tps(function(tps1m,tps5m,tps15m){
                    nowtps = tps1m;
                });
            },5000);
            var func = setInterval(function(){
                bot.get_tps(function(tps1m,tps5m,tps15m){
                    nowtps = tps1m;
                });
            },60000);
        }
        else{
            clearInterval(func);
        }
    }

}