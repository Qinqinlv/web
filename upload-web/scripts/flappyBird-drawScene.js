
    var cvs = document.getElementById("cvs");

    var ctx = cvs.getContext("2d");






    imgLoad({
        'bird': './public/images/flappyBird/bird.png',
        'land': './public/images/flappyBird/land.png',
        'pipeDown': './public/images/flappyBird/pipeDown.png',
        'pipeUp': './public/images/flappyBird/pipeUp.png',
        'sky': './public/images/flappyBird/sky.png'
    }, draw);





function draw(imgObj) {

    // 重置画布大小
    // 当屏幕>=992，画布大小为imgObj.sky.width
    // 和imgObj.sky.height；
    // 当屏幕在768-992之间的时候，80%宽高；
    // 当屏幕<768时，100%宽高


    var clientW = $(window).width();

    // console.log('clientW' , clientW);
    
    var clientH = $(window).height();

    var scalePage = 1;

    if (clientW >= 992) {
        scalePage = 1;

        cvs.width = clientW;
        cvs.height = clientH - 80;

    } else if (clientW >= 768) {
        scalePage = .8;
        cvs.width = clientW;
        cvs.height = clientH - 80;
    } else if (clientW >= 450) {
        scalePage = .6;
        cvs.width = clientW;
        cvs.height = clientH - 71;
    } else {
        scalePage = .5;
        cvs.width = clientW;
        cvs.height = clientH - 71;
    }




    // cvs.width = imgObj.sky.width;
    // cvs.height = imgObj.sky.height;


    // 这里创建的时候游戏开始时候的场景
    var gameScene = getGameScene({
        ctx: ctx,
        imgObj: imgObj,
        scale: scalePage
    });

    // 创建游戏结束的场景
    var overScene = getOverScene(ctx);


    // 由于开发游戏的所有代码都写在 draw() 函数中， 所以， 对于这个函数体中的代码而言draw() 函数是主函数。

    // 下面的timer中， 主函数需要判断小鸟是否死亡， 如果小鸟死亡， 主函数就会
    // 将游戏结束的场景overScene渲染到canvas画布中。
    // 但是这种判断小鸟有没有死亡的事情， draw() 函数不想做了，


    // 于是它把gameScene叫过来交代了一个任务：

    // “ gameScene啊， 你说我多累啊， 要创建一个定时器， 不停地把你和overScene渲染到页面， 还得在每次开启定时器的时候判断一下小鸟死没死。

    // 这很无趣啊~~现在我不想每次都去检查小鸟死没死了， 就交给你去做了。

    // 我给你一个锦囊， 你用监听者独有的addListener方法接收啊。
    // 我每次开启定时器把你渲染到canvas中去的时候， 你就马上监听一下， 各种打听， 看那个小鸟死没有， 如果小鸟死了， 你就把我交给你的锦囊打开。
    // 其它的事情你也不用操心， 只需要把锦囊打开（ 其实就是函数调用）， 就没你什么事了。

    // ”


    // gameScene接到了大boss的命令， 怎敢不执行， 所以， gameScene马上就着手准备当一个监听者需要准备的行头。
    // gameScene马上就给自己添加了一个addListener() 方法，还有一个专门用于存放
    // boss给的锦囊的变量listeners(可以是数组，也可以是对象)， 专门用于存放大boss给的锦囊。
    // 再给自己添加一个triggerBirdOver()方法，专门用来打开锦囊。

    // 接着gameScene就在自己每次被渲染到页面的时候， 各种打听小鸟的死亡状态。
    // 一旦打听到小鸟死亡了， 马上使用triggerBirdOver()方法把锦囊打开。

    // 由于gameScene表现突出， 大boss draw() 函数深刻的表扬了 gameScene， 表示以后只要有
    // 监听者的活计， 第一时间就交给gameScene去做。 gameScene一听， 瞬间， 感激涕零~~~


    // 定义一个变量，表示游戏是否结束，默认是true，如果游戏结束了，那么该变量就是false。
    // 其实这种以true和false来监听某种状态的方式，也是简单的监听者模式呢，哈哈~~
    var isRun = true;





    // 这里，我需要记录小鸟从一开始运动，到运动结束的时间
    // 获取当前的毫秒数
    var startTime = new Date().getTime();
    // 总共花费的时间
    var costTime = '';


    gameScene.addListener(function() {

        // 如果执行该回调函数，说明小鸟已经死了，游戏结束，
        // isRun的值变成false
        isRun = false;

        // 此时，获取运动结束后的时间
        var costTimeSec = 0;
        var costTimeMini = 0;
        var costTimeHoure = 0;

        var overTime = new Date().getTime();

        var pastTime = (overTime - startTime) / 1000;
        // console.log('pastTime', pastTime);



        // 花费的秒数
        costTimeSec = parseInt(pastTime % 60);
        costTimeSec = costTimeSec > 9 ? costTimeSec : '0' + costTimeSec;

        // 花费的分钟数
        costTimeMini = parseInt(pastTime / 60 % 60);
        costTimeMini = costTimeMini > 9 ? costTimeMini : '0' + costTimeMini;


        // 花费的小时数
        costTimeHoure = parseInt(pastTime / 3600);
        costTimeHoure = costTimeHoure > 9 ? costTimeHoure : '0' + costTimeHoure;


        // 所以花费的总时间写成字符串表示如下：
        costTime = '用时：' + costTimeHoure + '小时' + costTimeMini + '分钟' + costTimeSec + '秒';


        overScene.render(costTime);
        //为什么这句代码执行了，但是却没有将场景描绘出来呢？


    });



    // 动画帧函数requestAnimationFrame()其实就和setTimeout()一样，只不过，
    // requestAnimationFrame()只需要传递回调函数即可，不需要传递时间，
    // 因为时间是由浏览器来控制的。此时动画的性能就和计算机的性能以及
    // 浏览器的工作负荷相关。

    // 使用requestAnimationFrame()的时候，需要自己写一个递归调用的函数。
    // 这个递归调用的函数就是requestAnimationFrame()的回调函数。






    // 使用一个自调用函数来实现递归调用
    (function run() {

        // 将游戏场景渲染到canvas画布中

        gameScene.render(startTime);
        // 当游戏结束的时候停止渲染画面

        if (isRun) {

            requestAnimationFrame(run);

        }

    }());







}