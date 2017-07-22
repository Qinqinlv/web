
  var time = new Date().getTime();
    var version = '1.0.0'+ time;

    seajs.config({
        'map': [
            ['.js','.js?v='+version]//映射规则

        ]
    });
 seajs.use('./scripts/changeScene/gameScenePlus.js');
 console.log('sea.js中的模块只会加载一次');