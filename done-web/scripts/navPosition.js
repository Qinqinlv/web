(function() {

    // 这个模块处理的是导航栏是否固定定位。

    /**
     *  需求：
     *  当屏幕宽度 > 768px的时候，没有固定定位，也就是
     *  nav最外层大盒子上不加navbar-fixed-top类。
     *
     *  如果屏幕 <= 768px的时候，有固定定位，也就是nav
     *  最外层盒子上加上navbar-fixed-top类。
     */




    /**
     * 思路：
     * 1. 页面一打开，先判断屏幕宽度，如果宽度
     * > 768,则不加类；如果宽度<=768，则加上类。
     * 
     * 2. 给window绑定resize事件，通过定时器优化。
     * 如果检测到屏幕宽度 > 768,则删除该类；
     * 如果宽度 <= 768,则添加该类。
     * 
     */

    // 获取nav大盒子
    var $navBox = $('#navParent');

    var $clientWidth = '';

    var resizeTimer = null;

    var doResize = false;



    $(window).on('resize', function() {

        // clearInterval(resizeTimer);

        if (!doResize) {

            doResize = true;

            resizeTimer = setTimeout(function() {

                $clientWidth = $(window).innerWidth();

                // console.log('$clientWidth',$clientWidth);

                if ($clientWidth <= 768) {

                    $navBox.addClass('navbar-fixed-top');

                } else {

                    $navBox.removeClass('navbar-fixed-top');

                }

                doResize = false;
                // console.log(777);

            }, 100);



        }


    })


    $(window).resize();


})()