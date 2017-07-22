/**
 * Created by Administrator on 2017/3/27.
 */

    var js_silder = document.getElementById("js_silder");
    var slider_ctrl = document.getElementById("slider_ctrl");
    var slider_main = document.getElementById("slider_main");
    var imgs = slider_main.children;


    //根据img的个数生成span_ctrl中的除去第一个和最后一个的所有span
    for(var i = 0;i < imgs.length;i++){
        var span = document.createElement("span");
        span.innerHTML = imgs.length - i;
        span.className = "slider-ctrl-icon";
        slider_ctrl.insertBefore(span,slider_ctrl.children[1]);
    }


    //给索引为1的span加上current类
    var spans =  slider_ctrl.children;
    spans[1].setAttribute("class","slider-ctrl-icon current");



    //初始情况下，除了第一张图片留在盒子的左边，
    //其它的图片都存放在盒子的右边
    var scrollWidth = js_silder.offsetWidth;

    // console.log('scrollWidth',scrollWidth);

    for(var i = 1; i < imgs.length;i++){
        imgs[i].style["left"] = scrollWidth + "px";
    }

    //遍历三个按钮 左右两边的三角和下面的6个横条span
    var key = 0;//记录动画播放的张数
    for(var k in spans){
        spans[k].onclick = function () {
            if(this.className == "slider-ctrl-prev"){
                //点击左边的按钮，当前图片left:-scrollWidth -- 0;
                // 紧接着位于当前图片左边的那张图片的left值
                // 迅速跳转到-scrollWidth的位置，准备下一次的left从-scrollWidth到0的动画
                animate(imgs[key],{left:scrollWidth});
                key = (--key < 0)  ?  imgs.length-1: key;
                imgs[key].style.left = -scrollWidth + "px";
                animate(imgs[key],{left:0});
                setSquare(key);

            }
            else if(this.className == "slider-ctrl-next"){

                //初始情况下，点击右边的按钮，第一张动画向左移出盒子
                // animate(imgs[key],{left:-scrollWidth});
                //当前图片左移后，紧接着当前图片右边的那张图片向右移
                //动到left为0的位置key++
                
                //图片经过第一轮移动后，都从右边移动到了left为-scrollWidth的位置叠起来了
                // 第二轮图片轮播的时候，key的值要变成0，从头开始
                //if(key > imgs.length - 1){
                //    key = 0;
                //    //当前图片滑动方向（left:0 -- -scrollWidth）
                //    //从右向左滑动到舞台中央（left：scrollWidth -- 0）
                //    //新一轮图片轮播，每次图片从左边往右边滑过来，
                //    //和第一轮方向是反的，而且以后的每一次都是从左往右
                //    //为了让图片能够每一轮播放的时候都是保持left从scrollWidth -- 0的方向，
                //    // 在当前图片从右到左滑动后，紧接着第二张图片要快速跳回到left = scrollWidth的位置，准备从scrollWidth -- 0
                //}
                //imgs[key].style["left"] = scrollWidth + "px";
                //animate(imgs[key],{left:0});
                autoPlay();
            }
            else{
                //得到当前被点击的span的索引
                var that = this.innerHTML - 1;
                //当被点击的span索引大于key的时候，
                //当前的图片（也就是索引为key）的这张，向左边移动
                // 位于key右边的that索引的图片从left=scrollWidth到0移动。
                if(that > key){
                    imgs[that].style.left = scrollWidth + "px";
                    animate(imgs[key],{left:-scrollWidth});
                }
                //当被点击的span索引小于key的时候，
                //当前的图片（也就是索引为key）的这张，向右边移动
                // 位于key右边的that索引的图片从left=-scrollWidth到0移动。
                else if(that < key){
                    imgs[that].style.left = -scrollWidth + "px";
                    animate(imgs[key],{left:scrollWidth});
                }
                //将that的值赋给key,这样下次使用左右两边的大于、
                //小于号来滚动图片的时候，会首先将key = that得到的
                //key值再key++或者是key--，接着播放key后的动画。
                //如果不把当前的that值赋给key，比如that的值是2，
                //key的值本来是4，动画之后索引为5的图片移动到了舞台中央，
                //但是key还是5，当点击右边的大于号的时候，播放索引
                //为key++的第6张图片。效果是：前一张图片是第三张图片，
                //接下来播放的是第6张图片，就混乱了
                key = that;
                animate(imgs[that],{left:0});
                setSquare(key);
                //这句话本来是写在if和else if里面的，
                //但是最后一种情况是key = that,当key=that的时候，图片不动，
                // 就算写上animate(imgs[that],{left:0}),
                // 由于它的left本来就已经是0了，所以也不会动。
                //由于if,else if和else中都有同一句animate(imgs[that],{left:0})，所以就干脆提出来了。其实key = that
                //也相当于是从if和else if中提出来的。

            }
        }
    }
    //这里用for(var i=0;i<length;i++)也是可以的

    //在图片轮播的过程中，下面的小span跟着改变背景色。哪张图片出现在舞台中央，该图片对应索引号+1的span背景色变化。
    //由于，小span背景变化发生在3个地方，左右两边的箭头，点击下面的6个小的span,所以需要封装一个函数，以便于复用。
    function setSquare(key){
        for(var i = 1; i < spans.length - 1;i++){
            spans[i].setAttribute("class","slider-ctrl-icon");
        }
        spans[key+1].setAttribute("class","slider-ctrl-icon current");
    }
    
    

    //最后，加一个整体自动轮播的定时器
    var timer = null;
    timer = setInterval(autoPlay,1500);
    function autoPlay(){
        //其实这个自动播放的定时器的作用和右边按钮的功能是
        //一样的——图片不停的从右往左移动。

        //初始情况下，点击右边的按钮，第一张动画向左移出盒子
        animate(imgs[key],{left:-scrollWidth});
        //第一张图片左移后，紧接着的第二张图片向右移动到left为0的位置
        key++;
        //图片经过第一轮移动后，都从右边移动到了left为-scrollWidth的位置叠起来了
        // 第二轮图片轮播的时候，key的值要变成0，从头开始
        if(key > imgs.length - 1){
            key = 0;
            //当前图片滑动方向（left:0 -- -scrollWidth）
            //从右向左滑动到舞台中央（left：scrollWidth -- 0）
            //新一轮图片轮播，每次图片从左边往右边滑过来，和第一轮方向是反的，而且以后的每一次都是从左往右
            //为了让图片能够每一轮播放的时候都是保持left从scrollWidth -- 0的方向，
            // 在当前图片从右到左滑动后，紧接着第二张图片要快速跳回到left = scrollWidth的位置，准备从scrollWidth -- 0
        }
        imgs[key].style["left"] = scrollWidth + "px";
        animate(imgs[key],{left:0});
        setSquare(key);

    }
    
    //当鼠标在大盒子上的时候，清除外面的定时器
    js_silder.onmouseover = function () {
        clearInterval(timer);
    }

    //鼠标移出盒子开启定时器
    js_silder.onmouseout = function () {
        clearInterval(timer);
        timer = setInterval(autoPlay,1000);
    }


