
$(document).ready(function(){
	
	var slideshow_format = $('.custom_question_properties').text().replace("[","").replace("]","").split("#");

	var path = slideshow_format[0].replace("path:","");
	var images = slideshow_format[1].replace("images:","").split("|");

	var str_divs = ""; 

	for(var i = 0; i < images.length; i++)
	{
		var str_div = "";

		if(i == 0)
		{
			str_div = "<img class='slide' style='display:block' src='" + path + "/" + images[i] + "'/>";
		}
		else
		{
			str_div = "<img class='slide' style='display:none' src='" + path + "/" + images[i] + "'/>";
		}
		
		str_divs += str_div;
	}

	str_divs += "<button type='button' class='btn_prev' onclick='plusDivs(-1)'>&#10094;</button><button  type='button' class='btn_next' onclick='plusDivs(1)'>&#10095;</button>";

	$('.slideshow_container').html(str_divs);

	$('.question_banners').hide();
})






