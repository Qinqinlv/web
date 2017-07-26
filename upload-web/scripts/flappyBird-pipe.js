(function (win) {

	// 步骤3：创建管道的构造函数
function Pipe(option) {

    this.ctx = option.ctx;

    // 获取上管道图片对象
    this.pipeUp = option.pipeDown;

    // 获取下管道图片对象
    this.pipeDown = option.pipeUp;

    // 每一对随机生成的上下管道之间的水平间隔
    this.space = option.space || 160;

    // 第一对管道在canvas中的初始x坐标
    this.startX = option.startX || 300;

    // 由于上下管道成对出现，所以，他们的x轴坐标一样
    this.pipeX = option.pipeX || this.startX;


    // 图片的缩放比
    this.scale = option.scale || 1;

    // 设置上管道和下管道之间的距离
    this.gap = option.gap || 160  ;


    // 上管道的宽高
    this.pipeUpW = (this.scale * this.pipeUp.width) || this.pipeUp.width;
    this.pipeUpH = (this.scale * this.pipeUp.height) || this.pipeUp.height;


    // 下管道的宽高
    this.pipeDownW = (this.scale * this.pipeDown.width) || this.pipeDown.width;
    this.pipeDownH = (this.scale * this.pipeDown.height) || this.pipeDown.height;


    // 上管道在canvas画布中展示的高度
    //canvas画布的高度减去上下管道之间的间隔，以及地面的高度，剩下的高度
    //怎样获取地面的高度呢？由外界传入比较好
    this.landH = option.landH || 112;



    // 管道的可支配高度
    this.sumHeight = this.ctx.canvas.height - this.gap - this.landH;

    // 上下管道的最小高度
    this.minHeight = option.minHeight || 60  ;
    // 由此得到上下管道的最大高度：
    this.maxHeight = this.sumHeight - this.minHeight;




    this._init(option);

    // 管道向左移动的速度
    this.speed = option.speed || 2;




    // 每实例化一个管道对象，这个新的管道对象就和上面的那个管道对象间隔this.space距离。
    Pipe.len++;
    this.pipeX += this.space * (Pipe.len - 1);






}

// 给构造函数绑定一个静态属性，用于表示实例化管道的个数
Pipe.len = 0;



Pipe.prototype = {
    constructor: Pipe,

    // 初始化管道高度和上下管道坐标
    _init: function(option) {


        //上下管道随机分配,高度在this.minHeight 和maxHeight之间
        var randomHeight = Math.floor(Math.random() * this.maxHeight);
        randomHeight = randomHeight > this.minHeight ? randomHeight : this.minHeight;

        // 上管道的高度
        this.upHeight = randomHeight;

        // console.log('上管道在canvas中实际高度this.upHeight',this.upHeight);



        // // 上面管道的y轴坐标 = 随机生成的高度 - 管道默认的高度
        //               this.downY = randomHeight - this.height;

        //               // 下面管道的y轴坐标 = 随机生成的高度 + 上下管道的间隔
        //               this.upY = randomHeight + this.space;



        // 下管道在canvas画布中的高度
        this.downHeight = this.sumHeight - this.upHeight;


        // 上管道在canvas画布中的起始位置
        // 绘制上管道的时候，是从管道自身的左上角原点开始绘制，但是在canvas画布中，我们只需要
        // 上管道的下面一部分。所以，在canvas中绘制上管道的时候，它的Y轴坐标为负数。
        // this.pipeUpY = this.upHeight - this.pipeUpH ;语句的作用就是取上管道从底部到this.upHeight高度的部分，绘制到canvas中。

        // console.log('上管道原始高度this.pipeUpH' , this.pipeUpH);

        // 当this.upHeight没有上管道原始高度那么高的时候，
        // 就使用this.pipeUpY = this.upHeight - this.pipeUpH;
        // 当this.upHeight比原始高度还高的时候，就直接使用
        // this.pipeUpY = 0

        if(this.upHeight <= this.pipeUpH){

            this.pipeUpY = this.upHeight - this.pipeUpH;
        }else {
            this.pipeUpY = 0;
        }

        // console.log(' 上管道坐标this.pipeUpY', this.pipeUpY);

        // 下管道在canvas画布中的起始位置，应该在地面上，所以要减去地面的高度
        // this.pipeDownY = this.ctx.canvas.height - this.landH - this.downHeight;
        // 或者：
        
        // 如果 randomHeight比下管道的原始高度要低，
        // 那么就使用 this.pipeDownY = randomHeight + this.gap;
        // 如果randomHeight比下管道的原始高度高，
        // 那么就使用下管道的原始高度
      
            this.pipeDownY = randomHeight + this.gap;
       

    },
    render: function() {

        //绘制成对的上下管道
        // 每绘制一次，管道向左移动
        this.pipeX -= this.speed;

        // 绘制上管道
        this.ctx.drawImage(
            this.pipeUp,
            0,
            0,
            this.pipeUp.width,
            this.pipeUp.height,
            this.pipeX,
            this.pipeUpY,
            this.pipeUpW,
            this.pipeUpH
        );

        // 绘制下管道
        this.ctx.drawImage(
            this.pipeDown,
            0,
            0,
            this.pipeDown.width,
            this.pipeDown.height,
            this.pipeX,
            this.pipeDownY,
            this.pipeDownW,
            this.downHeight
        );

        // 更新管道x轴的数据
        this.update();

        // 绘制描边矩形
        this._drawPath();

    },

    // 更新下一帧管道x轴的数据
    update: function() {

        // 由于管道也需要无缝轮播，所以还需要创建一对管道，并且每当一对管道的x轴 <= 管道自身宽度的时候，这对管道的x轴马上跳转到x轴为画布宽度的位置
        // 由于每一次跳转过来的管道需要有不同的高度，所以，此时我们要随机设置上管道和下管道的高度
        if (this.pipeX <= -this.pipeUpW) {

            this.pipeX += this.space * Pipe.len;

            this._init();

        }
    },
    // 将每一根柱子外围用描边矩形包裹起来。
    // 用于后面判断小鸟是否撞在了管道上
    _drawPath: function() {

        // 注意：使用ctx.strokeRect()和ctx.fillRect()绘制矩形，是不会产生路径的。
        // 想要绘制有路径的矩形只能使用ctx.rect(),然后描边ctx.stroke()

        // 给上管道绘制描边矩形。
        this.ctx.rect(this.pipeX,this.pipeUpY, this.pipeUpW, this.pipeUpH);

        // 绘制下管道
        this.ctx.rect(this.pipeX, this.pipeDownY, this.pipeDownW,
            this.downHeight);
        // this.ctx.strokeStyle =  "tansparent"; //该条语句没有任何卵用

        // this.ctx.stroke(); //如果不描边，那么就只有路径，不会给路径上色
    }


}

// 工厂模式，目的是在实例化的时候省去new关键字
win.getPipe = function (option) {
	return new Pipe(option);
}

	
})(window);