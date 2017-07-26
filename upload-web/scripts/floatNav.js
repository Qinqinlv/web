(function() {
    // 由于每一个a都是绝对定位，所以，使用js给a
    // 设置top位置

    // 使用一个变量记录a链接之间的距离
    var distance = 30;
    
    $("#floatNav").find('a').each(function(index , ele){
        $(ele).css('top', index * distance);


    })


    var timer = null;
    $("#floatNav").hover(function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            $("#floatNav").find("a").each(function(index, el) {
                /*alert(index);*/
                setTimeout(function() {
                    $(el).stop().animate({ "right": 0 }, 300);
                }, 50 * index);
            })
        }, 200)
    }, function() {
        if (timer) {
            clearTimeout(timer);
        }
        $(this).find("a").each(function(index, el) {
            setTimeout(function() {
                $(el).stop().animate({ "right": -110 }, 300)
            }, 50 * index);
        })
         $(this).find("a").eq(0).each(function(index, el) {
            setTimeout(function() {
                $(el).stop().animate({ "right": -80 }, 300)
            }, 50 * index);
        })
    })


})()