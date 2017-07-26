(function() {




    // 该模块需要使用changeScene模块来将许多对象
    // 组合成一个场景

    var clientW = window.innerWidth;
    var clientH = window.innerHeight;

    // 当屏幕宽度 >= 768px的时候，由于需要全屏显示，
    // 所以盒子的高度要减去80px的nav高度；

    // 当屏幕宽度 < 768px的时候，由于需要全屏显示，
    // 且盒子自身有71px的margin-top，此时，盒子
    // 的高度要减去71px的高

    if(clientW >= 768){
        clientH = clientH - 80;
    }else {
        clientH = clientH - 71;
    }

    var stage = new Konva.Stage({
        container: "sceneContainer",
        width: clientW,
        height:clientH
    });


    // 设置一个变量存放我需要的场景
    var sceneBuilder = [histogramChart, ringScene, pieChart, builderSceneTextRect];

    // 设置一个变量来存放场景的索引
    var sceneIndex = 0;


    // 此处需要引入addSceneChangeEvent模块，给当前的舞台注册
    // 触摸或者鼠标移动事件








    var imgSource = {};

    // 这是需要加载的图片
    var loadImgs = [
        'light.png', 'light-color.png', 'little5.png', 'text.png'
    ];



    //执行默认的开场动画1，这个开场动画没有在scenebulder中，
    //是正式进入场景之前的加载动画
    (function() {
        builderSceneLoading().play();
    })();



    // 图片一旦加载完成就开始加载第一个场景的入场动画，
    // 并调用场景切换事件
    function LoadingComplete() {
        //开始第一个场景
        sceneBuilder[0]().play();
        // console.log(122);
        // 注册事件
        addSceneChangeEvent({
            stage: stage,
            sceneBuilder: sceneBuilder,
            sceneIndex: sceneIndex
        });
    }


    // 加载进度条
    //=============S 加载进度条场景=================
    function builderSceneLoading() {
        //切换到下一个场景
        var animateLayer = new Konva.Layer();
        // 实例化一个进度条
        var progressBar = getProgressBar({
            x: 1 / 8 * stage.width(),
            y: stage.height() / 2,
            width: 3 / 4 * stage.width(),
            height: 1 / 20 * stage.height(),
            fillStyle: "#3CB371",
            strokeStyle: " #2E8B57",
            lineWidth: 6,
            opacity: .7
        });


        // 将进度条添加入场和出场动画
        // CreatScene构造函数正是将一个普通的实例
        // 包装成一个有入场动画，也有出场动画的活动场景的。
        return getCreateScene({
            name: '场景1',
            stage: stage,
            layers: [animateLayer],
            init: function() {
                var self = this;
                // 将实例出的图形添加到对应的层中
                progressBar.addToGroupOrLayer(self.layers[0]);
                // 将该动画场景所有的层都添加到舞台上
                this.layers.forEach(function(layer) {
                    self.stage.add(layer);
                });
            },
            // 入场动画函数
            entrance: function() {
                // console.log(progressBar.group);

                progressBar.group.to({
                    opacity: 1,
                    duration: .1 //to动画运动的时间
                });


                var temp = 0;
                // 遍历需要加载的所有图片，创建对应的图片对象，
                // 将加载完毕的图片对象存放到imgSource数组中。
                loadImgs.forEach(function(val, i) {
                    // console.log(12);
                    var img = new Image();
                    img.src = './public/images/changeScene/' + val;
                    // 图片加载完后，将图片对象放到imgSource数组中
                    img.onload = function() {
                        temp++;
                        //temp记录的是已经加载好的图片的张数
                        // console.log(loadImgs[i]);
                        imgSource[loadImgs[i]] = img;
                        valueChange();
                    };
                });

                function valueChange() {
                    // console.log('temp', temp);
                    // console.log('loadImgs.length', loadImgs.length);

                    // 当前进度条的长度等于 已加载完的图片张数 / 图片总数
                    var currentProgress = Number(temp / loadImgs.length).toFixed(2);
                    // 取两位小数

                    // 调用进度条的changeValue()函数，实时根据currentProgress
                    // 的值，改变进度条的占比
                    progressBar.changeValue(currentProgress, 0.5);
                    // console.log(currentProgress);//1




                    // 执行出场动画，并调用addSceneChangeEvent事件，激活事件处理程序
                    if (currentProgress >= 1) {

                        //加载完成后，执行 后续的场景切换和事件处理

                        LoadingComplete();
                    }
                }
            },
            // 出场动画函数
            departure: function(next) {

                //离场动画
                //to动画是tween动画的简化版本。
                //最大的区别是，使用tween动画，要使用node
                //属性指定发生动画的对象。
                var tween = new Konva.Tween({
                    node: progressBar.group,
                    scaleX: 0,
                    scaleY: 0,
                    y: 0,
                    x: stage.width() / 2,
                    duration: 1,
                    opacity: 0,
                    easing: Konva.Easings.EaseIn,
                    onFinish: function() {
                        //移除这个进度条渲染到画布上的所有场景。
                        animateLayer.destroy();
                    }
                });
                // 开启tween动画
                tween.play();
                // console.log(888);

                // 这个next()就是getCreateScene动画场景中的
                // doPre()函数，这个函数中，会将当前场景(也就是马上要出现
                //     的那个场景)绑定到getCreateScene.currentScene属性上，
                // 并且执行该场景的入场动画。

                next();
            }
        });
    }
    //=============E 加载进度条场景=================










    //=============S 加载圆环场景=================

    function ringScene() {

        var animateLayer = new Konva.Layer();

        // 创建背景层
        var bgLayer = new Konva.Layer();

        // 创建光照层
        var lightLayer = new Konva.Layer();
        // 圆环的最大宽度
        ringRadius = 2 / 3 * (stage.width() > stage.height() ? stage.height() : stage.width());
        // console.log('ringRadius' , ringRadius);



        // 创建动画场景需要的素材
        var ringScene = getRingScene({
            stage: stage,
            ringRadius: ringRadius,
            cenX: -1 / 4 * stage.width(),
            opacity: .2
        });

        // 创建一张背景图片对象
        var bgImg = new Konva.Image({
            width: stage.width(),
            height: stage.height(),
            image: imgSource['light-color.png'],
            opacity: .9
        });

        // 创建一张灯光图片
        // 该背景图和舞台一样大小
        var lightImg = new Konva.Image({
            width: stage.width(),
            height: stage.height(),
            image: imgSource['light.png'],
            opacity: .1,
        });




        return getCreateScene({
            name: '场景2',
            stage: stage,
            layers: [bgLayer, lightLayer, animateLayer],
            init: function() {
                var self = this;
                // 将对象分别放入各自对应的层中
                // 方法中的this指向的是对象，但是和变量的作用域没有关系
                // 创建动画场景需要的素材
                ringScene.addToGroupOrLayer(animateLayer);
                bgLayer.add(bgImg);
                lightLayer.add(lightImg);

                this.layers.forEach(function(layer) {
                    self.stage.add(layer);
                });
            },
            // 创建圆环的入场动画
            entrance: function(data) {

                ringScene.bigGroup.to({
                    duration: .6,
                    opacity: 1,

                    x: 3 / 4 * stage.width(),
                    onFinish: function() {

                        ringScene.playAnimation(animateLayer);

                    }

                })

                // console.log(11);
                // to动画是tween动画的简化版
                var tweenLight = new Konva.Tween({
                    node: lightImg,
                    opacity: .9,
                    duration: 3,
                    yoyo: true
                    // yoyo表示循环播放
                    // onFinish: function() {
                    //  tweenLight.reverse();
                    // }
                    //  yoyo属性可以进行对动画进行播放完后，
                    //  回放当前动画，并持续循环来回切换播放。
                    //  这里的yoyo : true，和下面的回调函数等效
                });
                tweenLight.play(); //开始执行该动画
            },
            // 给柱状图绑定出场动画
            departure: function(next) {
                var self = this;

                ringScene.bigGroup.to({

                    duration: .6,
                    x: 5 / 4 * stage.width(),
                    onFinish: function() {


                        // 当前场景执行离场动画后，将该场景中的
                        // 层全部移出canvas画布
                        self.layers.forEach(function(layer) {
                            layer.destroy();
                            // getRingScene.destroy();
                        });
                        // 当前场景的离场动画结束后，
                        // 执行下一个场景的出场动画
                        // animateLayer.remove();
                        next(); //执行下一场景

                    }

                })



            }


        })



    }



    //=============E 加载圆环场景=================










    //=============S 柱状图场景===============
    function histogramChart() {
        // 创建3个层，分别装专门动画的元素，专门装静止的元素，专门装
        // 灯光效果的元素
        var animateLayer = new Konva.Layer();
        var bgLayer = new Konva.Layer();
        var lightLayer = new Konva.Layer();

        // 这是要被添加到柱状图中的数据
        var data = [{
            name: 'jQuery',
            value: .2,
            color: '#00868B'
        }, {
            name: 'Ajax',
            value: .4,
            color: '#00CED1'
        }, {
            name: 'Canvas',
            value: .1,
            color: '#4EEE94'
        }, {
            name: 'AngularJS',
            value: .1,
            color: '#66CD00'
        }, {
            name: 'NodeJS',
            value: .2,
            color: '#00CD66'
        }];

        // 初始化一个柱状图实例
        var histogram = getHistogramChart({
            data: data,
            x: 1 / 8 * stage.width(),
            y: 3 / 4 * stage.height(),
            height: stage.height() / 2,
            width: 3 / 4 * stage.width(),
            opacity: 0
        });

        // 创建一张灯光图片
        // 该背景图和舞台一样大小
        var lightImg = new Konva.Image({
            width: stage.width(),
            height: stage.height(),
            image: imgSource['light.png'],
            opacity: .1,
        });

        // 上面的那个三角形
        // 使用的是konva提供方法的自定义形状
        // 自定义形状使用 Shape 构造函数创建
        // 需要提供自定义的绘图方法 sceneFunc
        // var triangleUp = new Konva.Shape({
        //     sceneFunc: function( ctx ) {
        //         ctx.beginPath();
        //         ctx.moveTo( 0, 0 );
        //         ctx.lineTo( stage.width(), 0 );
        //         ctx.lineTo( 0, 1/4 * stage.height() );
        //         ctx.closePath();
        //         ctx.fillStyle = 'green';
        //         ctx.fill();
        //     },
        //     // 这个坐标是什么鬼？
        //     // 是图像被绘制在canvas画布上的初始坐标
        //     x: 0,
        //     y: -1/4 * stage.height(),
        //     opacity: .1
        // });



        // 创建一张背景图片对象
        var bgImg = new Konva.Image({
            width: stage.width(),
            height: stage.height(),

            image: imgSource['light-color.png'],
            opacity: .9
        });

        // 将上面的所有素材封装成有入场与出厂动画的场景
        return getCreateScene({
            name: '场景3',
            stage: stage,
            layers: [bgLayer, animateLayer, lightLayer],
            init: function() {
                var self = this;
                // 将对象分别放入各自对应的层中
                // 方法中的this指向的是对象，但是和变量的作用域没有关系
                histogram.addToGroupOrLayer(animateLayer);
                bgLayer.add(bgImg);




                lightLayer.add(lightImg);

                this.layers.forEach(function(layer) {
                    self.stage.add(layer);
                });
            },
            // 创建柱状图的入场动画
            entrance: function(data) {

                histogram.totalGroup.to({
                    duration: .001,
                    opacity: 1,
                    onFinish: function() {
                        histogram.playAnimation();
                    }
                });

                // to动画是tween动画的简化版
                var tweenLight = new Konva.Tween({
                    node: lightImg,
                    opacity: .9,
                    duration: 3,
                    yoyo: true
                    // yoyo表示循环播放
                    // onFinish: function() {
                    //  tweenLight.reverse();
                    // }
                    //  yoyo属性可以进行对动画进行播放完后，
                    //  回放当前动画，并持续循环来回切换播放。
                    //  这里的yoyo : true，和下面的回调函数等效
                });
                tweenLight.play(); //开始执行该动画
            },
            // 给柱状图绑定出场动画
            departure: function(next) {
                var self = this;

                var tween = new Konva.Tween({
                    node: histogram.totalGroup,
                    opacity: 0,
                    scaleX: 0.1,
                    scaleY: 0.1,
                    y: 0,
                    x: stage.width(),
                    duration: 1,
                    easing: Konva.Easings.EaseIn,
                    onFinish: function() {
                        // 当前场景执行离场动画后，将该场景中的
                        // 层全部移出canvas画布
                        self.layers.forEach(function(layer) {
                            layer.destroy();
                        });
                        // 当前场景的离场动画结束后，
                        // 执行下一个场景的出场动画
                        // animateLayer.remove();
                        next(); //执行下一场景
                    }
                });
                tween.play(); //执行离场动画
            }
        });
    }
    //=============E 柱状图场景===============






    //=============S 饼状图场景=================
    function pieChart() {
        var animateLayer = new Konva.Layer();
        var bgLayer = new Konva.Layer();
        var lightLayer = new Konva.Layer();
        //创建加载层动画
        //饼状图数据
        var data = [{
            name: "html5",
            value: .25,
            color: '#00C5CD'
        }, {
            name: "css3",
            value: .2,
            color: '#76EE00'
        }, {
            name: "Angular",
            value: .3,
            color: '#00CD66'
        }, {
            name: "jQuery",
            value: .05,
            color: '#00868B'
        }, {
            name: "Ajax",
            value: .1,
            color: '#00CD00'
        }, {
            name: "Node",
            value: .1,
            color: '#AEEEEE'
        }];

        //创建饼状图
        //取屏幕宽高中值较小的那个
        var maxSize = stage.width() > stage.height() ? stage.height() : stage.width();

        // 实例化一个饼状图
        var pieChart = getPieChart({
            data: data, //扇形区域的数据
            animateDuration: 1, //扇形动画的时间
            easing: Konva.Easings.EaseIn, //扇形动画的速度规格
            x: 0,
            y: stage.height() / 2,
            opacity: 0,
            radius: .28 * maxSize, //半径
            textDistance: .2 * .3 * maxSize //扇形上的文字的距离圆形的距离
        });

        //创建光照
        var lightImg = new Konva.Image({
            width: stage.width(),
            height: stage.height(),
            image: imgSource['light.png'],
            opacity: .1
        });


        var bgImg = new Konva.Image({
            width: stage.width(),
            height: stage.height(),
            image: imgSource['light-color.png'],
            opacity: .9
        });

        return getCreateScene({
            name: '饼状图场景',
            stage: stage,
            layers: [bgLayer, animateLayer, lightLayer],
            init: function() {

                bgLayer.add(bgImg);




                lightLayer.add(lightImg);

                pieChart.addToGroupOrLayer(animateLayer);
                var self = this;

                this.layers.forEach(function(layer) {
                    self.stage.add(layer);
                });
            },
            entrance: function() {


                var tweenLight = new Konva.Tween({
                    node: lightImg,
                    opacity: .9,
                    duration: 3,
                    yoyo: true
                    // onFinish: function() {
                    //  tweenLight.reverse();
                    // }
                });
                tweenLight.play();

                pieChart.group.to({
                    x: stage.width() / 2,
                    duration: .6,
                    opacity: .9,
                    onFinish: function() {
                        // console.log('gun');
                        pieChart.playAnimate();
                    }
                });
            },
            departure: function(next) {
                var self = this;

                var tween = new Konva.Tween({
                    node: pieChart.group,
                    opacity: 0,
                    scaleX: 0.1,
                    scaleY: 0.1,
                    y: 0,
                    x: stage.width() / 2,
                    duration: .6,
                    easing: Konva.Easings.EaseIn,
                    onFinish: function() {
                        // animateLayer.remove();
                        self.layers.forEach(function(layer) {
                            layer.destroy();
                        });
                        next(); //执行下一场景
                    }
                });
                tween.play();
            }
        });
    }

    //=============E 饼状图场景=================







    //=============S 文字图片说明场景=================
    function builderSceneTextRect() {
        var animateLayer = new Konva.Layer();
        var bgLayer = new Konva.Layer();

        //创建加载层动画
        //饼状图数据
        var data = [];



        //创建背景
        var bgImg = new Konva.Image({
            width: stage.width(),
            height: stage.height(),
            image: imgSource['light-color.png'],
            opacity: .9
        });

        //创建文本
        var txtRect = new Konva.Text({
            x: 0,
            y: 1 / 10 * stage.height(),
            text: '微信场景转换动画',
            fontSize: (stage.width() < 500 ? 20 : 24),
            fontFamily: '微软雅黑',
            fill: '#333',
            width: 1 / 2 * stage.width(),
            align: 'center',
        });

        //创建文本矩形
        var textBoxRect = new Konva.Rect({
            x: 0,
            y: 0,
            height: 1 / 4 * stage.height(),
            width: 1 / 2 * stage.width(),
            stroke: 'gole', //设置描边颜色
            strokeWidth: 5,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2,
            cornerRadius: 10
        });

        // 创建一个组，包裹文字矩形
        var txtGroup = new Konva.Group({
            x: stage.width(),
            y: stage.height(),
            scaleX: .7,
            scaleY: .7
        });
        txtGroup.add(textBoxRect);
        txtGroup.add(txtRect);

        //创建canvas 背景组
        var imgGroup = new Konva.Group({
            x: 0,
            y: 0
        });

        //创建canvas图片
        var imgCanvas = new Konva.Image({
            image: imgSource['text.png'],
            width: 1 / 8 * stage.width(),
            height: 1 / 8 * stage.width(),
            x: 10,
            scaleX: .5,
            scaleY: .5,
            y: -(1 / 5 * stage.width()),
            opacity: .9
        });
        imgGroup.add(imgCanvas);

        var imgLogo = new Konva.Image({
            image: imgSource['little5.png'],
            width: 2 / 3 * stage.width(), //高度没有设置，会等比例缩放
            x: 5 / 4 * stage.width(),
            y: 1 / 9 * stage.height(),


        });
        imgGroup.add(imgLogo);

        //返回一个场景对象
        return getCreateScene({
            name: '文字场景',
            stage: stage,
            layers: [bgLayer, animateLayer],
            init: function() {
                bgLayer.add(bgImg);
                animateLayer.add(txtGroup);
                animateLayer.add(imgGroup);

                var self = this;
                this.layers.forEach(function(layer) {
                    self.stage.add(layer);
                });
            },
            // 出场动画
            entrance: function() {
                var tween = new Konva.Tween({
                    node: txtGroup,
                    opacity: .9,
                    x: 1 / 4 * stage.width(),
                    y: 2 / 3 * stage.height(),
                    duration: 1,
                    scaleX: 1,
                    scaleY: 1,
                    opacity: .5,
                    easing: Konva.Easings.EaseIn,
                    onFinish: function() {}
                });
                tween.play();


                imgLogo.to({
                    x: 1 / 6 * stage.width(),
                    scaleX: 1.2,

                    opacity: .6,
                    duration: .8,
                    easing: Konva.Easings.EaseOut
                });
                imgCanvas.to({
                    y: (1 / 8 * stage.width()),
                    scaleX: .8,
                    scaleY: .8,
                    opacity: .6,
                    duration: .8,
                    easing: Konva.Easings.EaseOut,
                    yoyo: true
                });
            },
            // 出场动画
            departure: function(next) {
                var self = this;
                imgLogo.to({
                    x: 5 / 4 * stage.width(),
                    scaleX: .5,
                    scaleY: .5,
                    opacity: .4,
                    duration: .6,
                    easing: Konva.Easings.EaseOut
                });
                imgCanvas.to({
                    y: -(1 / 8 * stage.width()),
                    scaleX: .5,
                    scaleY: .5,
                    opacity: .5,
                    duration: .6,
                    easing: Konva.Easings.EaseOut
                    // yoyo: true
                });

                var tween = new Konva.Tween({
                    node: txtGroup,
                    opacity: 0,
                    scaleX: 0.1,
                    scaleY: 0.1,
                    y: 0,
                    x: stage.width() / 2,
                    duration: .6,
                    easing: Konva.Easings.EaseIn,
                    onFinish: function() {
                        // animateLayer.remove();
                        self.layers.forEach(function(layer) {
                            layer.destroy();
                        });
                        next(); //执行下一场景
                    }
                });
                tween.play();
            }
        });
    }
    //=============E 文字场景=================







})()