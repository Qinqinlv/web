(function(){

    // 注册一个resize事件，每当屏幕尺寸改变的时候，
// window.innerWidth改变，图片的大小更改
var clientW = 0;
var clientH = 0;
var $lis;
var jieliu = true; //  用来控制函数节奏的变量
var json = [];
var $arrows;

// 定义一个变量，如果当前回调还没有执行完毕，
// 再次触发resize事件的时候，不能执行回调
var resizeActive = false;

// 用于监听是否是第一次进入页面
var times = 0;


$(window).on('resize', function() {

    if (!resizeActive) {

        resizeActive = true;


        clientW = $(window).width();


        clientH = $(window).height();

        if (clientW > 768) {
            clientH = clientH * .7;
            clientW = clientW * .8;
        }

        $lis = $('#slide').children('ul').children();

        $arrows = $('.arrow').children();


        //  存储了每个图片的信息
        json = [{ //  1
                width: clientW * .3,
                top: clientH * .08,
                left: clientW * .15,
                opacity: .3,
                z: 2
            },
            { // 2
                width: clientW * .4,
                top: clientH * .16,
                left: clientW * .08,
                opacity: .8,
                z: 3
            },
            { // 3
                width: clientW * .5,
                top: clientH * .25,
                left: clientW * .25,
                opacity: 1,
                z: 4
            },
            { // 4
                width: clientW * .4,
                top: clientH * .16,
                left: clientW * .52,
                opacity: .8,
                z: 3
            },
            { //5
                width: clientW * .3,
                top: clientH * .08,
                left: clientW * .55,
                opacity: .3,
                z: 2
            }
        ];

        picRotate();


         if (times == 0) {
        // 获取装li的父盒子，让盒子显示出来。
        // 这样做的目的是防止刚打开页面时的
        // 图片抖动
        $('#slide').css('display', 'block');
        times++;
    }






        resizeActive = false;
    }

})

$(window).resize();

// var clientW = $(window).width();


// var clientH = $(window).height();


// var $lis = $('#slide').children('ul').children();

function picRotate() {

    change();

    // 点击不同的按钮，根据按钮的指向，图片交换位置
    $arrows.each(function(index, item) {

        $(item).on('click', function() {
            if (this.className == "prev") {
                if (jieliu) {
                    jieliu = false;
                    change(false);

                }


            } else {
                if (jieliu) {
                    jieliu = false;
                    change(true);

                }


            }


        })


    })

}


// 定义json数据的更改方式已经图片从一个状态到另一个状态的
// 动画效果
function change(flag) {
    console.log(999);

    if (flag) {
        json.unshift(json.pop());
    } else {
        //移除第一个   放到json 最后一个
        json.push(json.shift());
    }
    //图片的位置一共之后，所有的图片都从自己先前的样式改变到相应索引的样式
    //比方说，第五张图本来在索引4的位置，但是经过change函数，将它剪切复制到了索引为0的位置。
    //那么，这张图就需要将它位于索引4的时候使用的样式过渡到索引0的样式，这就需要animate动画


    $lis.each(function(index, item) {




        $(item).css({
            'z-index': json[index].z,
            // "opacity": json[index].opacity,
        });


        $(item).animate({
            //   'z-index' : json[index].z,
            "opacity": json[index].opacity,
            "width": json[index].width,
            "top": json[index].top,
            "left": json[index].left,

        }, 250, "linear", function() {

            $(item).stop(true, false);
            jieliu = true;

        })


    })


}
    

})()