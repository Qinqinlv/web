(function(win){


    /**
     * Created by Administrator on 2017/5/11.
     */
    //创建进度条的构造函数和原型

    function ProgressBar(option) {
        this._init(option);
    }

    ProgressBar.prototype = {
        //好吧，这个prototype的第二个t要小写

        _init: function(option) {
            //进度条的属性
            this.x = option.x || 0; //进度条开始绘制的X坐标
            this.y = option.y || 0; //进度条开始绘制的Y坐标
            this.width = option.width || 0; //进度条的宽度
            this.height = option.height || 0; //进度条的高度
            //this.fillStyle = !!(option.fillStyle) === false ? false : option.fillStyle; //进度条的填充色

            //由于使用的是konva定义矩形，在konva中只要写了fill，就一定会填充；
            //同样写了stroke，也一定会描边。所以在这里，一定要保证fillstyle和strokeStyle是有颜色值的。
            this.fillStyle = option.fillStyle || "orange";
            //this.strokeStyle = !!(option.strokeStyle) === false ? false : option.strokeStyle; //进度条的描边色
            this.strokeStyle = option.strokeStyle || "deeppink";

            this.lineWidth = option.lineWidth || 2; //进度条描边的宽度

            this.opacity = option.opacity || 1;

            //由于我们的需求是一旦创建一个进度条对象，不调用该对象的任何其它的方法就能绘制出该进度条，
            //所以，要在_init()函数中完成实例雏形的创建。这样，一旦实例化，马上就能生成进度条。

            //定义内部的矩形
            var innerRect = new Konva.Rect({
                x: 0, //设置矩形的X坐标
                y: 0,
                width: 0, //矩形的初始宽度为0
                height: this.height,
                fill: this.fillStyle,
                opacity: this.opacity,
                cornerRadius: this.height / 2, //设置圆角半径
                id: 'innerRect',
                //设置innerRect的ID，以便于后面的组使用find()方法，通过传入该ID选择器找到这个innerRect。

                name: 'ss'
                    //name就是class（类），只是用name来代替class这个字符，意思是一样的。设置name,以后就可以用类选择器来获取这个innerRect。
            });


            //将在上面定义的innerRect设置成进度条的属性。

            this.innerRect = innerRect;


            //定义外面的矩形

            var outerRect = new Konva.Rect({
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                stroke: this.strokeStyle,
                cornerRadius: this.height / 2,
                strokeWidth: 4,
            });

            this.outerRect = outerRect;

            //创建一个组，相当于html中的父盒子。
            //这个组的内部原理其实就是在canvas画布中绘画的时候，
            //先将原始的画布状态保存[ctx.save()]，接着将画布translate(this.x,this.y)，
            //画布的原点移动到(this.x , this.y)的位置。
            //在这个group上的所有元素的坐标以
            //group的原点坐标（0，0）为计算的基准。绘制完后，
            //将当前环境重置成之前保存的环境。[ctx.restore]
            this.group = new Konva.Group({
                x: this.x,
                y: this.y
            });

            //把上面定义的内部和外部矩形都添加到组中
            this.group.add(innerRect);
            this.group.add(outerRect);

        },
        //封装一个函数，根据用户输入进来的值，确定该进度条显示的占比
        changeValue: function(val, durationTime) {

            //先看看，这个val是不是小数，如果不是小数，需要转换成小数。
            if (val > 1) {
                val = val / 100;
            }

            //根据传入的val，确定innerRect的宽度

            //获取innerRect这个内部矩形的方法1：
            //var innerRect = this.innerRect;

            //获取innerRect的方法2：(id选择器)
            var innerRect = this.group.findOne("#innerRect");

            //类选择器
            //var innerRect = this.group.findOne(".ss");

            //标签选择器(这个标签就是：new Konva 标签名)
            //var innerRect = this.group.findOne("Rect");

            //group可以使用find()或者findOne()方法，传入选择器获取对应的元素。
            //find()和jQuery中的find()一样，都是用于在所有后代中查找符合条件的元素。
            //findOne()表示从所有后代中查找第一个符合条件的元素。

            var width = this.width * val;

            // console.log('innerRect' , innerRect);


            //设置to动画，让进度条从当前的状态运动到下面设置的状态
            innerRect.to({
                width: width,
                duration: durationTime || 1,
                easing: Konva.Easings.EaseOut()
            });

        },
        // 封装一个函数，用于把当前创建好的进度条添加到层中

        // arg： 传进来的层或者 是组，
        //此方法是：把当前创建的进度条　添加到　层中。
        //因为在舞台结构中，舞台下面是层，层下面是组或者具体元素，组里面也可以有组或者具体元素。所以下面这个函数名称的语义就是：将该组添加到组或者是层中。 —— 只要符合父子关系即可。
        addToGroupOrLayer: function(arg) {
            arg.add(this.group);
        }

    };


    var getProgressBar = function(option) {
        return new ProgressBar(option);
    };

    win.getProgressBar = getProgressBar;






})(window)