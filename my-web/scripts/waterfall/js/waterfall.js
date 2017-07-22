// function waterfall(itemParent) {


//     // 获取容器盒子
//     var itemParent = document.getElementById(itemParent);

//     // 获取这个父盒子下所有的子盒子box
//     var boxes = itemParent.children;


//     // 计算页面显示的列数

//     // 每一个子盒子的宽度
//     var boxW = boxes[0].offsetWidth;



//     // 获取每一行的图片列数：
//     var colums = Math.floor(document.documentElement.clientWidth / boxW);


//     // 此时的父盒子的宽度是随着浏览器窗口的变化而变化的。
//     // 此时为了让页面好看些，我们将这个父盒子的宽度设置成一行中
//     // 排列了所有子盒子的宽度，并且在页面中居中
//     // cssText这个属性，可以用来设置css样式，以字符串的形式
//     itemParent.style.cssText = 'width : ' + boxW * colums + 'px ;' + 'margin : 0 auto';

//     // 开始排列图片
//     // 需要一个数组用来存放每一张图片排列的高度
//     var hArr = [];





//     // 从第二行开始，每张图片的排列都按照如下规则：
//     // 先遍历hArr数组，找出数组中值最小的那个数据的索引，
//     // 然后把当前要被改变位置的图片放到这个位置(使用绝对定位)

//     for (var i = 0; i < boxes.length; i++) {

//         var picH = boxes[i].offsetHeight;

//         // 将第一行的图片高度放到数组中
//         if (i < colums) {
//             hArr[i] = picH;
//         } else {

//             // 求出数组中值最小的数据
//             var minH = Math.min.apply(null, hArr);


//             // 求得这个最小值的索引
//            var  minIndex = hArr.indexOf(minH);


//             // 将当前的这张图排列到minIndex这个地方
//             boxes[i].style.position = 'absolute';
//             boxes[i].style.top = minH + 'px';
//             boxes[i].style.left = boxes[minIndex].offsetLeft + 'px';

//             // 更新数组中的数据
//             hArr[minIndex] += boxes[minIndex].offsetLeft;

//         }

//     }
// }



function waterfall(parent) {


    // 获取父盒子 
    var itemParent = document.getElementById(parent);
    // 获取父盒子下的所有装有图片的子盒子
    var items = itemParent.children; // 获取存储块框pin的数组items
    // 获取图片的宽度
    var picW = items[0].offsetWidth;
    // 获取每一行排列图片的张数
    var num = Math.floor(document.documentElement.clientWidth / picW); //每行中能容纳的pin个数【窗口宽度除以一个块框宽度】
    // 将父盒子宽度固定，并且居中
    itemParent.style.cssText = 'width:' + picW * num + 'px;margin:0 auto;'; //设置父级居中样式：定宽+自动水平外边距

    //用于存储每张图片放置的高度
    var pinHArr = [];

    for (var i = 0; i < items.length; i++) { //遍历数组items的每个块框元素
        var pinH = items[i].offsetHeight;
        if (i < num) {
            // 将第一行图片的高度存储到数组中
            pinHArr[i] = pinH;
        } else {

            // 获取第一行图片中，最小的高度
            var minH = Math.min.apply(null, pinHArr);

            // 获取最小高度的索引值
            var minHIndex = pinHArr.indexOf(minH);

            // 将当前要被重放位置的图片设置成绝对定位，并且
            // 设置好top和left的值
            items[i].style.position = 'absolute';
            items[i].style.top = minH + 'px';
            items[i].style.left = items[minHIndex].offsetLeft + 'px';

            // 将当前图片的高度追加到minIndex的位置
            pinHArr[minHIndex] += items[i].offsetHeight;
        }
    }
}








// 当滚动屏幕的时候，每滚动到一定位置，就发送ajax请求，
// 并且将新获取到的图片添加到容器中，同样使用瀑布流的方式
// 排列


