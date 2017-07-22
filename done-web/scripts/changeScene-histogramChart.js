(function(win){



    /**
     * Created by Administrator on 2017/5/12.
     */

    function HistogramChart(option) {
        this._init(option);
    }

    HistogramChart.prototype = {
        _init: function(option) {
            this.x = option.x || 0; //想要放置这个直方图的X坐标
            this.y = option.y || 0; //想要放置这个直方图的Y坐标
            this.width = option.width || 200; //直方图的宽度
            this.height = option.height || 200; //直方图的高度
            this.data = option.data || {}; //绘制直方图需要的具体数据
            this.opacity = (option.opacity >= 0 && option.opacity <= 1) ? option.opacity : 1;

            //创建一个组，将这个直方图所有的内容都放到这个组中

            //为了方便后面的函数调用这些组，所有的组在定义的时候不使用var,而是使用this定义，将其作为属性定义。

            //最好将组的定义放在全局上

            this.totalGroup = new Konva.Group({
                x: this.x,
                y: this.y,
                opacity: this.opacity
            });


            //将矩形放置在一个专门存放矩形对象的组中
            this.rectGroup = new Konva.Group({
                    x: 0,
                    y: 0
                })
                //由于这个组也要被添加到大组this.totalGroup中，
                //该组原点和this.totalGroup的原点重合，所以，
                //这里的x和y == 0 （组下面的组也是该组的一部分，
                //只要是该组的一部分，它的坐标就会以该组的原地为准重新计算）


            //给百分比文字也设置一个组，方便整体控制
            this.textTopGroup = new Konva.Group({
                x: 0,
                y: 0
            });
            //将该组添加到大组中
            this.totalGroup.add(this.textTopGroup);



            // 给底部文字也设置一个组，方便整体控制
            this.textBottomGroup = new Konva.Group({
                x: 0,
                y: 0
            });
            //将该组添加到大组中
            this.totalGroup.add(this.textBottomGroup);







            //初始化直线
            var line = new Konva.Line({
                points: [0, 0, this.width, 0],
                //第一个坐标是这条线的起始坐标，
                //第二个坐标是这条线的结束坐标
                stroke: "green",
                strokeWidth: 1
            });

            //将直线添加到大组中
            this.totalGroup.add(line);

            //初始化矩形
            //每一个矩形所占据的宽度
            var rectTotalWidth = this.width / this.data.length;
            var self = this;

            // 每一个矩形的高度，根据传入数据之间的比例确定。
            // 数据中最大的那个值对应矩形的高度是整个height的高度
            var dataValue = [];
            this.data.forEach(function(val, index) {
                // 将每条数据的value取出来，求出最大的那个value值。
                dataValue.push(val["value"]);
            })

            var maxValue = Math.max.apply(null, dataValue);
            // 最大高度 / maxValue = 当前矩形高度 / 当前矩形的value
            // 最大高度和最大value值的比值
            this.height = this.height / maxValue;

            // console.log(this.ratioHeight);//600

            // 根据data中的每个数据构建矩形
            this.data.forEach(function(item, index) {

                //这里面的 this指的是当前的item

                var rect = new Konva.Rect({
                    x: (1 / 4 + index) * rectTotalWidth,
                    //           由于这里确定的坐标是绘制矩形的起始坐标（左上角原点）。
                    //           那么在设置高度的时候，就需要用y0减去data数据中传过来
                    //           的矩形高度。
                    y: -self.height * item.value,
                    width: 1 / 2 * rectTotalWidth,
                    height: self.height * item.value,
                    fill: item.color,
                });

                // console.log('this.ratioHeight' , this.ratioHeight);


                //将矩形添加到rectGroup中
                self.rectGroup.add(rect);

                //将该组添加到大组self.totalGroup中
                self.totalGroup.add(self.rectGroup);


                //初始化百分比文字
                var textTop = new Konva.Text({
                    x: index * rectTotalWidth,
                    //           由于这里确定的坐标是绘制矩形的起始坐标（左上角原点）。
                    //           那么在设置高度的时候，就需要用y0减去data数据中传过来的矩形高度。
                    y: -self.height * item.value - 20,
                    //文字要绘制在矩形的头上。Y轴上坐标向上移动要用减
                    width: rectTotalWidth,
                    align: "center",
                    fill: item.color,
                    text: item.value * 100 + "%",
                    fontSize: 14,
                    fontFamily: "Microsoft Yahei",
                    name: "textTop"
                });


                //将百分比文字添加到textTopGroup组中
                self.textTopGroup.add(textTop);


                //初始化底部文字

                var textBottom = new Konva.Text({
                    x: (1 / 2 + index) * rectTotalWidth,
                    y: 10,
                    align: "center",
                    fill: item.color,
                    text: item.name,
                    fontSize: 14,
                    fontFamily: "Microsoft Yahei",
                    rotation: 35
                });



                //将底部文字添加到textBottomGroup组中
                self.textBottomGroup.add(textBottom);

            });

        },
        addToGroupOrLayer: function(arg) {
            arg.add(this.totalGroup);
        },
        //调用该函数会发生动画
        playAnimation: function() {

            //保存this
            var self = this;

            //找出所有的矩形，让它们产生动画
            this.rectGroup.getChildren().each(function(item, index) {

                //先让所有矩形高度为0，Y坐标也为0；
                item.height(0);
                item.y(0);

                //使用to动画使矩形的height和y恢复原值
                item.to({
                    duration: 1,
                    y: -self.height * self.data[index].value,
                    height: self.height * self.data[index].value
                })

            });

            //找出百分比文字，让文字随着矩形一起动。

            this.textTopGroup.getChildren().each(function(item, index) {
                //先将文字的y变成0
                item.y(-20);
                // 再将文字的y动画恢复原值
                item.to({
                    y: -self.data[index].value * self.height - 20,
                    duration: 1
                })

            });


        }

    };

    var getHistogramChart = function(option) {
        return new HistogramChart(option);
    }

    win.getHistogramChart = getHistogramChart;






})(window)