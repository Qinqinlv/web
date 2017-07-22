    // 获取页面元素
    var cvs = document.getElementById("cvs");
    var ctx = cvs.getContext("2d");

    // 使用seaJS的use()方法引入入口模块

    // 首先分析flappyBird所需库的关系
    /**
     * 1. 首先需要的模块是导入图片的模块imgLoad.js
     *
     * 2. 在这个imgLoad.js模块中，需要调用一个回调函数
     * 所以需要在调用该回调函数前，使用require引入draw.js模块
     *
     * 3. 在draw.js模块中，需要构建场景，此时需要引入gameScene.js
     * 模块
     *
     * 4. 在gameScene.js中需要导入各个具体的场景模块
     *
     * 5. 在draw.js模块中引入动画结束时的场景模块overScene.js
     *
     * 6. 此处的入口函数是imgLoad.js
     * 
     */


    var time = new Date().getTime();
    var version = '1.0.0'+ time;

    seajs.config({
        'map': [
            ['.js','.js?v='+version]//映射规则

        ]
    });
    console.log("'seajs'中的模块只会执行一次");
    
    seajs.use(['./scripts/flappyBird/js/imgLoad.js']);