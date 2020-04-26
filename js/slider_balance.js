/*****************************************************************/
/**																**/
/**	Name: datetime_basic.js									    **/
/**	Summary: SLIDER BASIC QUESTION                              **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/

$(document).ready(function(){

	$('.content').each(function(){

		$sliderBalanceNamediv = $(this).find('.Slider_Balance_namediv');

		if($sliderBalanceNamediv.prop('class') === "Slider_Balance_namediv")
		{
			var $customQuestionProperties = $sliderBalanceNamediv.find('.custom_question_properties');

			$customQuestionProperties.hide();

			var str_properties = $customQuestionProperties.text();

			var arr_properties = str_properties.split('#');

			var obj_slider = {};

			/*

			obj_slider = {
				productName_1 : "Sản phẩm 1",
				productName_2 : "Sản phẩm 2",
				minValue : -50,
				maxValue : 50,
				defaultValue : 0
			};

			*/

			for(var i = 0; i < arr_properties.length; i++)
			{
				var arr_property = arr_properties[i].replace("[","").replace("]","").split(':');

				obj_slider[arr_property[0]] = arr_property[1];
			}

			var $questionControls = $sliderBalanceNamediv.find('.question_controls');
			
			$questionControls.children().each(function(){

				if($(this).is('span'))
				{
					$(this).children().each(function(){

						if($(this).is('input:text'))
						{
							if($(this).val().length !== 0)
							{
								obj_slider['defaultValue'] = $(this).val();
							}
							else
							{
								$(this).val(obj_slider['defaultValue']);
							}
						}
					});
				}
			});

			$questionControls.hide();

			var $sliderBalanceContainer = $sliderBalanceNamediv.find('.slider_balance_container');

			if($sliderBalanceContainer.prop('class') === "slider_balance_container")
			{
				var str_html = "<input type='range' value='0' min='-50' max='50' class='slider'>";

				str_html = "<table class = 'slider_balance'>";
				str_html += "<tr>";
				str_html += "<td align = 'left'> <span>" + obj_slider['productName_1'] + "</span> </td>";
				str_html += "<td align = 'right'> <span>" + obj_slider['productName_2'] + "</span> </td>";
				str_html += "</tr>";
				str_html += "<tr>";
				str_html += "<td colspan = 2><div class='slider_balance point'><img src='https://images1.ipsosinteractive.com/ABC_VIETNAM/templates_test/images/down_arrow.gif' width='20px' height='25px'></div><input type='range' value='" + obj_slider['defaultValue'] + "' min='" + obj_slider['minValue'] + "' max='" + obj_slider['maxValue'] + "' class='slider'></td>";
				str_html += "</tr>";
				str_html += "</table>";

				$sliderBalanceContainer.html(str_html);
			}

			var $questionBanners = $sliderBalanceNamediv.find('.question_banners');
			$questionBanners.hide();
		}
	});

	$('.slider').click(function(){

		$('input:text').val($(this).val());
	});

	$('.slider').change(function(){

		$('input:text').val($(this).val());
	});
})