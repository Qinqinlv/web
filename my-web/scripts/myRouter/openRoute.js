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


Route.mapRoute('/FlappyBird', function(currentHash) {
    // console.log('FlappyBird,这个回调只会执行几次呢？');

  
        // 替换页面html内容
        var pageBody = document.getElementById("pageBody");
        pageBody.innerHTML = '<canvas id="cvs" width="800" height="800"></canvas>';



    // 异步加载对应的js文件
    var files = [
        './scripts/flappyBird/js/imgLoad.js',
        './scripts/flappyBird/js/sky.js',
        './scripts/flappyBird/js/land.js',
        './scripts/flappyBird/js/pipe.js',
        './scripts/flappyBird/js/bird.js',
        './scripts/flappyBird/js/gameScene.js',
        './scripts/flappyBird/js/overScene.js',
        './scripts/flappyBird/js/draw.js',
 		'./scripts/flappyBird/js/openWay.js',

    ];

    Route.deferLoad(files, currentHash)

});

Route.mapRoute('/Scene', function(currentHash) {

  

        var pageBody = document.getElementById("pageBody");
        pageBody.innerHTML = '<div id="sceneContainer"></div>';
 

    Route.deferLoad('./scripts/changeScene/useSea.js', currentHash)

});

// 	Route.mapRoute('/Scene',function(currentHash){
// 		var pageBody = document.getElementById("pageBody");
// pageBody.innerHTML = '<div id="container"></div>';

//     Route.deferLoad('../changeScene/useSea.js',currentHash)
// 	});


Route.init();