<?php 

	/**
	 *思路：
	 *1.读取所有的图片信息，并将该字符串转换成一个数组
	 *
	 * 2.从这个数组中随机截取10张图片的信息，存放在一个数组中
	 *
	 * 3.将该数组通过json_encode()转换成json字符串返回
	 * 
	 */
	
	$pic = file_get_contents('./waterfall.json');

	// 将拿到的字符串转换成php对象
	$data = json_decode($pic);

	// 随机获取10张图片的数据
	$randomKeys = array_rand($data , 10); 
	// 随机返回10张图片在数组中的索引。这些索引存放在一个数组中
	
	// 遍历当前的索引数组，取出所有的项添加到一个新数组中
	$picArr = array();
	// 使用php中的count()函数求出数组的长度
	$len = count($randomKeys);

	for($i = 0; $i < $len ; $i++ ){
		$key = $randomKeys[$i];

		$picItem = $data[$key];


		// php的数组长度也是可以动态变化的，所以，可以直接通过索引
		// 将每一项的值添加到数组中
		$picArr[$i] = $picItem;


	}


	// 将得到的10张图片的数组，通过json_encode()返回到浏览器
	echo json_encode($picArr);


 ?>