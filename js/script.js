var slideIndex = 1;

var titles = {
	0:'Hình 1/15: (Dầu gội) CLEAR BOTANIQUE mới',
	1:'Hình 2/15: Tinh chiết từ các nguồn thực vật quý hiếm',
	2:'Hình 3/15: Công nghệ khoa học từ CLEAR chiết lọc các dưỡng chất tinh túy',
	3:'Hình 4/15: Công nghệ khoa học từ CLEAR chiết lọc các dưỡng chất tinh túy',
	4:'Hình 5/15: Công nghệ khoa học từ CLEAR chiết lọc các dưỡng chất tinh túy',
	5:'Hình 6/15: từ Địa Trung Hải, Á Đông và Amazon',
	6:'Hình 7/15: từ Địa Trung Hải, Á Đông và Amazon',
	7:'Hình 8/15: Sức mạnh thuần khiết của thiên nhiên quy tụ trong Clear Botanique mới',
	8:'Hình 9/15: Sức mạnh thuần khiết của thiên nhiên quy tụ trong Clear Botanique mới',
	9:'Hình 10/15: Sức mạnh thuần khiết của thiên nhiên quy tụ trong Clear Botanique mới',
	10:'Hình 11/15: giúp Thanh Sạch Da Đầu, Sống Động Làn Tóc, Ngăn Gàu Quay Lại',
	11:'Hình 12/15: giúp Thanh Sạch Da Đầu, Sống Động Làn Tóc, Ngăn Gàu Quay Lại',
	12:'Hình 13/15: giúp Thanh Sạch Da Đầu, Sống Động Làn Tóc, Ngăn Gàu Quay Lại',
	13:'Hình 14/15: giúp Thanh Sạch Da Đầu, Sống Động Làn Tóc, Ngăn Gàu Quay Lại',
	14:'Hình 15/15: CLEAR BOTANIQUE Mới'};

showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("slide");
  
  if (n > x.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = x.length}
  
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }

  if(typeof(x[slideIndex-1]) != 'undefined')
  {
  	x[slideIndex-1].style.display = "block";

  	var y = document.getElementById('slideshow_title');

  	y.innerHTML = "<h5 style='text-align:center'>" + titles[slideIndex-1] + "</h5>";
  } 
}

//--SLIDE 2-----------------------------------------------------------------

var slideIndex2 = 1;

var titles2 = {
	0:'Hình 1/14: Mái tóc mình nói rằng đẹp là khi luôn tự tin để dẫn đầu',
	1:'Hình 2/14: Mái tóc mình nói rằng đẹp là khi luôn tự tin để dẫn đầu',
	2:'Hình 3/14: Tóc mình nói rằng đẹp là luôn làm mới bản thân',
	3:'Hình 4/14: Tóc mình nói rằng đẹp là luôn làm mới bản thân',
	4:'Hình 5/14: Còn tóc mình nói rằng đẹp là khi bạn mạnh mẽ',
	5:'Hình 6/14: Còn tóc mình nói rằng đẹp là khi bạn mạnh mẽ',
	6:'Hình 7/14: Đã đến lúc hư tổn nhường chỗ để mái tóc chắc khỏe lên tiếng',
	7:'Hình 8/14: Vì đã có Dove Phục Hồi Hư Tổn Mới',
	8:'Hình 9/14: với công nghệ nuôi dưỡng độc đáo Bio-Nourish',
	9:'Hình 10/14: Giúp phục hồi và dưỡng mượt tức thì',
	10:'Hình 11/14: Ngay tại phần tóc hư tổn nặng',
	11:'Hình 12/14: Cho mái tóc chắc khỏe hơn rõ rệt trong mỗi lần chạm',
	12:'Hình 13/14: Để mái tóc cất lên vẻ đẹp thật sự của chính bạn',
	13:'Hình 14/14: Dove Phục Hồi Hư Tổn mới'};

showDivs2(slideIndex2);

function plusDivs2(n) {
  showDivs2(slideIndex2 += n);
}

function showDivs2(n) {
  var i;
  var x = document.getElementsByClassName("slide");
  
  if (n > x.length) {slideIndex2 = 1}    
  if (n < 1) {slideIndex2 = x.length}
  
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }

  if(typeof(x[slideIndex2-1]) != 'undefined')
  {
  	x[slideIndex2-1].style.display = "block";

  	var y = document.getElementById('slideshow_title');

  	y.innerHTML = "<h5 style='text-align:center'>" + titles2[slideIndex2-1] + "</h5>";
  } 
}