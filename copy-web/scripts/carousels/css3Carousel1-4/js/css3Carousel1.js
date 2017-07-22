(function() {

    // 给窗口注册一个resize事件，只要窗口宽度发生变化，
    // 就让图形重绘一次
    // 设置一个监听者，当前回调没有执行完时，不能执行下一个回调函数
    css3Carousel1

    var resizeActive = false;

    $(window).on('resize', function() {

        if (!resizeActive) {

            resizeActive = true;

            //排列每一个li
            $("#css3Carousel1").find('li').each(function(index, el) {
                var $length = ($(this).width());
                console.log('$length', $length);

                $(this).css({ "left": index * $length, "transition-delay": index * 0.2 + "s" }); //jQuery中可以不加单位

                //每一个li中的各个div，background-postion位置不同
                //每一个li做动画的时候，延迟时间为0.2s
                $(this).children("div").css({ "backgroundPosition": -index * $length + "px 0" });


            });

            resizeActive = false;
        }

    })


    $(window).resize();

    //点击next 和 prev，li做动画
    //每一个li之间的transition动画时间间隔0.2s
    var $num = 0;
    // 设置一个变量，使用这个变量当做监听者。只有当这个
    // 变量为false的时候，点击按钮，才会触发回调函数
    var flag = false;

    $("#css3Carousel1").find(".prev").on("click", function() {
        if (!flag) {
            flag = true;

            $num++;
            $(".css3Carousel1 li").css({ "transform": "rotateX(" + $num * 90 + "deg)" });


            //       由于有transition过渡动画的影响，这里要将动画总共
            //       要花的时间算上。只有当一个完整的动画结束之后，才
            // 能接着执行其他的回调函数

            setTimeout(function() {
                flag = false;

            }, 3000);
        }
    });

    $("#css3Carousel1").find(".next").on("click", function() {
        if (!flag) {
            flag = true;

            $num--;
            $(".css3Carousel1 li").css({ "transform": "rotateX(" + $num * 90 + "deg)" });

            setTimeout(function() {
                flag = false;

            }, 3000);
        }
    })


})()