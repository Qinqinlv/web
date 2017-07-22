(function(win){

// 根据给定的图片地址，加载图片，当图片加载完成后，将图片传递给回调函数，由回调函数将图片渲染到页面上。

// 思路：
// 步骤1：遍历存储图片地址的对象，每遍历到一张图片就创建一个img对象，并开始加载
// 步骤2：将创建的 img对象都加入到一个专门存储图片的对象中
// 步骤2：当图片都加载完成后，将所有图片对象传给回调函数



// 将该函数的信息记录在顶部
// 格式为：函数类型（普通的还是构造函数） ，名字，干嘛的
// 参数 ，{参数名，参数类型}，干嘛的
/**
 * function {imgLoad} 加载图片资源
 * param {imgSrc : Object} 按照key : value的形式接收图片地址
 * param {fn : Function} 图片加载完成后传给该回调函数渲染到页面
 */

// 在制作飞翔的小鸟动画时，需要保证所有的图片都加载完后，我们才能够通过调整鸟的方向。此时需要封装一个专门用于加载图片的函数。
function imgLoad(imgSrc, fn) {
    //第一个参数是所有图片的地址，格式为json
    //第二个参数是回调函数。当图片加载完成后，就可以渲染图片
    //定义一个对象，用于接收加载完成的图片对象
    var imgObj = {};
    // 定义一个变量，计算图片的张数
    var imglength = 0;
    // 定义一个变量，计算加载完成的图片的数量
    var loadLength = 0;

    // 将当前作用域的所有变量声明提升到开头
    var tempImg;



    for (var key in imgSrc) {

        imglength++;

        tempImg = new Image();
        // 加载图片。只要指定了图片对象的src属性，马上开始加载图片
        tempImg.src = imgSrc[key];

        // 将生成的图片对象放入imigObj中。
        imgObj[key] = tempImg;



        // 每加载完一张图片，就把加载完成的图片放到数组中
        tempImg.onload = function() {

            loadLength++;
            // 当图片加载的数量等于imgSrc的长度的时候，说明图片已经加载完成。
            // 此时将存放图片对象的imgObj传给回调函数fn，通过fn将图片渲染到canvas 画布上。

            if (loadLength >= imglength) {
                fn(imgObj);
            }
        }

         // console.log(imgObj);
    }
}

// 将函数名暴露到全局
win.imgLoad = imgLoad;


})(window);