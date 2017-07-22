// 引入本地安装的gulp
var gulp = require('gulp');

// 引入将less解析成css的gulp插件gulp-less
var less = require('gulp-less');

// 引入能够压缩css文件的插件gulp-cssmin
var cssmin = require('gulp-cssmin');

// 引入能够给css添加私有前缀的插件gulp-autoprefixer
var autoprefix = require('gulp-autoprefixer');

// 引入能够给文件添加版本号的插件gulp-rev
var rev = require('gulp-rev');

// 引入能够更改文件名字的插件gulp-rename
var rename = require('gulp-rename');

// 引入能够压缩图片的插件gulp-imagemin
var imagemin = require('gulp-imagemin');

// 引入能够将主页index.html中引入的文件进行打包合并
// 并替换路径的插件gulp-useref
var useref = require('gulp-useref');


// 引入能够筛选文件并使用其它插件处理被筛选出来的文件的
// 插件gulp-if
var gulpif = require('gulp-if');

// 引入可以丑化js文件，也就是压缩js文件的插件gulp-uglify
var uglify = require('gulp-uglify');

// 引入可以压缩html代码的插件gulp-htmlmin
var htmlmin = require('gulp-htmlmin');

// 引入将html文件中所有的外部链接名字替换成
// 使用了rev添加了版本号的链接文件名的gulp-rev-collector插件
var revCollector = require('gulp-rev-collector');






// 第1个任务：将less转成css
gulp.task('less' , function(){

	return gulp.src('./public/less/index.less')
	// 将less转成css
	.pipe(less())

	// gulp-cssmin 压缩CSS
	.pipe(cssmin())

	// gulp-autoprefixer 添加CSS私有前缀
	.pipe(autoprefix())


	// 为了解决css静态文件的缓存问题，
	// 需要给css文件名加上md5加密字符串，这个md5加密字符串
	// 是使用当前的css文件中的内容加密得到的，所以一旦这个css
	// 文件中的内容被改变，这个md5加密字符串也会被改变。
	// 此时对应的css文件的名字改变了，那么浏览器
	// 在访问文件的时候，由于文件名发生变化，
	// 就会重新下载css文件，让我们对css文件的更新
	// 实时展现到用户面前

	// gulp-rev 添加版本号
	.pipe(rev())


	// 给文件添加完版本号后，就将已经改好的文件存储起来
	// 由于我们在使用gulp-useref插件处理index.html的时候，
	// 将public/less/main.less转换成了public/css/main.css
	// 所以此时要将存储地址写成./release/public/css
	.pipe(gulp.dest('./release/public/css'))


	// 将css原始文件名和添加了md5密码的文件名的对应关系
	// 保存到一个文件中，以便在主页index.html中将原始
	// css文件名也替换成md5加密后的文件名
	.pipe(rev.manifest()) 


	//使用的是rev函数的静态manifest方法，此时会生成
	//一个json文件记录对应关系。
	//将该json文件保存到某目录中
	
	// 在保存了json文件之前，将该json文件的名字更改一下，
	// 因为默认文件名是rev-manifest开头。其他使用了rev.manifest()
	// 方法 的任务也会存放一个以rev-manifest开头的json文件，
	// 如果这类json文件存放在同一个目录中，则会覆盖，所以需要
	// 更改json文件的名字之后再存储
	.pipe(rename('css-manifest.json'))

	// 将改好名字的文件保存到rev文件夹中
	.pipe(gulp.dest('./release/rev'))

});




// 任务2：处理图片（压缩图片）
// 由于这个web中，图片在各种文件被使用，js中有引入图片，
// css中有引入图片。此时如果图片加密，css和js中的图片，
// 无法通过revCollector同步名字，所以，这里的图片只压缩，
// 不改变名字
gulp.task('images' , function(){

	// 获取要处理的图片
	// 使用**/*可以将images目录下的所有文件全部递归匹配
	// 要将处理的文件相对位置原封不动移动到release文件夹下，
	// 需要借助base，将base值后面的内容直接复制到release中
	// 再进行处理
	return gulp.src(['./public/images/**/*'] , {base : './'})

	// gulp-imagemin 图片压缩
	.pipe(imagemin())

	// 由于图片也是静态资源，会缓存到用户电脑中，
	// 当我们更新图片的时候，为了去除缓存的影响，
	// 也需要使用gulp-rev插件，给图片添加版本号

	/*注意：缓存是什么？
	当浏览器向服务器请求页面的时候，浏览器会将
	和页面有关的所有静态资源下载到浏览器中，比如css
	、js、img等，也就是被缓存。当我们在线上更新
	了静态数据后，由于用户浏览器已经有同名字的文件了，
	浏览器会直接到缓存中获取数据。那么我们的更新便
	不能匹配到用户浏览器中，影响体验。

	但是如果我们一旦更新了某个文件，就把这个文件的名字
	改变，那么浏览器在请求文件的时候，看到这个地址在自己
	的缓存中不存在，就会到服务器中请求数据。
	这样我们上线的更新文件，就会同步更新到用户浏览器中。*/

	// .pipe(rev())

	// 将更改完名字的图片保存起来
	.pipe(gulp.dest('./release'))

	// 将图片原始名字和更改后名字的对应关系保存到
	// 一个json文件中，便于后面使用gulp-rev-collector 
	// 插件将主页index.html中的图片地址替换成已经改名
	// 后的图片地址

	// .pipe(rev.manifest())

	// // 将这个json文件更改名字后保存到rev文件夹中
	// .pipe(rename('image-manifest.json'))

	// .pipe(gulp.dest('./release/rev'))

});





