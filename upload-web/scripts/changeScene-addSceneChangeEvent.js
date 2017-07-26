(function(win){




    // 将三种事件的处理程序封装到一个大的函数中
    function SceneChangeEvent(option) {

        var stage = option.stage;
        var sceneIndex = option.sceneIndex;
        var sceneBuilder = option.sceneBuilder;


        // 当鼠标滑动屏幕或者是在移动端用手滑动屏幕的时候，
        // 切换场景。
        // 当鼠标或者手指触碰到屏幕的时候，触发mousedown和touchStart事件，并记录下
        // 当前碰到的屏幕的具体位置
        // 这里使用konva中的提供的绑定事件的方法来给stage绑定事件

        // 在进入事件处理函数前，先定义两个变量来接收最开始接触到屏幕的那一点，
        // 以及离开屏幕的时候的一点
        var startY = 0;
        var endY = 0;
        stage.on("contentMousedown contentTouchstart", function(e) {


            // 在pc端和移动端，获取当前点击的点的坐标的方式是不同的。
            // 在pc端,每点击一次，返回一个Object对象 (e == Object)，该点的坐标存放在
            // 该Object对象的evt属性中.这个 evt属性的属性值也是一个对象，我们需要的
            // 坐标以键值对的方式存储在该对象中
            // console.log(e);
            // 这里需要判断，事件发生在pc端，还是在移动端。不同的端，获取该点位置的方式不同
            // 判断是pc端事件还是移动端事件，使用的是对应的Object的type属性
            if (e.type === "contentMousedown") {

                startY = e.evt.screenY;
            } else if (e.type === "contentTouchstart") {
                // 当在移动端中发生touch相关事件后，当前的点坐标都存储在Object对象
                // 中的evt属性中。evt属性中有一个touches属性，是一个伪数组，当前
                // 点的坐标就存放在该列表的第一个元素中。
                startY = e.evt.touches[0].screenY;
            }


        })


        // 当鼠标或者手在舞台上移动的时候，触发mousemove和touchmove事件
        stage.on("contentMousemove contentTouchmove", function(e) {

            // 不管是在pc上还是在 移动端中，鼠标或者手每移动一次就会产生一个新的对象
            // Object，从这个对象中获取当前触碰点的坐标的方式和mousedown/touchstart事件
            // 中的获取方式一样。

            // console.log(e);
            if (e.type === "contentMousemove") {
                endY = e.evt.screenY;
            } else if (e.type === "contentTouchmove") {
                endY = e.evt.touches[0].screenY;
            }

        })



        // 当鼠标或者手离开舞台的时候，触发mouseup和touchend事件
        stage.on("contentMouseup contentTouchend", function(e) {

            // 在前面的事件中，我们已经获取到了触碰到舞台的第一个点的坐标，
            // 以及最后一个点的坐标。
            // 那么此时，就应该比较两个坐标的差值，通过差值来判断
            // 我们的鼠标或者手上向上滑动的，还是向下滑动的。

            // 如果是向上滑动的，就进入下一个场景；
            // 如果是向下滑动的，就进入上一个场景

            // 进入场景的方式是先获取马上要进入的场景的索引，然后调用该场景的
            // play()方法，即可实现两个场景的切换。

            if (endY - startY > 0) {

                // 差值大于0，表示向下滑动，将进入上一个场景
                // 如果该场景已经是最初的第一个场景了，那么就停留在第一场景的位置
                // 实现第一个场景切换到第一个场景的动画
                sceneIndex = (sceneIndex - 1) <= 0 ? 0 : (sceneIndex - 1);

            } else if (endY - startY < 0) {

                // 差值小于0，表示向上滑动，将进入下一个场景
                // 如果当前场景已经是最后一个场景了，那么就停留在最后
                // 一个场景的位置，实现最后一个场景切换到最后一个场景的动画。
                sceneIndex = (sceneIndex + 1) >= (sceneBuilder.length - 1) ? (sceneBuilder.length - 1) : (sceneIndex + 1);

            }
            // console.log(sceneBuilder[sceneIndex]);
            // console.log(sceneBuilder[sceneIndex]()); //undefined

            sceneBuilder[sceneIndex]().play();
            // 每次移动鼠标或者手指后，startY和endY的值都变化了，不再是0.
            // 当下一次触碰屏幕的时候，又重新开始计算startY和endY的值。
            // 在这里可以将startY和endY的值重置，也可以不用重置。

            startY = 0;
            endY = 0;
        })

    }


    var addSceneChangeEvent = function(option) {

        SceneChangeEvent(option);
    };

    win.addSceneChangeEvent = addSceneChangeEvent;





})(window)