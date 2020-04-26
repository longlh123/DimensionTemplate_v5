/*****************************************************************/
/**																**/
/**	Name: loop_basic.js									        **/
/**	Summary: LOOP BASIC QUESTION                                **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/

(function($){

	$.fn.makeTable = function($table){

		var index_row = 0, index_col = 0;

		$table.removeClass("mrQuestionTable");
		$table.removeAttr('class');
		$table.removeAttr('style');

		$table.find('tbody').children().each(function(){

			index_row++;

			$(this).children().each(function(){
				
				index_col++;

				switch($(this).attr('class'))
				{
					case "mrGridQuestionText":
						$(this).find('span').removeClass("mrQuestionText");
						$(this).find('span').addClass("contentofheader");
						break;
					default:
						if($(this).find('input:radio').length > 0)
						{
							$(this).find('input:radio').after("<label for = '" + $(this).find('input:radio').attr('id') + "'></label>");
							
							$(this).find('input').next().css({"padding-bottom" : "20px"});
						}
						else if($(this).find('input:checkbox').length > 0)
						{
							$(this).find('input:checkbox').after("<label for = '" + $(this).find('input:checkbox').attr('id') + "'></label>");
							
							$(this).find('input').next().css({"padding-bottom" : "20px"});
						}
						else if($(this).find('span').length > 0)
						{
							if($(this).find('span').find('input:text').length > 0)
							{
								$(this).find('span').find('input:text').removeClass('mrEdit');
								$(this).find('span').find('input:text').addClass('textbox');
							}
						}	
						break;
				}

				
			});
		});
	};
}(jQuery));

$(document).ready(function(){

	$('.content').children().each(function(){

		if($(this).prop('class') === "Loop_Basic_namediv")
		{
			$(this).children().each(function(){

				if($(this).prop('class') === "control_everything")
				{
					$(this).children().each(function(){

						if($(this).prop('class') === "question_controls")
						{
							$(this).children().each(function(){

								if($(this).is('span'))
								{
									$(this).children().each(function(){
										
										if($(this).prop('tagName').toLowerCase() === "table")
										{
											$.fn.makeTable($(this));
										}
									});
								}
							});	
						}
					});
				}
			});
		}
	});
});