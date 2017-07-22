(function() {

    // 需求：
    // 1. 这个模块用于在汉堡菜单被下拉展示了子菜单后，
    // 在移动端，如果我们用手在子菜单中滑动，向上滑动，
    // 只要滑动距离大于50px，就触发汉堡菜单的click()事件。让子菜单
    // 收回去。

    // 2. 在pc端，只要在打开汉堡菜单的时候，只要页面滚动，不管触发滚动的是鼠标
    // 拉动纵向滚动条，还是使用鼠标滚轮，这个子菜单均收回去


    // 3. 当页面滚动的时候，如果scrollTop的高度大于1.5个屏幕高度，那么
    // 第一个导航条的样式就变成another-style类的样式。
    // 当页面滚动的高度  <= 1.5个屏幕高度的时候，第一个导航条的样式变成
    // first-nav的样式


    // 4. 注意：在注册滚动事件的时候，一旦页面滚动，就会不停触发scroll事件。
    // 此时为了优化性能，给scroll的回调函数用定时器包裹。
    // 这样，一旦触发了滚动事件，回调函数会在一段时间之后才调用。
    // 在这段时间里，就算再次触发了滚动事件，也不会执行。


    // 5. 当页面变成786px及以下的时候，汉堡菜单打开的子菜单变成绝对定位。
    // 这样，当我们点击汉堡菜单展示子菜单的时候，子菜单才不会将
    // 页面中的其它内容推下去。(这个写在navPosition.js中)


    // 6. 当点击了汉堡菜单之后，汉堡菜单就马上收起来






    /**
     * 需求1思路：
     * 1. 获取到汉堡菜单下面的子菜单
     * 2. 给这个子菜单添加事件：
     * 在移动端是touch事件,在移动端是
     * touchstart,touchmove,touchend
     * 3. 设置初始值为0，当鼠标或手移动了超过50px的时候，
     * 就触发汉堡菜单的点击事件。
     * 
     */

    // 获取到汉堡菜单下面的子菜单
    var $secondNav = $('#secondNav');
    // 获取汉堡菜单 
    var $hanbao = $('#hanbao');

    // 获取brand商标中3个小圆所在的id
    var $littleBox = $('#littleBox');

    // 获取屏幕的视口高度
    var $clientH = $(window).height();

    // 获取第一个菜单栏
    var $firstNav = $('#firstNav');

    // 获取最大的nav标签包裹的导航栏盒子navParent
    var $navParent = $("#navParent");


    // 设置位移初始值为0
    var startY = 0;
    var endY = 0;

    // 鼠标或者手第一次点下去时候的坐标
    $secondNav.on("touchstart", function(e) {
        e.stopPropagation();

        startY = e.originalEvent.touches[0].screenY;

    })




    // 鼠标或者手移动中不停变化的坐标

    $secondNav.on("touchmove", function(e) {

        e.stopPropagation();

        endY = e.originalEvent.touches[0].screenY;

    })


    // 鼠标或者手指离开屏幕时候，比较startY和endY的值，
    // 如果值> 50px，则触发汉堡菜单的click事件。
    $secondNav.on("touchend", function(e) {


        var distance = startY - endY;

        // console.log('dis:', distance);

        if (distance > 50) {

            $hanbao.click();

        }


    })



    /**
     * 需求2思路：
     * 1. 给document添加滚动事件onscroll，当显示汉堡菜单的子菜单时，
     * 如果页面滚动，则触发汉堡菜单的click事件；
     * 
     * 2. 这里和上面滑动页面不同，这里一定要先显示出子菜单，
     * 接着再滚动页面才有效；如果子菜单本来就没有显示，但是页面却
     * 滚动，是不可以触发汉堡菜单的click事件的。
     * 
     * 3. 怎么判断子菜单已经显示出来了呢？
     * 判断的是和汉堡菜单id对应的，即myNav的类名中，有没有in这个类名。
     * 
     * 4. 判断某个元素有没有某个类名，可以有两种方式：
     * 1) 使用h5提供的classList属性
     * 2） 使用jQuery的hasClass方法
     * 这里采用jQuery的hasClass方法
     */

    // 遇到一个问题：
    // 到底什么时候才检测有无类名呢？



    // 获取到汉堡菜单id对应的盒子
    var myNav = $('#myNav');

    var hasIn = false;


    /**
     * 需求4思路:
     *  使用定时器将滚动事件包裹起来
     */
    //
    var scrollActive = false;
    var timer = null;


    // 给window添加滚动事件onscroll
    $(window).scroll(function(e) {

        // clearTimeout(timer);

        // 当发生滚动事件的时候，如果检测到scrollActive值为false，
        // 说明前面没有其他的定时器阻塞，现在可以新建一个定时器并触发
        // 回调函数。
        // 如果值为true,表示前面有定时器正在运行，此时scroll事件不执行任何代码

        if (!scrollActive) {

            scrollActive = true;

            timer = setTimeout(function() {

                // 判断myNav的类名中，有没有in类名 
                hasIn = myNav.hasClass('in');

                // 如果有该类名，则说明子菜单是显示着的，此时，
                // 当页面滚动的时候，触发汉堡菜单的click事件 
                if (hasIn) {
                    // 在打开了子菜单后，如果触发了浏览器的滚动事件，
                    // 就收回子菜单，即触发汉堡菜单的click事件



                    $hanbao.click();
                }

                changeNavStyle();

                scrollActive = false;

            }, 100);



        }



    })




    /**
     * 需求3思路：只改PC端
     * 1. 需要监听window.onscroll事件，
     * 使用scrollTop属性检测高度；
     *
     * 2. 当高度超过1个clienHeight的时候，
     * 就将第一个导航菜单的样式改成another-style的样式，并且
     * 导航栏绝对定位
     *
     * 3. 当高度 <= 1个clienHeight的时候，就将第一个导航栏
     * 菜单的样式改成first-nav
     */

    function changeNavStyle() {

        // 先判断该屏幕是否是pC，这里，直接借鉴Bootstrap的小屏幕
        // 宽度，这里是768px
        if ($(document).width() > 768) {


            // 获取当前的scrollTop值
            var $scrollT = $(document).scrollTop();


            if ($scrollT > $clientH - 90) {
                // console.log(666);

                // 将navParent设置成固定定位
                $navParent.addClass('navbar-fixed-top');

                // 将brand商标中的3个小圆设置成display:none
                $littleBox.css('display', 'none');

                $firstNav.removeClass('first-nav').addClass('another-style');


            } else {
                // 将navParent设置成relative定位
                $navParent.removeClass('navbar-fixed-top');

                // 将brand商标中的3个小圆设置成display:block
                $littleBox.css('display', 'block');

                $firstNav.removeClass('another-style').addClass('first-nav');

            }

        }
    }


    // 6. 当点击了汉堡菜单之后，汉堡菜单就马上收起来
    // 给该列表项注册点击事件，只要点击了这个列表项，
    // 就触发汉堡菜单的click事件，列表项被收起
    $secondNav.on('click', function() {


        $hanbao.click();

    })

})()