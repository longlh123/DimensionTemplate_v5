/*****************************************************************/
/**																**/
/**	Name: base.js												**/
/**	Summary: OPEN-END QUESTION                                  **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/
(function($){

	$.fn.hasExclusiveCheckbox = function(target_name, class_name){


	};

}(jQuery));


$(document).ready(function(){
	
	$('.content').children().each(function(){
		
		var str_placeholder = "Ghi nhận câu trả lời..";
		var is_email = false, is_datetime = false;

		switch($(this).prop('class'))
		{
			case "OpenEnd_Basic_namediv":
			case "Email_Basic_namediv":
			case "DateTime_Basic_namediv":
				switch($(this).prop('class'))
				{
					case "Email_Basic_namediv":
						str_placeholder = "email@example.com";
						is_email = true;
						break;
					case "DateTime_Basic_namediv":
						is_datetime = true;
						break;
				}
				
				/* Declare Object */	
				var objOpenEndBasic = {
					placeholder : str_placeholder,
					isEmail : is_email,
					isDateTime : is_datetime
				};

				var $customQuestionProperties = $(this).find('.custom_question_properties');

				var str_properties = $customQuestionProperties.text();

				var arr_properties = str_properties.split('#');

				for(var i = 0; i < arr_properties.length; i++)
				{
					var arr_property = arr_properties[i].replace("[","").replace("]","").split(':');

					switch(arr_property[0])
					{
						case 'placeholder':
							objOpenEndBasic['placeholder'] = arr_property[1];
							break;
						default:
							objOpenEndBasic[arr_property[0]] = arr_property[1];
							break;
					}	
				}

				$(this).children().each(function(){

					if($(this).prop('class') === "control_everything")
					{
						$(this).children().each(function(){

							if($(this).prop('class') === "question_controls")
							{
								$(this).children().each(function(){

									if($(this).is('span'))
									{
										if(objOpenEndBasic['isEmail'])
										{
											$(this).prepend("<input type='email' name='email' class = 'textbox' minlength = '3' maxlength = '1024'>");
										}

										$(this).children().each(function(){

											if($(this).is('input:text') || $(this).is('textarea') || $(this).prop('name') === "email")
											{
												$(this).removeAttr('style');
												$(this).removeClass('mrEdit');

												$(this).attr('placeholder', objOpenEndBasic['placeholder']);

												//Event
												$(this).keyup(function(){

													if($(this).parent().is('span'))
													{
														$(this).parent().children().each(function(){
															
															if($(this).is('input:checkbox'))
															{
																$(this).next().removeClass('selected');
																$(this).prop('checked', false);
																return;
															}
														});
													}
												});

												if($(this).is('input:text'))
												{
													$(this).addClass('textbox');

													if(objOpenEndBasic['isEmail'])
													{
														$(this).hide(); //Hide <input type = "text">
														$(this).next().hide(); //Hide <div></div>
													}
												}
												else if($(this).is('textarea'))
												{
													$(this).addClass('textarea');
												}
												else if($(this).prop('name') === "email")
												{
													if($(this).next().next().is('input:text'))
													{
														if($(this).next().next().val().length > 0)
														{
															$(this).val($(this).next().next().val());
														}	
													}	

													$(this).change(function(){

														var value = $(this).val();

														if($(this).parent().is('span'))
														{
															$(this).parent().children().each(function(){

																if($(this).is('input:text'))
																{
																	$(this).val(value);
																}
															});
														}
													});
												}
											}
											else if($(this).is('input:checkbox'))
											{
												if($(this).prop('checked'))
												{
													$(this).next().addClass('selected');
												}

												//Event
												$(this).change(function(){

													var ischecked = false;

													if(!$(this).next().hasClass('selected'))
													{
														$(this).next().addClass('selected');
														$(this).attr('checked', true);
														ischecked = true;
													}
													else
													{
														$(this).next().removeClass('selected');
														$(this).attr('checked', false);
														ischecked = false;
													}

													if($(this).parent().is('span'))
													{
														$(this).parent().children().each(function(){
															
															if(ischecked && ($(this).is('input:text') || $(this).is('textarea') || $(this).prop('class') === "email"))
															{
																$(this).val("");
																return;
															}
														});
													}
												})
											}
										});
									}
								});
							}
						});
					}
				});
				break;
		}
	});
});
