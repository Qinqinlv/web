(function() {



    // 需求1：这里需要一个功能，当屏幕的宽度小于768px的时候，
    // 小圆上不出现文字,并且当浏览器改变宽度的时候，canvas重新绘制

    // 给屏幕resize触发事件的时候，设置一个时间，在这一时间内，
    // 只触发一次resize 事件。这样可以节省cpu性能

    // 需求2： 页面刚打开的时候，当屏幕为md及以上的时候，才渲染动画

    // 需求3：在屏幕resize的过程中，如果屏幕宽度小于768，停止渲染canvas

    // console.log(111);

    // 求屏幕的宽度
    var $width = 0;
    var $height = 0;


    // 这是整个圆环动画的最大宽度
    var ringRadius = 0;
    // 用一个变量记录是否传入文字
    var hasText = true;
    // 设置一个变量，用于判断浏览器是否执行resize事件
    var resizeActive = false;


    // 导入构建圆环的场景函数
    // var drawCanvas = require('./ringSecne.js');

    // console.log(typeof drawCanvas);

    var timeInner = 0;
    var timerOut = 0;
    var times = 0;



    // // 页面刚打开的时候，当屏幕为md及以上的时候，才渲染动画
    // if ($width >= 992) 


    // 使用window.resize事件，监听ringRadius的大小，当
    // ringRadius <= 500px的时候，就不添加文字
    $(window).on('resize', function() {


        timerOut++;
        // console.log('外层被调用的次数', timerOut);

        if (!resizeActive) {

            times++;
            // console.log('中间被调用的次数', times);


            // timer = null;
            resizeActive = true;

            // console.log(resizeActive);

            // 每次在浏览器触发了resize事件的时候，
            // 先判断一下，现在该不该执行回调函数。

            // 如果这个resizeActive为true，说明我们设置的
            // 定时器时间没有到，此时不执行回调函数；
            // 如果resizeActive为false，说明没有定时器在等待，
            // 此时可以新建一个定时器，在等待时间之后，执行回调。

            setTimeout(function() {
                // timer = null;
                timeInner++;
                // console.log('内层被调用的次数', timeInner);


                $width = $(window).innerWidth();

                // resizeActive = false;
                // console.log('$width', $width);

                $height = $(window).innerHeight();

                // console.log('$height', $height);

                // 在屏幕resize的过程中，如果屏幕宽度小于768，停止渲染canvas
                if ($width > 768) {





                    // 取屏幕的宽和高中，值较小的那个作为当前图形宽度的基准
                    ringRadius = $width >= $height ? $height : $width;

                    // 将ringRadius设置在500之间
                    ringRadius = ringRadius < 320 ? 320 : ringRadius;
                    ringRadius = ringRadius > 500 ? 500 : ringRadius;

                    // console.log('ringRadius' , ringRadius);
                    // 创建舞台 

                    var stage = new Konva.Stage({
                        container: "container",
                        width: ringRadius,
                        height: ringRadius
                    });





                    // 当图形宽度 <= 480的时候，就不再图形上加上文字
                    if (ringRadius <= 460) {

                        hasText = false;


                    } else {
                        hasText = true;
                    }
                    // console.log('ringRadius', ringRadius);
                    // console.log('hasText', hasText);

                    drawCanvas({
                        stage: stage,
                        ringRadius: ringRadius,
                        hasText: hasText
                    }).playAnimation();



                }
                // 执行完成后，将resizeActive设置为false
                resizeActive = false;

            }, 10);



        }





    })



    $(window).resize();





})()