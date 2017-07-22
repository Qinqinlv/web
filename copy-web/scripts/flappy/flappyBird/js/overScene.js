(function(win) {
    //这个是游戏结束的场景。
    //也就是当游戏结束后，这个场景展示到canvas画布中的画面


    function Scene(option) {

        // 这个option表示的是canvas的执行上下文
        this.ctx = option;
    }

    Scene.prototype.render = function(costTime) {
        var ctx = this.ctx;

        ctx.fillStyle = 'rgba( 100, 100, 100, 0.8 )';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'red';
        ctx.font = '900 40px 微软雅黑';
        ctx.fillText('GAME OVER!!!', ctx.canvas.width / 2, ctx.canvas.height / 2);

        // 将小鸟开始运动到运动结束的时间显示在页面上。


        ctx.font = '400 25px 微软雅黑';
        ctx.textAlign = 'end';
        ctx.fillText(costTime, (ctx.canvas.width - 20),  30);

    }


    // 使用工厂模式，将Scene构造函数的实例返回
    win.getOverScene = function(option) {
        return new Scene(option);
    }



})(window);
