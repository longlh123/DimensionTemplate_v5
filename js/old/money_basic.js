/*****************************************************************/
/**																**/
/**	Name: base.js												**/
/**	Summary: MONEY QUESTION                                     **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/

$(document).ready(function(){
	
	/*Init*/
	var arr_properties = $('.mrQuestionText').text().split('#');
   
	var content = arr_properties[0].replace("[Content:","").replace("]","");
	var type = arr_properties[1].replace("[Type:","").replace("]","");
	var visible = (arr_properties[2].replace("[Visible:","").replace("]","").toLowerCase() === "true" ? true : false); 
	
	var str_html = "";
	
	$('.question_controls').children().each(function(){
				  
		if($(this).is('span'))
		{
			if(visible)
			{
				var str = "";
				
				$(this).children().each(function(){
					
					if($(this).is('input:text'))
					{
						if($(this).val().length > 0)
						{
							var arr_chars = $(this).val().toString().split("");
		
							var index = 0, flag = 1;
							var index_active = arr_chars.length - 1;
							
							$.each(arr_chars, function(key, value){
								
								if(flag === 3)
								{
									str = ((arr_chars.length - 1) - index > 0 ? "," : "") + arr_chars[index_active] + str;
									flag = 1;
								}
								else
								{
									str = arr_chars[index_active] + str;
									flag++;	
								}
								
								index++;
								index_active--;
							});
							
							$('.box_label').text(str);
						}
					}
				});
				
				str_html = "<span class = 'box_label'>" + str + "</span><span class = 'money_style'></span>" + $(this).html() + "<span class = 'money_style'></span>";
			}
			else
			{
				str_html = $(this).html() + "<span class = 'money_style'></span>";
			}
		  
			$(this).html(str_html);
		}
	});          
	
	$('.mrQuestionText').text(content);
	$('.money_style').text(type);
	
	if($('input:checkbox').prop('checked'))
	{
		$('input:checkbox').next('label').addClass('selected');
	}
	
	$('input:text').keyup(function(){
		
		var arr_chars = $(this).val().toString().split("");
		
		var str = "";
		var index = 0, flag = 1;
		var index_active = arr_chars.length - 1;
		
		$.each(arr_chars, function(key, value){
			
			if(flag === 3)
			{
				str = ((arr_chars.length - 1) - index > 0 ? "," : "") + arr_chars[index_active] + str;
				flag = 1;
			}
			else
			{
				str = arr_chars[index_active] + str;
				flag++;	
			}
			
			index++;
			index_active--;
		});
		
		$('.box_label').text(str);
		
		if($(this).parent().is('span'))
		{
			$(this).parent().children().each(function(){
				
				if($(this).is('input:checkbox'))
				{
					$(this).next('label').removeClass('selected');
					$(this).prop('checked', false);
				}
			});
		}
	});
	
	$('input:checkbox').click(function(){
		
		var ischecked = false;
		
		if($(this).next('label').hasClass('selected'))
		{
			var ischecked = false;
			$(this).next('label').removeClass('selected');
			$(this).prop('checked', false);
		}
		else
		{
			var ischecked = true;
			$(this).next('label').addClass('selected');
			$(this).prop('checked', true);
		}	
		
		if($(this).parent().is('span'))
		{
			$(this).parent().children().each(function(){
				
				if(ischecked && ($(this).is('input:text') || $(this).is('textarea')))
				{
					$(this).val("");
				}
			});
		}
	});
});