// 任务3：压缩scripts中的js文件
gulp.task('js' , function(){



	// 将scripts的js文件压缩
	return gulp.src(['./scripts/*','./public/libs/*'],{base:'./'})

	// 使用gulp-uglify丑化js文件
	.pipe(uglify())

	// // 修改js文件版本号
	// .pipe(rev())

	// 将修改完名字的js文件存放到新的位置
	.pipe(gulp.dest('./release'))


	// 将js文件原始名字和更改后名字的对应关系保存到
	// 一个json文件中，便于后面使用gulp-rev-collector 
	// 插件将主页index.html中的js地址替换成已经改名
	// 后的js地址
	// 将这个json文件更改名字后保存到rev文件夹中
	// .pipe(rev.manifest('js-manifest.json'))


	// 将存储了对应关系的json文件存储到rev文件夹中
	// .pipe(gulp.dest('./release/rev'))


});




// 任务5：压缩html
gulp.task('html' , function(){

	// 压缩html代码，使用的是插件gulp-htmlmin
	return gulp.src(['./index.html' , './views/*.html'] , {base : './'} )

	// 压缩html代码时需要传入参数，为一个对象，在对象中
	// 使用键值对的形式表示该html文档中需要压缩的内容

	// 将index.html使用useref处理，处理build和endbuild之间的内容
	.pipe(useref())

	
	.pipe(htmlmin({collapseWhitespace : true , removeComments : true,
		minifyJS : true , minifyCSS : true}))

	// 将压缩后的html文档存放到文件夹中
	.pipe(gulp.dest('./release'))

});






// 任务6： 将其他不需要gulp插件处理的文件直接复制
// 到release文件夹中
gulp.task('other' , function(){

	return gulp.src(['./public/fonts/**/*' , './public/bootstrap/**/*' ,'./public/audio/*','./api/*'] , {base : './'})

	.pipe(gulp.dest('./release'))

});




// 任务7：将所有html中引入的外部文件，如css、less，以及
// 图片image，替换成使用gulp-rev插件添加了版本号的文件。
// 此时需要使用gulp-rev-collector插件，将html中引入的原始文件地址
// 替换成添加了版本号的地址

gulp.task('rev' , ['less' , 'images' , 'js' , 'html' ] , function(){

	// 数组中第一项是记录了对应关系的json文件，
	// 第二项是release文件夹中所有的html文件。
	// 目的是将html中所有的外部链接地址替换成添加了
	// 版本号的地址
	gulp.src(['./release/rev/*.json' , './release/**/*.html'],{base : './release'} )

	.pipe(revCollector())

	// 将替换好的文件存放到release文件夹中
	.pipe(gulp.dest('./release'))


});

gulp.task('rev2' , ['rev1'] , function(){
	gulp.src(['./release/rev/*.json' , './release/**/*.js'],{base : './release'} )
	.pipe(revCollector())
	// 将替换好的文件存放到release文件夹中
	.pipe(gulp.dest('./release'))
})



// gulp.task('rev3' , ['rev2'] , function(){
// 	gulp.src(['./release/rev/*.json' , './release/**/*.css'],{base : './release'} )
// 	.pipe(revCollector())
// 	// 将替换好的文件存放到release文件夹中
// 	.pipe(gulp.dest('./release'))
// })






/*
如果任务名是"default"，那么在使用gulp来调用该任务的时候，
不需要在gulp后面添加default，直接写上gulp就可以调用这个
任务了。

所以，我们常将该gulpfile.js配置文件中的所有任务作为任务
依赖添加到default任务中，最后在bash中直接使用一个命令 gulp 
就可以执行所有的任务*/

gulp.task('default' , ['rev2' , 'other' ]  );
// 后面的function可以留空


/*注意：在配置gulpfile.js文件的时候，我们下载了很多gulp
插件，那么这些插件名称和他们的依赖关系怎么存储下来呢?

直接在当前根目录下，在bash中使用npm init，回车之后会提示
创建package.json文件信息。除了必要填写的信息，可以一路回车
，即可创建好package.json文件。
之后我们在使用npm install插件的时候，所有被下载的插件名字
以及他们的依赖关系都会被记录到这个文件中。

创建package.json的时候，是在我们新建分支的时候即可创建。
此时还没有使用npm install gulp .
*/


/*git支持一个忽略文件,这个文件没有名字，只有后缀  .gitignore
在这个忽略文件中可以写一个清单，表明在使用git add提交的时候，
哪些文件是不提交的

由于node_modules文件夹中的东西太多，文件夹太大，所以一般我们
不会把这个文件夹提交上去。
我们只要把package.json提交上去就可以了。

对方在使用的时候，只需要在bash中执行npm install,
这个npm就会自动检测package.json中的内容，并将其中的所有
插件下载下来
*/