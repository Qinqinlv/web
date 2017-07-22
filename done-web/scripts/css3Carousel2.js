(function() {

    // 在这个模块中，将bofy的背景设置成当前images下的
    // bg4.jpg。因为若是在c3中设置的话，会影响其它的页面

    // $('body').css({
    //     'background': 'url(./scripts/carousels/css3Carousel2-6/images/bg4.jpg)',
    //     '-webkit-background-size': 'cover',
    //     'background-size': 'cover'
    // });


    // 将css3Carousel2的宽高固定为视口宽高，
    // 多余的部分overflow-hidden

    var clientW = window.innerWidth;
    var clientH = window.innerHeight;

    // 当屏幕宽度 >= 768的时候，由于我希望全屏，所以，
    // 将高度减去nav高(80px)；当屏幕宽度 < 768的时候，
    // 由于nav绝对定位，所以高度为视口高 
    if (clientW >= 768) {
        clientH = clientH - 80;
    }

    $('#css3Carousel2').css({
        'overflow ': 'hidden',
        'background': 'url(./public/images/css3Carousel2-6/bg4.jpg)',
        '-webkit-background-size': 'cover',
        'background-size': 'cover'
    }).height(clientH);






})()