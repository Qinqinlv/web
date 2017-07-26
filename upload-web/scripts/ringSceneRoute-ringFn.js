(function(win){



    //定义圆形图片的构造函数和原型
    function CircleText(option) {
        this._init(option);
    }

    CircleText.prototype = {
        _init: function(option) {
            this.x = option.x || 0;
            this.y = option.y || 0;
            this.innerStyle = option.innerStyle || "orange"; //中心圆的颜色
            this.outerStyle = option.outerStyle || "teal"; //中心圆环的颜色
            this.innerRadius = option.innerRadius || 0;
            this.outerRadius = option.outerRadius || 0;
            this.opacity = option.opacity || 1;
            this.text = option.text || '';
            this.hasText = option.hasText;




            //构造一个组，将所有上面的整个图形放进组中，统一管理
            //其实就是将上面的3个元素，放到一个经过transform变化的画布中。以后就可以直接操作这个group，达到同时操作这3个元素的目的。

            this.centerGroup = new Konva.Group({
                //这个(this.x,this.y)点就是原始画布的原始坐标（0，0），通过translate位移之后的位置。
                x: this.x,
                y: this.y
                    //之所以将组的坐标设置成(this.x,this.y)是因为这样操作，在画圆的时候计算量少。因为，在transform画布中作画，就算超过了这个transform画布范围，只要没有超过原始画布范围，都是可见的。
            });

            //将图形打包到组后，图形中的所有组成元素的坐标基准原点就都变成了(this.x ,this.y)。所以，之前写好的坐标要做更改。所有以前使用的(this.x,this.y)坐标通通变成0.


            //将这个组做成构造函数的属性。是为了下面调用addToGroupOrLayer()函数的时候，可以直接引用。

            //构造中心圆
            var centerCircle = new Konva.Circle({
                //x : this.x,
                // y : this.y,
                x: 0,
                y: 0,
                radius: this.innerRadius,
                fill: this.innerStyle,
                opacity: this.opacity
            });
            this.centerGroup.add(centerCircle);


            //构造中心圆的圆环
            var centerRing = new Konva.Ring({
                //x : this.x ,
                // y : this.y,
                x: 0,
                y: 0,
                innerRadius: this.innerRadius,
                outerRadius: this.outerRadius,
                opacity: .4,
                fill: this.outerStyle
            });
            this.centerGroup.add(centerRing);


            //构造中心圆中的文字
            if (this.hasText) {

                var centerText = new Konva.Text({
                    x: -this.outerRadius,
                    y: -8,
                    width: this.outerRadius * 2,
                    align: "center",
                    fill: "#fff",
                    text: this.text,
                    fontSize: 17,
                    fontFamily: "Microsoft YaHei"
                });
                this.centerGroup.add(centerText);
            }



        },

        //构造一个函数，通过该函数将上面定义的centerGroup组添加到父级层或者父级组中。
        addToGroupOrLayer: function(arg) {
            arg.add(this.centerGroup);
        }

    };

    // 使用工厂模式，返回实例，省去new的多次使用
    var getCirlce = function(option) {

        return new CircleText(option);
    }



    win.getCirlce = getCirlce;


 


})(window)