module.exports = function(bot){
    this.enable = false;
    this.loop_interval = 1000;
    this.bot = bot;
    _this = this;

    this.Start = function Start(interval){
        this.loop_interval = interval;
        this.enable = true;
        this.Tick();
    }

    this.Stop = function Stop(){
        this.enable = false;
    }

    this.ValueCheck = function ValueCheck(){
        console.log("* loop_interbal(property) = "+ this.loop_interval);
    }

    this.Tick = function Tick(){
        if(!this.enable) return;
        setTimeout(function(){_this.Tick();},this.loop_interval);
    }
}