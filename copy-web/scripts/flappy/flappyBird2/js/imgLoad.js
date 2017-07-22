

var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");



// 根据给定的图片地址，加载图片，当图片加载完成后，将图片传递给回调函数，由回调函数将图片渲染到页面上。

// 思路：
// 步骤1：遍历存储图片地址的对象，每遍历到一张图片就创建一个img对象，并开始加载
// 步骤2：将创建的 img对象都加入到一个专门存储图片的对象中
// 步骤2：当图片都加载完成后，将所有图片对象传给回调函数



// 在制作飞翔的小鸟动画时，需要保证所有的图片都加载完后，我们才能够通过调整鸟的方向。此时需要封装一个专门用于加载图片的函数。
// 下面是将被加载的图片
var imgSrc = {
    'bird': './scripts/flappyBird/img/bird.png',
    'land': './scripts/flappyBird/img/land.png',
    'pipeDown': './scripts/flappyBird/img/pipeDown.png',
    'pipeUp': './scripts/flappyBird/img/pipeUp.png',
    'sky': './scripts/flappyBird/img/sky.png'
};
   
    //定义一个对象，用于接收加载完成的图片对象
    var imgObj = {};
    // 定义一个变量，计算图片的张数
    var imglength = 0;
    // 定义一个变量，计算加载完成的图片的数量
    var loadLength = 0;

    //存储canvas新建的图片对象
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
                drawScene(imgObj);
            }
        }

         
    }




