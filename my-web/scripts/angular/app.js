// 这个模块是用于定义主模块的。
// 在这个模块中，使用ngRoute模块的路由服务，
// 制作单页面应用。

// 该页面的主要内容是
// 1. 配置routeProvider,给hash值绑定
// hashchange事件，给不同的锚点值绑定不同的视图模板

// 2. 使用run方法事先运行一些模块，比如$rootScope全局作用域
// ，在全局作用域中定义一些全局变量或者是全局的方法。

var app = angular.module('app' , ['ngRoute','controller', 'detective']);

// 主模块在加载模块后，运行模块之前对模块进行配置。
// 此处配置路由
app.config(['$routeProvider' , function($routeProvider){

	$routeProvider.when('/index',{
		templateUrl : './views/main.html'
	})
	.when('/FlappyBird',{
		templateUrl : './scripts/flappyBird/index.html'
	})
	.when('/Scene' , {
		templateUrl : './scripts/changeScene/index.html'
	})
	.when('/Waterfall',{
		templateUrl : './views/waterfall.html',
		controller : 'waterfallController'
	})
	.when('/Carousel' , {
		templateUrl : './scripts/carousels/'
	})
	.otherwise({
		redirectTo : '/index'
	})
		
	

}])

// 定义全局的属性或者方法
app.run(['$rootScope' , function($rootScope){

	$rootScope.mainPage =  false;

	$rootScope.hashValue = '/index';

}])