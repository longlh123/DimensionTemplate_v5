(function($){

	switch($('html').attr('lang').toLowerCase())
	{
		case 'vi-vn':
			$('.btnTop').html('VỀ ĐẦU TRANG');
			break;
		default:
			$('.btnTop').html('ON TOP');
			break;
	}
							
	$.fn.hasScrollBar = function(){
		
		//alert($(this).get(0).scrollHeight + " - " + $(this).height() + " - " + ($(this).get(0).scrollHeight == $(this).height()));

		return !(parseInt($(this).get(0).scrollHeight) == parseInt($(this).height()));
	}

	$('.btnTop').click(function(){

		$('.content').scrollTop(0);
	});

	$('input:submit').removeAttr('style');	
	
	$('.mrNext').prop('disabled', false);
	$('.mrNext').show();
	$('.btnTop').prop('disabled', true);
	$('.btnTop').hide();
	
	if($('.content').hasScrollBar())
	{
		$('.mrNext').prop('disabled', true);
		$('.mrNext').hide();
		$('.btnTop').prop('disabled', false);
		$('.btnTop').show();
	}	
	
	$('.error').find('img').next().remove();

	$('.content').bind('scroll', function(){
		
		//alert("2 - " + $(this).scrollTop() + " - " +  $(this).innerHeight() + " - " +  $(this)[0].scrollHeight)
		
		$('.mrNext').show();
		$('.mrNext').prop('disabled', false);
		$('.btnTop').hide();
		$('.btnTop').prop('disabled', true);
			
		if(!(parseInt($(this).scrollTop()) + parseInt($(this).innerHeight()) >= parseInt($(this)[0].scrollHeight) - 10))
		{
			$('.mrNext').hide();
			$('.mrNext').prop('disabled', true);
			$('.btnTop').show();
			$('.btnTop').prop('disabled', false);
		}
	});
})(jQuery);