// 到底什么时候才是发起ajax请求的好时候呢？
// 由于页面中原始图片已经有20张(非ajax请求)，我们可以检测，容器中
// 的最后一张图片的距离容器顶部的距离。当页面顶部向上卷去的高度(document.scrollTop)
//  + 浏览器屏幕可视区的高度 > 该图片的offsetWidth时，开始发送ajax请求。


// 在执行回调的时候，如果不设置条件，那么每触发一次scroll事件，
// 回调函数就会被执行。当非常频繁的触发事件的时候，如果不加节制，
// 没有来得及执行的回调函数就会被压入栈中，等待上一个执行完毕后
// 接着执行，所以，可能出现，我已经没有触发事件了，但是回调函数还在
// 执行，浏览器容易崩溃。

var scrollActive = false;



window.addEventListener("scroll", function() {

    if (!scrollActive) {

        scrollActive = true;


        // 每当发生滚动事件的时候，先判断是否已经触发了
        // 发送ajax请求的条件

        if (canAjax('itemParent')) {

            console.log('还在请求');

            var xhr = new XMLHttpRequest();


            xhr.open('post', './api/waterfall.php');

            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) {

                    // 获取服务器响应的数据
                    var data = xhr.responseText;

                    // 将数据转换成对象
                    data = JSON.parse(data);

                    // 由于获取到的data是数组，但是模板引擎只支持js对象，
                    // 所以，需要将这个数组包裹在一个对象中
                    var dataObj = {
                        item: data
                    };


                    // 接收模板引擎处理好了的字符串
                    var str = template('template', dataObj);

                    // 将拼接好的字符串添加到页面上
                    itemParent.innerHTML += str;

                    // 这里有一个问题，就是虽然我把str添加到了
                    // 页面上。但是由于我们加载的是图片，图片
                    // 是需要被同步请求的(通过src属性)。

                    // 这个请求图片的过程需要一点时间，如果图片
                    // 还没有请求完，我就执行waterfall.js中的代码
                    // 来排列图片，那么图片排列肯定会有重叠。

                    // 那怎么让新增加的图片被加载一张就排列一张呢？

                    // 因为我这里为了防止图片重复叠加设置的定时器是20ms，
                    // 有时候图片加载快，新加载的图片在后来使用waterfall
                    // 排列的时候，会出现位置抖动

                    // setTimeout(function() {

                    //     waterfall('itemParent');

                    // }, 20);

                    waterfall('itemParent');

                    scrollActive = false;

                }


            }


            xhr.send();
        }
    }
})



// 到底什么时候才是发起ajax请求的好时候呢？
// 由于页面中原始图片已经有20张(非ajax请求)，我们可以检测，容器中
// 的最后一张图片的距离容器顶部的距离。当页面顶部向上卷去的高度(document.scrollTop)
//  + 浏览器屏幕可视区的高度 > 该图片的offsetWidth时，开始发送ajax请求。

// 封装一个计算二者差值的函数
function canAjax(itemParent) {
    // 获取容器中的最后一张图片

    // 获取容器
    var itemParent = document.getElementById(itemParent);

    // 获取这个父盒子下所有的子盒子box
    var items = itemParent.children;

    // 获取容器中最后一个图片盒子
    var lastPic = items[items.length - 1];

    // 获取该盒子的距离itemParent盒子顶部的距离
    var topDistance = lastPic.offsetHeight;

    // 计算此时document头部被卷去的高度
    var topDoc = document.documentElement.scrollTop || document.body.scrollTop;

    // 计算此时屏幕可视区的高度
    var clientH = document.documentElement.clientHeight;


    return ((topDistance - clientH/2) < (topDoc + clientH)) ? true : false;

}


// 获取数组中，某个数据对应的索引
function getminHIndex(arr, minH) {
    for (var i in arr) {
        if (arr[i] == minH) {
            return i;
        }
    }
}
