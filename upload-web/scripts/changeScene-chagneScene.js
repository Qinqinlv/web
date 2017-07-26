(function(win){


    // 下面的这个构造函数，是对场景的封装。
    // 通过使用new关键字调用下面的构造函数，创建一个场景实例

    function CreateScene(option) {

        // 构造一个实例，需要哪些属性呢？
        // (1)场景所需要的层
        // (2)场景中的层被添加到的舞台
        // (3)场景的入场动画
        // (4)场景的出场动画
        // (5)场景的初始化函数

        this.stage = option.stage;
        this.layers = option.layers;
        this.entrance = option.entrance;
        this.departure = option.departure;
        this.init = option.init;
        // 因为场景中的内容过多，在这里如果要初始化，也只能
        // 是将层都添加到stage中。但是每一个层中可能会添加
        // 其它的对象，如果想要动态给层添加图形，就自己传入一个
        // init方法，更灵活。

        // 初始化场景 ———— 就是将所有层都添加到当前的stage中去
        this.init();

    }
    // 给CreateScene构造函数绑定一个静态属性，表示当前的是哪一个场景。
    CreateScene.currentScene = null;

    CreateScene.prototype = {
        constructor: CreateScene,
        // 初始化场景



        // 给场景添加一个play()方法，当调用这个方法的时候
        // 实现当前场景和上一个场景的动画切换。
        play: function() {

            // 当页面刚刚打开的时候，不需要事件触发，第一个场景自动
            // 调用自己的 play()方法。
            // 此时第一个场景执行的是入场动画；

            // 当页面已经打开完成，触发了事件后，当前场景调用这个play()方法
            // 的时候，要实现两个功能：
            // 上一个场景执行离场动画；
            // 当前场景执行入场动画；

            // 那么要考虑的就是当前场景到底是谁？
            // 当前场景是 ———————— 将要执行入场动画的场景。

            // 所以，当页面刚打开时，当前场景设置为null，当触发了入场动画后，
            // 这个currentScene就被设置成当前的场景。

            // 设置一个函数，执行当前场景的入场函数，并将当前场景赋值
            // 给CreateScne.currentScene。
            // 下面的函数不是该场景的方法，所以在调用的时候this指向的是
            // window，由于里面要调用当前场景的入场函数，需用到this，所以
            // 先把this的指向存储起来
            var self = this;

            function doPre() {

                // 将当前场景赋值给CreateScne.currentScene
                CreateScene.currentScene = self;
                // 将所有的层添加到stage中 ———— 
                // 这里不懂，为什么不是draw呢？
                self.layers.forEach(function(layer) {

                    layer.draw();

                })

                // 执行当前场景的入场函数
                self.entrance();


            }


            if (CreateScene.currentScene) {
                // 当前场景调用了play()方法时，这个currentScene表示
                // 还是上一个场景的值。
                // 那么刚好通过这个currentScene来执行上一个场景的出场动画；
                // 出场动画结束后的回调函数是当前场景的入场动画。
                //  ———— 当前场景的入场函数以参数的形式传给上一个场景的出场动画，
                //  做为出场动画结束后的回调函数。

                CreateScene.currentScene.departure(doPre);
            } else {

                // 当前场景为空，表示刚刚打开网页，还没有执行入场函数，
                // 所以，没有场景被加到currentScene中。
                // 执行第一个场景的入场动画，并将当前场景添加到
                // CreateScene.currentScene中。

                doPre();

            }

        }

    }

    var getCreateScene = function(option) {

        return new CreateScene(option);
    };

    win.getCreateScene = getCreateScene;







})(window)