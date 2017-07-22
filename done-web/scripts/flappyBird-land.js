(function (win) {

	// 步骤2：创建地面(ground)的构造函数
function Land(option) {

    //地面应该具有的属性
    //land绘制在canvas中的起始
    this.x = option.x || 0;
    this.y = option.y || 0;
    // canvas绘图上下文
    this.ctx = option.ctx;
    // 加载进来的需要被绘制的land图片
    this.imgLand = option.imgLand;
    // 图片自己的裁剪宽高
    this.imgW = option.imgW || this.imgLand.width;
    this.imgH = option.imgH || this.imgLand.height;

    // 图片的缩放比
    this.scale = option.scale || 1;

    // land在canvas画布中的显示宽高
    this.cvsW = (this.imgW * this.scale) || this.imgW;
    this.cvsH = (this.imgH * this.scale)  || this.imgH;

    // 地面向左移动的速度
    this.speed = option.speed || 2;

    // 通过该构造函数，每实例化一个对象，Land.len就自增1。
    Land.len++;
    // 对应的实例的初始x轴坐标发生变化
    this.x = this.cvsW * (Land.len - 1);
    // console.log(Land.len); // 4

}
// 给Land构造函数添加静态属性。每实例化一个land，Land.len就自增1.
Land.len = 0;

Land.prototype = {
    constructor: Land,
    //开始绘制land图片
    render: function() {
        // 和渲染天空sky背景图时一样，每次绘制land的时候，
        // land图片要往左移动。并且还是一个无缝轮播。
        // 这里采用的方式是，给构造函数增加一个静态属性，用于记录
        // 实例化的对象个数。当实例化第二个对象的时候，第二个对象的其实x轴位置
        // 是自己的宽度。

        this.y = (this.ctx.canvas.height - this.cvsH);
        this.ctx.drawImage(this.imgLand, 0, 0, this.imgW, this.imgH, this.x, this.y, this.cvsW, this.cvsH);

        // 更新land的x轴数据
        this.update();

    },
    update: function() {
        // 在动画中，每次渲染land的时候，land需要往左移动
        this.x -= this.speed;

        // 当一张 land图片移动完全移动出canvas画布后，该land马上跳转到最后一个
        // 实例化的land对象的初始x轴位置，等待接着轮播。
        // if(this.x <= -this.imgW){
        //     // this.x = this.imgW * (Land.len - 1);
        // }
        // 使用上面的这种方式，land图片之间的拼接会有一条小缝隙，这是为什么？
        // 这应该跟我们的this.speed有关。图片每次向左移动this.speed距离。但是由于land
        // 图片自己的宽度不能整除this.speed，所以this.x可能是 < -this.width才会跳转位置，跳转时this.x与this.width的差值是n。
        // 由于此时land跳转的位置是最后实例化land的位置。而此时最后一个land的x坐标是
        // (this.width * 3 - n)。此时跳转过来的land和最后实例化的那个land中间就会有间隔，间隔距离就是n。

        // 如果要消除间隔，则应该使用this.x += ?的方式。 
        this.x += this.x <= -this.cvsW ? this.cvsW * Land.len : 0;
    }
}

// 工厂模式，目的是在实例化的时候省去new关键字
win.getLand = function (option) {
	return new Land(option);
}

	
})(window);