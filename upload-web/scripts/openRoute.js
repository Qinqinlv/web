// 在这个模块中初始化路由信息

// 遇到一个问题：
// 使用seajs模块化开发，我模拟前端路由异步加载js文件
// 的时候，如果第一次打开页面，由于seajs需要的js文件没有，所以，
// 浏览器会给我们加载所需的js文件，js被下载之后马上被解析，
// 此时会有动画的产生。

// 问题是：当我第二次我再次加载seajs入口文件的时候，
// 由于之前seajs依赖的js文件已经存在，所以此时不会再去下载
// seajs需要的文件。那么就算我替换了页面上了html数据，
// 但是由于不会再次执行js代码，所以，动画不会出现。

// 这又怎么办呢？
var myRoute = Route;

// 下面是首页数据
var homeFiles = [
        './scripts/ringSceneRoute-ringFn.js',
        './scripts/ringSceneRoute-ringScene.js',
        './scripts/ringSceneRoute-gameScene.js',
    ];



myRoute.mapRoute('/index', homeFiles ,function(currentHash) {
    // console.log('FlappyBird,这个回调只会执行几次呢？');


    // 替换页面html内容
    var pageBody = document.getElementById("pageBody");
    
    // 使用ajax请求主页面中的内容
    $.ajax({
        type : 'post',
        url : './views/main.html',
        success : function(data){
            // 将请求回来的数据添加到pageBody中
            pageBody.innerHTML = data;
            myRoute.deferLoad(currentHash);
        }
    })

});





// 下面是flappyBird锚点数据
  var flappyFiles = [
        './scripts/flappyBird-imgLoad.js',
        './scripts/flappyBird-sky.js',
        './scripts/flappyBird-land.js',
        './scripts/flappyBird-pipe.js',
        './scripts/flappyBird-bird.js',
        './scripts/flappyBird-gameScene.js',
        './scripts/flappyBird-overScene.js',
        './scripts/flappyBird-drawScene.js',

    ];



myRoute.mapRoute('/FlappyBird', flappyFiles ,function(currentHash) {
    // console.log('FlappyBird,这个回调只会执行几次呢？');


    // 替换页面html内容
    var pageBody = document.getElementById("pageBody");
    pageBody.innerHTML = '<canvas id="cvs"></canvas>';
    myRoute.deferLoad(currentHash);

});



// 下面是Scene锚点数据
 var sceneFiles = ['./scripts/changeScene-chagneScene.js',
        './scripts/changeScene-histogramChart.js',
        './scripts/changeScene-pieChart.js',
        './scripts/changeScene-progressBar.js',
        './scripts/changeScene-ringFn.js',
        './scripts/changeScene-ringSecnePlus.js',
        './scripts/changeScene-addSceneChangeEvent.js',
        './scripts/changeScene-gameScenePlus.js'
    ];

myRoute.mapRoute('/Scene', sceneFiles ,function(currentHash) {



    var pageBody = document.getElementById("pageBody");
    pageBody.innerHTML = '<div id="sceneContainer"></div>';

    myRoute.deferLoad(currentHash);

});



// 下面是waterfall数据

var waterfallFiles = [
    './scripts/waterfallPlus.js',
    
    
];

myRoute.mapRoute('/Waterfall', waterfallFiles ,function(currentHash) {

    var pageBody = document.getElementById("pageBody");

    // 这个是瀑布流页面，由于页面内容多，所以，
    // 这里使用ajax请求页面
    $.ajax({
        type : 'post',
        url : './views/waterfall.html',
        success : function(data){
            // 将请求回来的数据添加到pageBody中
            pageBody.innerHTML = data;
            setTimeout(function(){
                myRoute.deferLoad(currentHash);
                
            },150);
        },
        async : false
    })
    


});



// 下面是轮播图的数据

// 这是主轮播图的数据
var carouselFiles = [
    './scripts/css3Carousel2.js',
    './scripts/floatNav.js'
    
];

myRoute.mapRoute('/Carousel', carouselFiles ,function(currentHash) {

    var pageBody = document.getElementById("pageBody");

    // 这个是瀑布流页面，由于页面内容多，所以，
    // 这里使用ajax请求页面
    $.ajax({
        type : 'post',
        url : './views/css3Carousel2-6.html',
        success : function(data){
            // 将请求回来的数据添加到pageBody中
            pageBody.innerHTML = data;
            myRoute.deferLoad(currentHash);
        },
        // async : false
    })
    


});




// 这是第二个轮播图css3Carousel1-4的数据
var carouselCss2 = [
    './scripts/css3Carousel1.js',
    './scripts/floatNav.js'
    
];

myRoute.mapRoute('/Carousel2', carouselCss2 ,function(currentHash) {

    var pageBody = document.getElementById("pageBody");

    // 这个是瀑布流页面，由于页面内容多，所以，
    // 这里使用ajax请求页面
    $.ajax({
        type : 'post',
        url : './views/css3Carousel1-4.html',
        success : function(data){
            // 将请求回来的数据添加到pageBody中
            pageBody.innerHTML = data;
            myRoute.deferLoad(currentHash);
        },
        // async : false
    })
    


});




// 这是第3个轮播图carouselJS1-6的数据
var carouselJS1 = [
    './scripts/carouselJS1-animate.js',
    './scripts/carouselJS1.js',
    './scripts/floatNav.js'
    
];

myRoute.mapRoute('/Carousel3', carouselJS1 ,function(currentHash) {

    var pageBody = document.getElementById("pageBody");

    // 这个是瀑布流页面，由于页面内容多，所以，
    // 这里使用ajax请求页面
    $.ajax({
        type : 'post',
        url : './views/carouselJS1-6.html',
        success : function(data){
            // 将请求回来的数据添加到pageBody中
            pageBody.innerHTML = data;
            myRoute.deferLoad(currentHash);
        },
        // async : false
    })
    


});



// 这是第4个轮播图carouselJS2-5的数据
var carouselJS2 = [
    './scripts/carouselJS2.js',
    './scripts/floatNav.js'
];

myRoute.mapRoute('/Carousel4', carouselJS2 ,function(currentHash) {

    var pageBody = document.getElementById("pageBody");

    // 这个是瀑布流页面，由于页面内容多，所以，
    // 这里使用ajax请求页面
    $.ajax({
        type : 'post',
        url : './views/carouselJS2-5.html',
        success : function(data){
            // 将请求回来的数据添加到pageBody中
            pageBody.innerHTML = data;
            myRoute.deferLoad(currentHash);
        },
        // async : false
    })
    


});




// 这是轮播图中第5个，图片的显示和隐藏与
// 鼠标进入、离开的方向有关
var mouseInOrOut = [
    './scripts/mouseInOrOut.js',
    './scripts/floatNav.js'
];

myRoute.mapRoute('/Carousel5', mouseInOrOut ,function(currentHash) {

    var pageBody = document.getElementById("pageBody");

    // 这个是瀑布流页面，由于页面内容多，所以，
    // 这里使用ajax请求页面
    $.ajax({
        type : 'post',
        url : './views/mouseInOrOut.html',
        success : function(data){
            // 将请求回来的数据添加到pageBody中
            pageBody.innerHTML = data;
            myRoute.deferLoad(currentHash);
        },
        // async : false
    })
    


});
