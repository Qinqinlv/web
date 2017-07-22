(function(win){



    /**
     * Created by Administrator on 2017/5/13.
     */
    function PieChart(option) {
        this._init(option);
    }

    PieChart.prototype = {

        _init: function(option) {
            //定义饼状图的属性和初始化对象实例


            this.x = option.x || 0; //绘制楔形的原点坐标
            this.y = option.y || 0;
            this.opacity = (option.opacity >= 0 && option.opacity <= 1) ? option.opacity : 1;
            this.radius = option.radius || 0; //绘制楔形的半径
            this.rotation = option.rotation || 0;
            this.data = option.data || {}; // 绘制楔形需要的数据
            this.tempAngle = option.tempAngle || 0;
            // 这是让第一个楔形绘制的起始坐标位置
            this.textDistance = option.textDistance || 20;
            //文字距离楔形弧的距离
            this.animateDuration = option.animateDuration || 2;
            //动画运行的时间
            //扇形动画运动速度曲线
            this.easing = option.easing || Konva.Easings.EaseIn;

            //定义一个组，将绘制好的圆饼图放在一个大组中
            this.group = new Konva.Group({
                x: this.x,
                y: this.y,
                opacity: this.opacity
            });

            //定义一个专门装饼状图的组
            this.wedgeGroup = new Konva.Group({
                x: 0,
                y: 0
            });

            //定义一个专门装文本的组
            this.textGroup = new Konva.Group({
                x: 0,
                y: 0
            });

            this.group.add(this.wedgeGroup);
            this.group.add(this.textGroup);


            //第一步：根据数据，将楔形绘制出来

            //由于下面遍历数组的时候要使用到this对象，需要将this保存起来
            var self = this;
            var tempAngle = this.tempAngle;
            var radius = this.radius;

            this.data.forEach(function(item, index) {

                //        绘制楔形
                var angle = item.value * 360;

                var wedge = new Konva.Wedge({
                    x: 0,
                    y: 0,
                    radius: radius,
                    angle: angle,
                    fill: item.color,
                    rotation: tempAngle
                });

                //将wedge添加到组中
                self.wedgeGroup.add(wedge);


                //第二步：根据给定数据，给每一个楔形添加文本

                var textAngle = tempAngle + 1 / 2 * angle;

                var text = new Konva.Text({

                    x: 0 + (radius + self.textDistance) * Math.cos(Math.PI / 180 * textAngle),
                    y: 0 + (radius + self.textDistance) * Math.sin(Math.PI / 180 * textAngle),
                    text: item.name + " " + item.value * 100 + "%",
                    fill: item.color
                })


                //让两边文字距离楔形弧距离一致：
                if (textAngle > 90 && textAngle < 270) {
                    text.x(text.x() - text.getWidth());
                }

                //将文字添加到组中
                self.textGroup.add(text);


                tempAngle += angle;

            })

            this._animateIndex = 0;
            //设置一个表示索引的属性。之所以设置成属性是
            //方便第二个动画函数调用。

        },
        //将上面初始化完成的组添加到父级的组或者层中
        addToGroupOrLayer: function(arg) {
            arg.add(this.group);
        },

        //第三步：给楔形添加动画

        animatePie: function() {

            //需求：当第一个楔形绘制完毕后，下一个楔形开始绘制，依次类推
            //方法：使用递归
            //    步骤1：首先获取所有的楔形
            //    步骤2：给楔形添加to动画
            //    步骤3：使用递归函数，当一个楔形动画执行后才开始下一个楔形的动画


            //    步骤1：首先获取所有的楔形
            var wedges = this.group.find("Wedge");
            //    先将所有楔形隐藏，隐藏的方式是将楔形的angle设置成0，
            //    这样扇形连角度都没有，就不能显示出来了。
            wedges.forEach(function(item, index) {
                item.angle(0);
            })


            //    步骤2：给楔形添加to动画

            var index = 0; // 设置起始索引值，便于之后递归调用


            var wedgeAnimate = function() {
                var item = wedges[index];

                //        给递归函数添加结束循环的条件
                if (index >= wedges.length) {
                    return;
                }


                item.to({
                    angle: this.data[index].value * 360,
                    //        如果dration设置固定的时间，那么占比小的楔形和占比大的楔形运动一样的时间，占比小的速度就会比占比大的慢很多。
                    //    所以，如果想每个元素速度都相同，那运动的时间和角度所占的比例相等
                    duration: this.data[index].value * this.animateDuration,

                    easing: this.easing,

                    //    步骤3：使用递归函数，当一个楔形动画执行后才开始下一个楔形的动画
                    onFinish: function() {
                            index++;

                            //            前一个元素运动结束后进入这个函数中，首先是index自增；
                            //            接下来调用外面的父函数。

                            wedgeAnimate();

                        }
                        //onFinish是一个回调函数，当前元素执行完to动画后才会调用该函数
                })


            }


            wedgeAnimate();


        },

        //上面的执行动画的代码是完全copy的面向过程中的代码
        //    如果自己写一个，怎么将里面的值替换呢？
        playAnimate: function() {

            //第一步：获取所有的wedge楔形
            var wedges = this.wedgeGroup.getChildren();

            //第二步：给第一个绑定to动画，并在to动画中使用递归。
            // ———— 实现的效果就是当第一个楔形动画结束之后才开始第二个 。。。 
            // 依次类推，都是上一个执行完动画，下一个才开始执行动画


            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~``

            //在动画开始执行之前，将每一个楔形的角度设成0，这样，每一个楔形运动的时候，都是从0开始运动到angle角度。
            //如果不先将角度设置为0，那么每一个楔形在运动前就是angle角度宽，开始运动时，angle会瞬间变成0，然后从0变成angle.
            //wedges.forEach(function(item , index){
            //    item.angle(0);
            //});
            //这里不能将上面的代码写在这里，因为每一次递归调用，这行代码都会被执行。带来来的结果就是图片动画后马上就消失了。

            //我们想要的效果是，当调用该函数的时候，楔形的角度只被清空一次。
            //怎么破？

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            //每次调用这个运动函数的时候，索引值this,_animateIndex必定是从0开始递增。那么，每当索引值为0的时候，
            //就清空所有楔形的angle；索引为其它值的时候，不清空。
            if (this._animateIndex == 0) {
                wedges.forEach(function(item, index) {
                    item.angle(0);
                })
            }

            // 获取当前索引值对应的楔形
            var item = wedges[this._animateIndex];

            //先保存this
            var self = this;

            item.to({
                angle: self.data[self._animateIndex].value * 360,
                duration: this.animateDuration * self.data[self._animateIndex].value,
                easing: this.easing,
                onFinish: function() {
                    //动画结束后的回调函数
                    self._animateIndex++;
                    //递归调用自己

                    //设置退出递归的条件
                    if (self._animateIndex >= self.data.length) {

                        //当结束递归调用的时候，
                        //要将self._animateIndex重置为0.
                        //因为self._animateIndex是全局变量。
                        //最后一次递归调用的时候，它的值已经变成了4。
                        //如果不重置为0，下次再调用这个playAnimate()函数
                        //的时候，self._animateIndex将从4开始算。
                        //当获取konva元素item的时候， item == wedges[6]，
                        //该元素不存在。


                        self._animateIndex = 0;
                        return;
                    }

                    self.playAnimate();
                }
            })


        }


    };

    var getPieChart = function(option) {

        return new PieChart(option);

    };

    win.getPieChart = getPieChart;





})(window)