(function(win){





    // 这个模块用于构建圆环旋转的动画场景
    // 使用构造函数将圆环的运动封装成一个构造函数

    // 构建这个场景需要引入每一个小圆的构造函数
    // var getCirlce = require('./ringFn.js');


    function RingScene(option) {

        this.stage = option.stage;
        this.ringRadius = option.ringRadius;
        this.rotateAnglePerSecond = option.rotateAnglePerSecond || 30;
        this.hasText = option.hasText;

        // console.log(999);
        // RingScene.len++;
        // console.log('RingScene.len' , RingScene.len);
        this._init();
    }

    // RingScene.len = 0;

    RingScene.prototype = {
        constructor: RingScene,

        _init: function() {

            // 这里我们将舞台设置为distance的80%
            var ringRadius = this.ringRadius;
            var stage = this.stage;
            var hasText = this.hasText;
            // 绘制L3组中圆的半径
            var L3Radius = ringRadius / 10;

            // 绘制L2组中圆的半径
            var L2Radius = L3Radius - 11;

            // 中心圆的半径
            var centerRadius = ringRadius / 7;



            // 最外层圆环的半径是 ringRadius/2 - 在外层中运动的最大小圆的
            // 半径,再留10px的间隔
            var outerRadius = (ringRadius / 2 - L3Radius); // 外环的半
            var innerRadius = outerRadius - L3Radius - L2Radius - 2; //内环的半径



            //    第二步：创建背景层，并添加到舞台中
            var bgLayer = new Konva.Layer();
            stage.add(bgLayer);


            //    第三步：绘制背景层的大圆环
            // 圆心坐标
            var cenX = stage.getWidth() / 2;
            var cenY = stage.getHeight() / 2;



            var bgRing = new Konva.Ring({
                x: cenX,
                y: cenY,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                stroke: "#ccc",
                dash: [10, 4],
                strokeWidth: 4
            });

            bgLayer.add(bgRing);


            //分析：由于该项目中除了背景层的大圆环，其它的圆形结构都是一样的。所以，将这些样式一样的结构封装成对象。

            //    其实konva中提供的是封装好的基本方法。用konva提供的对象，已经可以快速构造出简单的对象实例。但是在实际的开发中，我们需要的图形通常是简单图形的组合。这种情况下，我们就可以在konva封装的基础上，将konva中的对象用于我们自己封装的对象使用的基本方法。
            //    也就是，我们将konva中的基本对象又做了一次封装。
            //    这种一个对象被封装到第二个对象中，第二个对象被封装到第三个对象中，其实就和现实世界中的洗面奶一样。洗面奶本身是一种对象，有自己的属性和方法。装有洗面奶的瓶子也是一个对象，也有自己的属性和方法。
            //    把洗面奶放进塑料瓶中，就是将一种对象作为另一个对象的组件，构成新的对象。


            //首先在cenX 和cenY的位置新建一个圆形

            var L1Circle_web = getCirlce({
                x: cenX,
                y: cenY,
                innerRadius: centerRadius - 16,
                outerRadius: centerRadius,
                opacity: .8,
                innerStyle: "#525A82",
                outerStyle: "#e1e1e1",
                hasText: hasText,
                text: 'web'

            });


            //    将圆形添加到背景层中
            L1Circle_web.addToGroupOrLayer(bgLayer);




            //创建一个动画层
            this.animateLayer = new Konva.Layer();
            stage.add(this.animateLayer);


            //    在动画层上创建一个组，用于整合2环上的所有圆形
            this.L2Group = new Konva.Group({
                x: cenX,
                y: cenY
            });

            // console.log('前面的this.L2Group' , this.L2Group);

            this.animateLayer.add(this.L2Group);


            //    在动画层上创建一个组，用于整合3环上的所有圆形
            this.L3Group = new Konva.Group({
                x: cenX,
                y: cenY
            });

            this.animateLayer.add(this.L3Group);

            //由于在做动画的时候，图形围绕原始画布的原点，也就是舞台的原点（0，0）旋转的，不符合我的要求。我希望图形围绕(cenX,cenY)旋转。怎么办呢？ —————— 可以将每一环的组的的原点translate到(cenX,cenY)。这样，在该组中，只要使用了(cenX,cenY)的点都变成了(0,0)。





            //    构造2环中的第一个图形
            var L2Circle_jQuery = getCirlce({
                x: innerRadius * Math.cos(-60 * Math.PI / 180),
                y: innerRadius * Math.sin(-60 * Math.PI / 180),
                innerRadius: L2Radius - 8,
                outerRadius: L2Radius,
                opacity: .8,
                innerStyle: "#FABB48",
                outerStyle: "#e1e1e1",
                hasText: hasText,
                text: 'jQuery'
            });

            L2Circle_jQuery.addToGroupOrLayer(this.L2Group);


            //构造2环中的第二个图形
            var L2Circle_Ajax = getCirlce({
                x: innerRadius * Math.cos(150 * Math.PI / 180),
                y: innerRadius * Math.sin(150 * Math.PI / 180),
                innerRadius: L2Radius - 8,
                outerRadius: L2Radius,
                opacity: .8,
                innerStyle: "pink",
                outerStyle: "#e1e1e1",
                hasText: hasText,
                text: 'Ajax'
            });

            //将图形添加到2环组中
            L2Circle_Ajax.addToGroupOrLayer(this.L2Group);



            //创建3环上的图形
            var L3Circle_Canvas = getCirlce({

                x: outerRadius * Math.cos(80 * Math.PI / 180),
                y: outerRadius * Math.sin(80 * Math.PI / 180),
                innerRadius: L3Radius - 10,
                outerRadius: L3Radius,
                opacity: .8,
                innerStyle: "lightblue",
                outerStyle: "#e1e1e1",
                hasText: hasText,
                text: 'Canvas'

            });

            //    将图像添加到组中
            L3Circle_Canvas.addToGroupOrLayer(this.L3Group);

            var L3Circle_Angular = getCirlce({
                x: outerRadius * Math.cos(190 * Math.PI / 180),
                y: outerRadius * Math.sin(190 * Math.PI / 180),
                innerRadius: L3Radius - 10,
                outerRadius: L3Radius,
                opacity: .8,
                innerStyle: "teal",
                outerStyle: "#e1e1e1",
                hasText: hasText,
                text: 'Angular'
            });


            L3Circle_Angular.addToGroupOrLayer(this.L3Group);

            var L3Circle_NodeJS = getCirlce({
                x: outerRadius * Math.cos(300 * Math.PI / 180),
                y: outerRadius * Math.sin(300 * Math.PI / 180),
                innerRadius: L3Radius - 10,
                outerRadius: L3Radius,
                opacity: .8,
                innerStyle: "#3CB371",
                outerStyle: "#e1e1e1",
                hasText: hasText,
                text: 'NodeJS'
            });
            L3Circle_NodeJS.addToGroupOrLayer(this.L3Group);


            //将背景层和动画层都渲染到舞台上
            bgLayer.draw();
            this.animateLayer.draw();

            // console.log(890);

            

        },

        // 封装一个让小圆围绕圆环转动的函数，使用konva的animate
        // 动画系统
        playAnimation: function() {

           
          var L2Group = this.L2Group ; 
          var L3Group  =this.L3Group;
          var rotateAnglePerSecond = 30;
            

            // this.rotateAnglePerSecond = 30;
            this.animate = new Konva.Animation(function(frame) {
                //animate的这个函数每隔一小段时间就会被调用。其实konva在animate动画内部封装了一个定时器。这个定时器很智能，每次执行定时器的时间和电脑的性能有关。电脑性能越良好，动画渲染得越流畅。一般电脑中，使用animate动画，都是1s运行60帧。
                //        当浏览器忙碌的时候，时间间隔会变大，1s可能无法运行60帧。


                //        animate动画中有一个属性timeDiff，表示的是在执行这个动画的时候，前一帧动画执行结束后   到   执行本帧之间的时间间隔。
                //        这个时间间隔是变化的。根据电脑的性能和浏览器的状态而变化。
                //


                //通过这个timeDiff属性，我们可以求得，做animate动画的元素在运行每一帧时旋转的角度
                var rotateAngle = rotateAnglePerSecond * frame.timeDiff / 1000;
                //        timeDiff / 1000是间隔时间和总时间（1s）的比值。
                //        timeDiff / 1000 == rotateAngle / rotateAnglePerSecond
              


                //2环中的组顺时针运动
             
                L2Group.rotate(rotateAngle); //这里的旋转角度不适用弧度

                //        2环组中的单个元素旋转角度为负值。 角度绝对值相等。
                L2Group.getChildren().each(function(item, index) {
                    //item是每一个孩子
                    //index是每一个孩子的索引
                    item.rotate(-rotateAngle);


                });
                //        konva中获取子元素可以用getChildren。获取的是一个集合。和 jQuery中使用children效果一样。
                //        each 方法也和jQuery中的实例each用法一样。只是貌似传入的参数顺序相反。


                //3环中的组 逆时针运动
                L3Group.rotate(-rotateAngle);
                L3Group.getChildren().each(function(item, index) {
                    item.rotate(rotateAngle);
                })

                // return false;

            }, this.animateLayer);

            //    在使用konva的animate动画系统的时候，同样需要用new 操作符来实例化一个动画对象。
            //    实例化的过程中需要两个参数，第一个动画的执行函数，另一个是谁的元素做动画。
            //    这里是this.animateLayer层中的元素做动画。所以将该层传入。


            // 开启动画
            this.animate.start();

             // 引入事件注册
            this.addMouseEvent();



        },
        // 给动画层绑定鼠标悬停和移出事件，当鼠标悬停在动画层上的时候，
        // 停止动画；当鼠标移开的时候，开始动画
        addMouseEvent: function() {

         

            var rotateAnglePerSecond = this.rotateAnglePerSecond ;
            var animate = this.animate;


            //    设置好动画后，给动画层绑定事件。konva中的事件和jQuery中的事件一模一样。
            //    1.给动画层绑定mouseover和mouseout事件。这两种事件都会触发冒泡，刚好符合我们的需求。为什么呢？

            //    2.因为层其实虽然通过document.ceatElement("canvas")的方式创建了，但是并没有将这个canvas（层）添加到html的

            //    3.因为层其实虽然通过document.ceatElement("canvas")的方式创建了，但是并没有将这个canvas（层）添加到html的Dom树中。

            //    4.我们通过在layer里面绘图，将图绘制好后，通过
            //    canvas.draw(canvas1,x,y,w,h)的方式将这个layer中的图片载入到唯一显示的那个stage（舞台）中。 —————— 也就是说，
            //    层只能将自己的图片部分渲染到舞台中，其它的部分是没有添加到舞台上的。

            //    5.所以，当添加mouseover和mouseout事件的时候，正是因为有事件冒泡，所以，鼠标滑过layer的子元素会有效果。
            //

            //   鼠标悬停的时候，该层上所有元素的旋转速度减慢
            this.animateLayer.on("mouseover", function() {
                animate.stop();

            });


            // //   鼠标离开的时候，该层上所有元素的旋转速度恢复正常
            // this.animateLayer.on("mouseout", function() {
            //    animate.start();
             
            // });

        }
    }

    var drawCanvas = function(option) {

        return new RingScene(option);
    };

    win.drawCanvas = drawCanvas;


 



})(window)