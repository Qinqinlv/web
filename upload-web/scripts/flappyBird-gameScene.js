(function(win) {

    // gameScene光荣称为监听者，所以，又拥有了一个方法addListener()
    // 以及监听者用于打听小鸟是否死亡的逻辑程序


    // 将整个游戏的画面抽取出来。
    // 此时，小鸟、天空、地面、管道都在运动。

    /*
     * constructor { Scene } 游戏场景
     * param { ctx: Context } 绘图环境
     * param { imgObj: Object } 创建角色所需的图像资源
     * */
    function Scene(option) {

        this.ctx = option.ctx;
        this.imgObj = option.imgObj;
        this.scale = option.scale || 1;

        // 用来存储游戏所需的所有角色
        this.roles = [];
        this._initRoles();

        // 用于存放监听到某个事件发生后，大boss交代给我的锦囊（也就是回调函数）
        this.listeners = [];
        // 当要监听的事件 > 1的时候，我们就把listeners设置成空对象，用来存储
        // 每一种事件发生时需要打开的锦囊。
    }


    Scene.prototype = {

        constructor: Scene,
        // 初始化游戏的基本场景
        _initRoles: function() {


            // 这些getSky()等方法之所以可以用，是因为它们都是window对象属性。
            // 作为全局变量在在js中的任何地方都是可以直接使用。


            // 背景2个
            this.roles.push(getSky({
                ctx: this.ctx,
                skyImg: this.imgObj.sky,
                scale : this.scale,
                speed: 2
            }));
            this.roles.push(getSky({
                ctx: this.ctx,
                skyImg: this.imgObj.sky,
                scale : this.scale,
                speed: 2
            }));
             this.roles.push(getSky({
                ctx: this.ctx,
                skyImg: this.imgObj.sky,
                scale : this.scale,
                speed: 2
            }));


            // 管道6个
            for (var i = 0; i < 9; i++) {
                this.roles.push(getPipe({
                    ctx: this.ctx,
                    pipeUp: this.imgObj.pipeUp,
                    pipeDown: this.imgObj.pipeDown,
                    landH: this.imgObj.land.height * this.scale,
                    scale : this.scale,
                    speed: 2
                }));

            }

            // 大地4个
            for (var i = 0; i < 6; i++) {
                this.roles.push(getLand({
                    ctx: this.ctx,
                    imgLand: this.imgObj.land,
                    scale : this.scale,
                    speed: 2

                }));
            }


            // 创建鸟
            this.roles.push(getBird({
                ctx: this.ctx,
                imgBird: this.imgObj.bird,
                widthFrame: 3,
                heightFrame: 1,
                scale : this.scale,
                speed : 2
            }));

        },

        // 添加专门用于接收大boss锦囊的addListener()方法
        addListener: function(fn) {
            this.listeners.push(fn);
            // 将boss传给监听者的锦囊放到专门存放锦囊的数组中
        },
        triggerBirdOver: function() {
            // 这个方法是监听者专门创建出来用于打开锦囊的
            this.listeners.forEach(function(listener) {
                listener();
            })
        },


        // 让所有的场景内容都被绘制到canvas画布中
        render: function(startTime) {

                // 专门用于监听事件的代码
                /*
                 * 每次绘制新的游戏画面时，
                 * 先判断小鸟有没有碰撞，
                 * 如果碰撞暂停定时器。
                 * */
                var bird = getBird(); //这里为何不加参数?? ———— 因为在getBIrd()函数中bird一旦创建过，
                // 以后使用getBird()的时候，不管传不传参数，都是获取之前已经创建好的 bird。
                var birdCoreX = bird.x + bird.imgW / 2;
                var birdCoreY = bird.y + bird.imgH / 2;

                // 如果小鸟撞向管道，或者飞出天空，或者duang~duang~duang，那么游戏结束
                if (this.ctx.isPointInPath(birdCoreX, birdCoreY) ||
                    birdCoreY < 0 ||
                    birdCoreY > (this.ctx.canvas.height - this.imgObj.land.height * this.scale)) {
                    // 如果进入了if语句，就说明小鸟已经死了。
                    // 监听者需要马上打开boss给的锦囊

                    // 这里，监听者为了马上打开锦囊，还特地新增了一个triggerBirdOver方法
                    this.triggerBirdOver();


                } else {

                    // 如果小鸟死了，就不能再接着执行下面绘制绘制游戏场景的代码了。
                    // 如果没有这个else语句将下面的代码包裹起来，那如果小鸟死了，
                    // 触发了boss给的锦囊，马上执行锦囊中的代码，停止定时器，
                    // 并且绘制了游戏结束的场景。接着又执行当前的函数体中剩余代码，
                    // 渲染 最后一个动画场景。那么最后的那个动画场景就会覆盖之前
                    // 渲染出的游戏结束场景。


                    // 先清除上一次绘制的6个管道路径，
                    // 然后再按照新的位置绘制新路径
                    this.ctx.beginPath();
                    this.roles.forEach(function(ele) {
                        ele.render();
                    })

                    this._calcuTime(startTime);



                }


            },
            // 这里封装一个计算小鸟当前运动时间的函数，
            // 并在每次渲染小鸟的时候，将时间渲染到页面上
        _calcuTime: function(startTime) {

            // 获取本次渲染小鸟后的花费的时间
            var costTimeSec = 0;
            var costTimeMini = 0;
            var costTimeHoure = 0;

            var overTime = new Date().getTime();

            var pastTime = (overTime - startTime) / 1000;
            // console.log('pastTime',pastTime);



            // 花费的秒数
            costTimeSec = parseInt(pastTime % 60);
            costTimeSec = costTimeSec > 9 ? costTimeSec : '0' + costTimeSec;

            // 花费的分钟数
            costTimeMini = parseInt(pastTime / 60 % 60);
            costTimeMini = costTimeMini > 9 ? costTimeMini : '0' + costTimeMini;


            // 花费的小时数
            costTimeHoure = parseInt(pastTime / 3600);
            costTimeHoure = costTimeHoure > 9 ? costTimeHoure : '0' + costTimeHoure;


            // 所以花费的总时间写成字符串表示如下：
            var costTime = '用时：' + costTimeHoure + '小时' + costTimeMini + '分钟' + costTimeSec + '秒';

            // 将花费的时间渲染到画布上
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'yellow';
            ctx.font = '400 20px 微软雅黑';
            ctx.textAlign = 'end';
            ctx.fillText(costTime, (ctx.canvas.width - 20), 30);




        }

    }

    // 这个构造函数之所以叫做场景，就是因为它把多个对象柔和在了一起。
    // 多个对象的组合，在canvas中我们一般都称为场景。

    // 在这个沙箱模式中将这个场景封装好后，该沙箱外面要想使用这个场景，
    // 就需要我们在这里借用window对象，将Scene作为window对象的属性，
    // 将Scene变量作为全局变量供别人使用。

    // 但是这个Scene()函数中的作用域，其它的任何变量、函数均不能访问。

    // win.Scene = Scene;

    // 为了省略使用Scene构造函数实例化对象的时候使用的 new关键字。我们在这个
    // 沙箱中给 window对象绑定一个放法：getScene()。当外部需要new一个游戏场景
    // 出来的时候，不用再写new，直接由getScene()函数内部返回一个实例即可。

    win.getGameScene = function(option) {
        return new Scene(option);
    }

})(window);
