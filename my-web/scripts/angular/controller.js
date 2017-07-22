// 这个模块的作用是定义一个控制器模块。
// 在这个模块下定义该网站需要用到的所有控制器。

// 但是大部分控制器都是控制路由模板页面的。
// 在控制器中，可以通过ajax请求数据，将请求到
// 的数据添加到页面上。

angular.module('controller',[])
.controller('waterfallController' , ['$scope',function($scope){

	$scope.waterfall


}])