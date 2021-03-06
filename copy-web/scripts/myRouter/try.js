(function() {

    // 这个模块，我自己尝试封装一个原生js模拟前端路由，
    // 实现单页面应用。

    // why?因为我做的项目是使用js或者jq写的，如果要用angularjs
    // 做单页面应用的话，没有办法引入我已经写好的js文件。
    // 这就尴尬了。所以，各种百度，终于找到了一段可以使用
    // 原生js模拟前端路由的代码，可惜，看了一个小时，也没有看
    // 明白。

    // 只能自己试着写一个对象了。


    // 首先封装一个函数，专门用来解析锚点数据，
    // 将锚点路径和url 参数分开
    function getHashData() {
        // 获取当前页面的hash值
        var hash = location.hash;

        // 去掉hash的第一个字符#
        hash = hash.slice(1);

        // 将hash中的锚点路径和参数分开
        var hashArr = hash.split('?');

        // 锚点路径就是hashArr数组中的第一项
        hashPath = hashArr[0];
        // console.log('hashArr',hashArr[1]);

        // hashArr的第二项是参数，将这个参数转换成js对象格式。
        var hashParam = {};
        var hashString = hashArr[1];

        if (hashString) {

            // 将参数字符串，用&分隔成新的数组
            hashString = hashArr[1].split('&');

            // 遍历hashString数组中的每一项遍历出来
            for (var i = 0; i < hashString.length; i++) {

                var hashItem = hashString[i].split('=');

                hashParam[hashItem[0]] = hashItem[1];

            }
        }

        // 将锚点路径和参数返回
        return {
            path: hashPath,
            queryString: hashParam
        };

    }



    // 封装一个路由对象，这个对象一旦init一个对象，
    // 就将这个路由的信息存储起来，并给这个锚点
    // 添加一个方法，只要init这个对象，就马上加载对应的js文件，
    // 在js文件被加载后，就调用这个锚点对应的回调函数。


    // 当锚点切换的时候，再次init一个对象，又加载新的js文件，
    // 新的js文件加载完后，执行回调函数。


    function Route() {

        // 这个属性专门用来存放该页面上所有的锚点路由
        this.routers = {};

        this.init();
    }

    Route.prototype = {
        constructor: Route,

        init: function() {


            // 获取了当前hash值后，开始注册事件
            var self = this;
            //页面加载匹配路由
            window.addEventListener('load', function() {
                self.urlChange();
            })
            //路由切换
            window.addEventListener('hashchange', function() {
                self.urlChange();
            })

        },

        /**
         * 1. urlChange这个方法是专门用来检测我们的锚
         * 点是否有效的.
         *
         * 2. 由于在初始化Route这个对象的时候，有多少个
         * 锚点就调用多少次mapRoute方法，目的是将所有的
         * 锚点路径都存放到routers 属性中，并异步加载对
         * 应的js文件。
         * 所以我们直接检测当前的锚点路径是否存在于
         * routers中.
         * 1) 如果存在，表示这个路径合法，之后可以根据
         * 当前的的路径名来刷新页面;
         * 2) 如果当前锚点不存在与routers中，说明这个锚点错误，
         * 不是我们需要的，可能是输入错误，也可能是故意改错，
         * 此时为了增强用户体验，将锚点错误时重定向到web首页。
         */


        urlChange: function() {

            // 获取当前页面的hash值
            var currentHash = getHashData();

            // 判断当前 hash值的锚点路径有没有在routers中
            if (this.routers[currentHash.path]) {
                // console.log('锚点正确，刷新页面');

                this.refreshPage(currentHash);
            } else {
                // 重定向到首页
                location.hash = '/index';
            }


        },
        // 定义一个专门用来刷新页面的函数
        refreshPage: function(currentHash) {

            // 这里直接执行之前通过map方法注册到
            // this.routers[currentHash.path]上的方法。
            // 其实就是异步加载js文件
            // 执行mapRoute传入的回调函数
            // console.log('执行mapRoute传入的回调函数');
            this.routers[currentHash.path].callback.call(this, currentHash);

        },

        // deferLoad方法会作为mapRoute方法的回调函数被传入
        // 此时routers中已经存好了当前的锚点路径键值对
        deferLoad: function(fileName, currentHash) {

            var self = this;
            // 加载js的时候，我们选择异步加载，
            // script标签有defer和async属性，都可以异步加载js文件。
            // 区别是：async异步加载完成后会立马执行该js文件中
            // 的代码。如果有多个文件一起执行，也是谁先加载完
            // 谁就先执行，没有顺序。

            // 但是defer不同，虽然也是异步加载，但是会等到dom节点
            // 加载完成后再执行代码。如果有多个文件一起加载，会
            // 按顺序进行异步加载，都加载完后，在dom节点也加载
            // 完后一起执行。

            // 这里我选用defer
            // 
            var _body = document.getElementsByTagName("body")[0];

            // 如果当前锚点对应的文件，之前已经被下载过了，
            // 就将之前添加到页面中的script标签删除，重新下载
            // 并添加
            if (self.routers[currentHash.path].fn) {

                var oldScripts = self.routers[currentHash.path].fn;
                for (var i = 0, len = oldScripts.length; i < len; i++) {
                    _body.removeChild(oldScripts[i]);
                }

                // 同时清空fn数组
                
                oldScripts.length = 0;
            }   




            // console.log('_body', _body);

            var scriptEle = document.createElement('script');

            scriptEle.type = 'text/javascript';
            scriptEle.src = fileName;
            scriptEle.async = true;


            // 将scriptEle添加到body末尾

            _body.appendChild(scriptEle);

            // 当js文件被加载完后，执行回调函数
            scriptEle.onload = function() {

                //为了避免重复引入js，我们需要在这里记录一下
                //已经加载过的文件


                self.routers[currentHash.path].fn.push(scriptEle);

                console.log('js文件加载完成');


            }


        },
        // 给每一个锚点注册不同的路由回调函数
        // 第一个参数是锚点路径，第二个参数是
        // 给routers对象添加了路径之后的回调函数，
        // 这个回调函数就是异步加载js文件的deferLoad方法
        mapRoute: function(hashPath, callback) {

            // 注意这个callback中，可以有dom替换页面，
            // 接着再异步请求js文件

            // 将传入的这个hashPath，也就是锚点传入对象的
            // routers属性中
            // 在此之前先将hashPath去除所有的空格
            hashPath = hashPath.replace(/\s*/g, '');

            // 给routers绑定属性，属性名就是锚点路径名；
            // 属性值就是传入的回调函数
            // 先判断是否传入了有效的回调函数
            if (callback && {}.toString.call(callback) === '[object Function]') {
                this.routers[hashPath] = {
                    callback: callback,
                    fn: [] //存储已经下载的当前锚点路径对应
                    // js文件
                };
            } else {
                console.log('该锚点没有传入有效的回调函数');
            }
        }

    }



    //将route暴露到全局
    window.Route = new Route();



})()