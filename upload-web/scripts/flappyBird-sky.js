(function (win) {

	// 步骤1：创建天空的(sky)的构造函数

function Sky(option) {
    // 绘制天空需要哪些属性呢？
    this.x = option.x || 0;
    this.y = option.y || 0;
    this.skyImg = option.skyImg;
    // 绘制在canvas中的图片宽高
    
     // 图片的缩放比
    this.scale = option.scale || 1;

    // 图片在页面中显示的高度
    this.imgW = this.skyImg.width * this.scale;
    this.imgH = this.skyImg.height * this.scale;

    // 每一帧中，天空移动的距离
    this.speed = option.speed || 2;
    // 绘制图片的上下文
    this.ctx = option.ctx;

    // 每实例化一个sky，Sky的静态属性length就自增。
    // 下面是当前实例化sky的时候，sky的x坐标。
    ++Sky.len;
    this.x = this.imgW * (Sky.len - 1);

}

// 给Sky构造函数绑定一个静态属性length。每实例化一个sky，
// length就自增1，
// 并且对应的当前实例化的sky在canvas中的X轴坐标。
Sky.len = 0;

Sky.prototype = {
    constructor: Sky,
    render: function() {

        // 绘制天空背景的时候，不能清空画布。
        // （大坑啊！！调式了一下午才找到这个问题！！！）
        this.update();

        this.ctx.drawImage(
            this.skyImg,
            0,
            0,
            this.skyImg.width,
            this.skyImg.height,
            this.x,
            this.y,
            this.imgW,
            this.ctx.canvas.height
        );

        // 更新sky的x轴坐标值
        this.update();
    },
    update: function() {

        // 由于天空sky要往左边移动。所以，当sky的x轴要递减
        this.x -= this.speed;

        // 当sky的x坐标 <= -this.imgW的时候，图片的X坐标又回归到 this.imgW
        // if (this.x <= -this.imgW) {
        //     this.x += this.imgW * Sky.len;
        // }
        this.x += this.x <= -this.imgW ? this.imgW * Sky.len : 0;

    }
}


// 工厂模式，目的是在实例化的时候省去new关键字
win.getSky = function(option){

	return new Sky(option);

}

	
})(window);