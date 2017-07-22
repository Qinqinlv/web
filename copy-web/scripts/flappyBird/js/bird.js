(function(win){

	// 步骤4：创建小鸟(bird)的构造函数
function Bird(option) {
    //创建小鸟需要的属性

    //在canvas中绘制小鸟的初始位置
    this.x = option.x || 50;
    this.y = option.y || 50;
    // canvas绘图上下文
    this.ctx = option.ctx;

    // 加载进来的精灵图，我们要裁剪该图，画出不同状态的小鸟
    this.imgBird = option.imgBird;

    // 我们拿到的小鸟图片是一张精灵图。
    // 里面有好几个小鸟的不同状态。
    // 我们将整张图加载进来，每一次绘制小鸟的时候，
    // 需要根据原图X轴上小鸟的个数，Y轴上小鸟的个数
    // 来确定当前使用的是哪一个状态的小鸟。

    this.widthFrame = option.widthFrame || 1;
    this.heightFrame = option.heightFrame || 1;

    // 根据widthFrame和heightFrame确定当前使用的小鸟是哪一个状态的小鸟
    this.imgW = this.imgBird.width / this.widthFrame;
    this.imgH = this.imgBird.height / this.heightFrame;

    // 小鸟在canvas画布中的显示大小
    this.cvsW = option.cvsW || this.imgW;
    this.cvsH = option.cvsH || this.imgH;
    // 小鸟有3个状态，这里这定一个变量记录不同小鸟的索引值
    this.frameIndex = 0;

    // 小鸟下落的速度
    this.speed = option.speed || 2;

    // 小鸟向前移动的速度
    this.moveOn = option.moveOn || 1;

    // 每次点击后，小鸟的反向运动速度
    this.speedReverse = -option.speedReverse || -2;

    // 小鸟下落的加速度
    this.speedPlus = option.speedPlus || 0.1;
}

Bird.prototype = {
    constructor: Bird,
    // 开始绘制小鸟
    render: function() {

        // console.log('bird');
        // console.log('this.speed',this.speed);


        // 由于需要旋转，会改变canvas画布的坐标。
        // 所以在旋转之前，将画布的原始状态保存起来
        this.ctx.save();

        // 每点击一次屏幕，小鸟的角度就改变一次。
        // 小鸟的旋转角度和小鸟下落的速度成比例关系
        // 当speed为1时对象的角度为10度
        // 当前速度 / 1 = 当前弧度 / baseRadian 
        var baseRadian = Math.PI / 180 * 10;
        // 设置小鸟向下和向上旋转的最大角度是45度
        var maxRadian = Math.PI / 180 * 45;
        // 小鸟当前的旋转角度
        var currentSpeed = baseRadian * this.speed;
        currentSpeed = currentSpeed >= maxRadian ? maxRadian : currentSpeed;


        // 在canvas中，想要使图片旋转的唯一方式，就是让坐标系旋转。
        // canvas只能旋转自己的坐标系，不能旋转canvas中的具体画面。
        // 但是可以通过将canvas画布原点(0,0)平移到当前需要旋转的图片的左上角
        // 或者是中心，然后再旋转坐标系来达到目的。

        // 为了使图片旋转，我们先移动canvas的原点到小鸟的中心点所在位置。
        this.ctx.translate(this.x + this.imgW / 2, this.y + this.imgH / 2);

        // canvas坐标系的原点变化后，下面的绘制小鸟的时候，绘制小鸟的位置就应该是
        // （-this.imgW / 2,-this.imgH / 2）。也就是负的小鸟自身宽高的一半


        this.ctx.rotate(currentSpeed);
        // console.log(currentSpeed);




        // 每次绘制一个，frameIndex就自增

        this.ctx.drawImage(this.imgBird, (this.imgW * this.frameIndex), 0, this.imgW, this.imgH, -this.imgW / 2, -this.imgH / 2, this.cvsW, this.cvsH);

        // this.frameIndex++; //这里不需要再写这句话，因为下面的代码中，++this.frameIndex运算结束后，framIndex已经自增了。
        this.frameIndex = ++this.frameIndex >= this.widthFrame ? 0 : this.frameIndex;



        // 让小鸟不断下落
        // 这里就需要不断更改小鸟在canvas上绘制的y坐标

        // 这样是让小鸟匀速下落，显然不是很好。这里需要让小鸟有一个加速度。

        this.y += this.speed;
        this.speed += this.speedPlus;


        // 绑定点击事件
        this.bindClickEvent();


        this.ctx.restore();

    },
    bindClickEvent: function() {
        //绑定点击事件，当用鼠标点击屏幕的时候，小鸟向上移动。

        // 记录下this的指向
        var self = this;
        // 记录下我们最初设置的小鸟降落速度

        document.addEventListener("click", function() {
            self.speed = self.speedReverse;

            // 当设置self.speed = -2的时候，此时this.y += this.speed,并且同时this.speed += this.speedPlus
            // 如果我点击屏幕的时候，this.speed == 3，点击后this.speed == -2，那么this.y = this.y -2,小鸟马上就会上升。
            // 接着this.speed += this.speedPlus ————  也就是this.speed = -2 + 0.1,
            // 依次往下计算，this.speed的值会越来越小，最中变成0，接着又开始越来越快。


        })
    }

}

// 用来存储已经创建好的鸟实例对象
    var bird = null;
    // console.log('bird');

    // 工厂模式，目的是在实例化的时候省去new关键字
    win.getBird = function( option) {

        // 单利模式,整个游戏只要一个bird就够了
        if ( !bird ) {

        	// 在整个游戏中bird只会被创建一次，第一次创建的时候，由于bird是这里的全局作用域，
            // 此时 bird = null，布尔值为false，所以会进入这个if语句new一个bird并返回。
            // 以后再次调用getBird()函数的时候，由于bird不为空，所以不会进入这个if语句
            // 直接就会return我们之前已经创建好了的bird.
        	
            bird = new Bird( option );
        }

        return bird;
    };

})(window);