(function(){



     $(".mouseInOrOut > .list").on("mouseenter mouseleave", function(e) {
         var $that = $(this);
         var w = $(this).width(); // 得到盒子宽度
         var h = $(this).height(); // 得到盒子高度
         var x = (e.pageX - this.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
         // 获取x值
         var y = (e.pageY - this.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);
         // 获取y值
         var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4; //direction的值为“0,1,2,3”分别对应着“上，右，下，左”
         // 将点的坐标对应的弧度值换算成角度度数值

         if (e.type == 'mouseenter') {
             switch (direction) {
                 case 0:
                     comeIn("top");
                     break;
                 case 1:
                     comeIn("right");
                     break;
                 case 2:
                     comeIn("bottom");
                     break;
                 case 3:
                     comeIn("left");
                     break;
             }
         } else {
             switch (direction) {
                 case 0:
                     comeOut("top");
                     break;
                 case 1:
                     comeOut("right");
                     break;
                 case 2:
                     comeOut("bottom");
                     break;
                 case 3:
                     comeOut("left");
                     break;
             }

         }
         //鼠标滑入时的动画
         function comeIn(str) {
             $that.addClass("current");
             //清除掉所有的类，再添加当前的类p
             $that.children("div").removeClass().addClass(str);
         }
         //鼠标离开时的动画
         function comeOut(str) {
             $that.removeClass("current");
             $that.children("div").removeClass().addClass(str);
         }

     });


})()