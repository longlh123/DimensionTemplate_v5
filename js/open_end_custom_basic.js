/*****************************************************************/
/**																**/
/**	Name: datetime_basic.js									    **/
/**	Summary: DATETIME QUESTION                                  **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/
(function($){
	/*-------------------------------------------------------------------------------------*
	 * Function: replaceAllCharacters                                                      * 
	 * Description: Replasce tất cả các ký tự str_find có trong string thành str_replace   *    
	 * Parameters:                                                                         *
	 *           + str_value:      chuỗi cần xóa ký tự                                     *
	 *           + str_find:       ký tự cần xóa                                           *
	 *           + str_replace:    ký tự thay thế                                          *
	 *-------------------------------------------------------------------------------------*/
	$.fn.replaceAllCharacters = function(str_value, str_find, str_replace){
		try{
			return str_value.replace(new RegExp(str_find, "gi"), str_replace);
		}catch(e){
			return str_value;
		}
	};
	
	/*-----------------------------------------------------------------------------------------------*
	 * Function: formatNumeric                                                                       * 
	 * Description: Format chuỗi số theo format 0,000,000.00 tùy thuộc vào kiểu dữ liệu long/double  *
	 * Parameters:                                                                                   *
	 *           + str_value:      chuỗi số cần format                                               *
	 *           + scale:          làm tròn bao nhiêu số lẻ (long: scale = 0|double scale = 1 .. 5)  *		
	 *-----------------------------------------------------------------------------------------------*/
	$.fn.formatNumeric = function(_str_value, scale){
		
		var _str_value_format = "";
		
		_str_value = $.fn.replaceAllCharacters(_str_value, ',','');
		
		var arr_number = _str_value.split('.');
		
		_str_value = arr_number[0]; //Phần nguyên
		
		if(_str_value.length <= 3)
		{
			_str_value_format = _str_value;
		}
		else
		{
			var arr_chars = _str_value.split('');
			
			var index = 0, flag = 1;
			var index_active = arr_chars.length - 1;
			
			$.each(arr_chars, function(key, value){
				
				if(flag === 3)
				{
					_str_value_format = ((arr_chars.length - 1) - index > 0 ? "," : "") + arr_chars[index_active] + _str_value_format;
					flag = 1;
				}
				else
				{
					_str_value_format = arr_chars[index_active] + _str_value_format;
					flag++;	
				}
				
				index++;
				index_active--;
			});
		}
		
		if(scale > 0 && arr_number.length > 1)
		{
			if(arr_number[1].length > 0)
			{
				if(parseInt(arr_number[1]) == 0)
				{
					_str_value_format = _str_value_format.toString() + '.' + arr_number[1].toString().substring(0, scale);	
				}
				else
				{
					var decimal = parseFloat("0." + arr_number[1].toString());
				
					switch(scale)
					{
						case 1:
							decimal = Math.round(decimal * 10) / 10;
							break;
						case 2:
							decimal = Math.round(decimal * 100) / 100;
							break;
						case 3:
							decimal = Math.round(decimal * 1000) / 1000;
							break;
						case 4:
							decimal = Math.round(decimal * 10000) / 10000;
							break;
						case 5:
							decimal = Math.round(decimal * 100000) / 100000;
							break;
						default:
							decimal = Math.round(decimal * 100) / 100;
							break;
					}
					
					_str_value_format = _str_value_format.toString() + '.' + decimal.toString().substring(2, decimal.toString().length);	
				}
				
			}
			else
			{
				_str_value_format = _str_value_format + ".";
			}
		}
		
		_str_value_format = _str_value_format.toString();
		
		return _str_value_format;
	};
	
	/*-------------------------------------------------------------------------------------*
	 * Function: checkDateTime                                                             * 
	 * Description: Kiểm tra thông tin ngày được nhập                                      *    
	 * Parameters:                                                                         *
	 *           + _date:      ngày được nhập                                              *
	 *-------------------------------------------------------------------------------------*/
	$.fn.checkDateTime = function(_date){
		
		var _day = parseInt(_date.substring(0, 2));
		var _month = parseInt(_date.substring(3, 5));
		var _year = parseInt(_date.substring(6, 11));
		
		var result = false;
		
		switch(_month)
		{
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				if(_day >= 1 && _day <= 31)
				{
					result = true;
				}
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				if(_day >= 1 && _day <= 30)
				{
					result = true;
				}
				break;
			case 2:
				if(_year % 400 === 0 || (_year % 4 === 0 && _year % 100 !== 0))
				{
					if(_day >= 1 && _day <= 29)
					{
						result = true;
					}
				}
				else
				{
					if(_day >= 1 && _day <= 28)
					{
						result = true;
					}
				}
		}
		
		return result;
	};
}(jQuery));

$(document).ready(function(){
	
	$('.content').children().each(function(){

		if($(this).prop('class') === "OpenEndCustom_Basic_namediv")
		{
			//Tìm các thuộc tích của template [Type:DD/MM/YYYY]#[Range:2010-2017]
			var type = ""; //[Type:DD/MM/YYYY]|[Type:HH:MM]|[Type:0,000]
			var datatype = "";
			var scale = 0;
			var unit = ""; //[Unit:VND]
			var step = 0; //[Step:Number]
			var minYear = (new Date()).getFullYear() - 5; //[Range:2010-2017]
			var maxYear = (new Date()).getFullYear() + 5; //[Range:2010-2017]
			var has_checkbox = false; //Check template có code DK, REF, NA không?

			$(this).children().each(function(){

				if($(this).prop('class') === "control_everything")
				{
					$(this).children().each(function(){

						if($(this).prop('class') === "question_banners")
						{
							$(this).children().each(function(){

								if($(this).prop('class') === "mrBannerText")
								{
									$(this).children().each(function(){

										if($(this).prop('class') === "custom_question_properties")
										{
											var str_properties = $(this).text();

											var arr_properties = str_properties.split('#');
											
											if(arr_properties.length > 0)
											{
												for(var i = 0; i < arr_properties.length; i++)
												{
													var str_property = arr_properties[i].replace("[","").replace("]","").toLowerCase();
													
													if(str_property.indexOf("type:") >= 0)
													{
														type = str_property.replace("type:","").toUpperCase();	

														switch(type)
														{
															case "DD/MM/YYYY":
															case "HH:MM":
																datatype = "string";
																break;
															default:
																var arr_number = type.split('.');
																
																if(arr_number.length > 0)
																{
																	type = '0,000';
																	
																	if(arr_number[0] === '0,000')
																	{
																		datatype = "numeric";
																		
																		if(arr_number.length === 2)
																		{
																			scale = arr_number[1].length;
																		}
																	}
																}
																break;
														}
													}
													if(str_property.indexOf("unit:") >= 0)
													{
														unit = str_property.replace("unit:","").toUpperCase();
													}
													if(str_property.indexOf("range:") >= 0)
													{
														str_property = str_property.replace("range:","");
														
														var arr_range = str_property.split('-');

														minYear = arr_range[0];
														maxYear = arr_range[1];
													}

													if(str_property.indexOf("step:") >= 0)
													{
														step = parseInt(str_property.replace("step:",""));
													}
												}
											}
										}
									});
								}
							});
						}

						if($(this).prop('class') === "question_controls")
						{
							$(this).children().each(function(){

								if($(this).is('span'))
								{
									$(this).children().each(function(){
										
										if($(this).is('div'))
										{
											$(this).remove();
										}
										
										if($(this).is('input:checkbox'))
										{
											//Check template có code DK, REF, NA không?
											has_checkbox = true;
										}
									});		
									
									var i = 0;
									var str_html = "", str_html_temp = "";

									switch(type)
									{
										case '0,000':
											$(this).children().each(function(){
												
												if($(this).is('input:text'))
												{
													$(this).removeAttr('style');
													$(this).removeClass('mrEdit');
													$(this).addClass('textbox_with_label');

													if(unit.length > 0)
													{
														$(this).after("<label for='" + $(this).attr('id') + "' class = 'unit_style'>" + unit + "</span>" + (has_checkbox === true ? "<div></div>" : ""));
													}
													else
													{
														if(has_checkbox)
														{
															$(this).after("<div></div>");
														}
													}
													
													if($(this).val().toString().length > 0)
													{
														$(this).val($.fn.formatNumeric($(this).val().replace(',','.'), scale));
													}
												}
											});
											break;
										case 'DD/MM/YYYY':
											var str_html_day = "<select name = 'box_option_day' id = 'box_option_day' class = 'box_option'><option value = '-1' selected>--</option>";
									
											for(i = 1; i <= 31; i++)
											{
												str_html_temp = "<option value = '" + i.toString() + "'>" + i.toString() + "</option>";
												
												str_html_day += str_html_temp;
											}
											
											str_html_day += "</select>";
											
											var str_html_month = "<select name = 'box_option_month' id = 'box_option_month' class = 'box_option'><option value = '-1' selected>--</option>";
											
											for(i = 1; i <= 12; i++)
											{
												str_html_temp = "<option value = '" + i.toString() + "'>" + i.toString() + "</option>";
												
												str_html_month += str_html_temp;
											}
											
											str_html_month += "</select>";
											
											var str_html_year = "<select name = 'box_option_year' id = 'box_option_year'  class = 'box_option'><option value = '-1' selected>----</option>";
											
											for(i = minYear; i <= maxYear; i++)
											{
												str_html_temp = "<option value = '" + i.toString() + "'>" + i.toString() + "</option>";
												
												str_html_year += str_html_temp;
											}
											
											str_html_year += "</select>";
											
											str_html = "<span class = 'box_select_date'>" + str_html_day + " / " + str_html_month + " / " + str_html_year + $(this).html() + "</span>";
											
											$(this).html(str_html);
											
											$('.box_select_date').children().each(function(){
												
												if($(this).is('input:text'))
												{
													if(has_checkbox)
													{
														$(this).after("<div></div>");
													}

													var date_selected = $(this).val();
											
													if(date_selected.toString().length > 0)
													{
														$('select[name="box_option_day"]').val(parseInt(date_selected.toString().substring(0, 2)));
														$('select[name="box_option_month"]').val(parseInt(date_selected.toString().substring(3, 5)));
														$('select[name="box_option_year"]').val(parseInt(date_selected.toString().substring(6, 11)));
													}
													
													$(this).hide();
												}
											});
											break;
										case 'HH:MM':
											var str_html_hour = "<select name = 'box_option_hour' id = 'box_option_hour' class = 'box_option'><option value = '-1' selected>--</option>";
									
											for(i = 0; i <= 23; i++)
											{
												str_html_temp = "<option value = '" + i.toString() + "'>" + i.toString() + "</option>";
												
												str_html_hour += str_html_temp;
											}
											
											str_html_hour += "</select>";
											
											var str_html_minute = "<select name = 'box_option_minute' id = 'box_option_minute' class = 'box_option'><option value = '-1' selected>--</option>";
											
											for(i = 0; i <= 59; i = i + step)
											{
												str_html_temp = "<option value = '" + i.toString() + "'>" + i.toString() + "</option>";
												
												str_html_minute += str_html_temp;
											}
											
											str_html_minute += "</select>";
											
											str_html = "<span class = 'box_select_time'>" + str_html_hour + " : " + str_html_minute + $(this).html() + "</span>";
											
											$(this).html(str_html);
										
											$('.box_select_time').children().each(function(){
												
												if($(this).is('input:text'))
												{
													if(has_checkbox)
													{
														$(this).after("<div></div>");
													}

													var time_selected = $(this).val();

													if(time_selected.toString().length > 0)
													{
														$('select[name="box_option_hour"]').val(parseInt(time_selected.toString().substring(0, 2)));
														$('select[name="box_option_minute"]').val(parseInt(time_selected.toString().substring(3, 5)));
													}
													
													$(this).hide();
												}
											});
											break;
									}
								}
							});

							$('.question_banners').hide();
						
							if($('input:checkbox').prop('checked'))
							{
								$('input:checkbox').next('label').addClass('selected');
							}
						}
					});						
				}
			});

			$('select[name="box_option_day"]').change(function(){
				
				var $this;

				$(this).parent().children().each(function(){

					if($(this).is('input:text'))
					{
						$this = $(this);
					}
				});

				if(parseInt($(this).val()) !== -1 && parseInt($('select[name="box_option_month"]').val()) !== -1 && parseInt($('select[name="box_option_year"]').val()) !== -1)
				{
					var _day = $(this).val();
					var _month = parseInt($('select[name="box_option_month"]').val());
					var _year = parseInt($('select[name="box_option_year"]').val());
					
					var str_day = (_day >= 1 && _day <= 9 ? ("0" + _day.toString()) : _day.toString());
					var str_month = (_month >= 1 && _month <= 9 ? ("0" + _month.toString()) : _month.toString());
					
					if($.fn.checkDateTime(str_day + "/" + str_month + "/" + _year.toString()))
					{
						$this.val(str_day + "/" + str_month + "/" + _year.toString());	
					}
					else
					{
						$('select[name="box_option_day"]').val(-1);
						$this.val("");
					}
				}
				else
				{
					$this.val("");
				}
				
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
			
			$('select[name="box_option_month"]').change(function(){
				
				var $this;

				$(this).parent().children().each(function(){

					if($(this).is('input:text'))
					{
						$this = $(this);
					}
				});

				if(parseInt($(this).val()) !== -1 && parseInt($('select[name="box_option_month"]').val()) !== -1 && parseInt($('select[name="box_option_year"]').val()) !== -1)
				{
					var _day = parseInt($('select[name="box_option_day"]').val());
					var _month = $(this).val();
					var _year = parseInt($('select[name="box_option_year"]').val());
					
					var str_day = (_day >= 1 && _day <= 9 ? ("0" + _day.toString()) : _day.toString());
					var str_month = (_month >= 1 && _month <= 9 ? ("0" + _month.toString()) : _month.toString());
					
					if($.fn.checkDateTime(str_day + "/" + str_month + "/" + _year.toString()))
					{
						$this.val(str_day + "/" + str_month + "/" + _year.toString());	
					}
					else
					{
						$('select[name="box_option_month"]').val(-1);
						$this.val("");
					}
				}
				else
				{
					$this.val("");
				}
				
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
			
			$('select[name="box_option_year"]').change(function(){
				
				var $this;

				$(this).parent().children().each(function(){

					if($(this).is('input:text'))
					{
						$this = $(this);
					}
				});

				if(parseInt($(this).val()) !== -1 && parseInt($('select[name="box_option_month"]').val()) !== -1 && parseInt($('select[name="box_option_year"]').val()) !== -1)
				{
					var _day = parseInt($('select[name="box_option_day"]').val());
					var _month = parseInt($('select[name="box_option_month"]').val());
					var _year = $(this).val();
					
					var str_day = (_day >= 1 && _day <= 9 ? ("0" + _day.toString()) : _day.toString());
					var str_month = (_month >= 1 && _month <= 9 ? ("0" + _month.toString()) : _month.toString());
					
					if($.fn.checkDateTime(str_day + "/" + str_month + "/" + _year.toString()))
					{
						$this.val(str_day + "/" + str_month + "/" + _year.toString());	
					}
					else
					{
						$('select[name="box_option_year"]').val(-1);
						$this.val("");
					}
				}
				else
				{
					$this.val("");
				}
				
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
			
			$('select[name="box_option_hour"]').change(function(){
				
				var $this;

				$(this).parent().children().each(function(){

					if($(this).is('input:text'))
					{
						$this = $(this);
					}
				});

				if(parseInt($(this).val()) !== -1 && parseInt($('select[name="box_option_minute"]').val()) !== -1)
				{
					var _hour = $(this).val();
					var _minute = parseInt($('select[name="box_option_minute"]').val());
					
					var str_hour = (_hour >= 0 && _hour <= 9 ? ("0" + _hour.toString()) : _hour.toString());
					var str_minute = (_minute >= 0 && _minute <= 9 ? ("0" + _minute.toString()) : _minute.toString());
					
					$this.val(str_hour + ":" + str_minute);
				}
				else
				{
					$this.val("");
				}
				
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
			
			$('select[name="box_option_minute"]').change(function(){
				
				var $this;

				$(this).parent().children().each(function(){

					if($(this).is('input:text'))
					{
						$this = $(this);
					}
				});

				if(parseInt($('select[name="box_option_hour"]').val()) !== -1 && parseInt($(this).val()) !== -1)
				{
					var _hour = parseInt($('select[name="box_option_hour"]').val());
					var _minute = $(this).val();
					
					var str_hour = (_hour >= 0 && _hour <= 9 ? ("0" + _hour.toString()) : _hour.toString());
					var str_minute = (_minute >= 0 && _minute <= 9 ? ("0" + _minute.toString()) : _minute.toString());
					
					$this.val(str_hour + ":" + str_minute);
				}
				else
				{
					$this.val("");
				}
				
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
			
			$('input:text').keyup(function(event){
				
				if(!(event.keyCode >= 37 && event.keyCode <= 40))
				{
					switch(type)
					{
						case '0,000':
							if(scale === 0)
							{
								$(this).val($(this).val().replace(/[^0-9\,]/g,''));
							}
							else
							{
								$(this).val($(this).val().replace(/[^0-9\,\.]/g,''));
								
								if($(this).val().toString().substring($(this).val().length - 1, $(this).val().length) === '.')
								{
									if(event.keyCode == 8) //Backspace
									{
										$(this).val($(this).val().toString().substring(0, $(this).val().toString().length - 1));
									}
								
									if($(this).val().toString().substring(0, $(this).val().length - 1).indexOf('.') != -1)
									{
										$(this).val($(this).val().substring(0, $(this).val().length - 1));
									}	
								}
							}
							break;
					}
					
					$(this).val($.fn.formatNumeric($(this).val().toString(), scale));	
					
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
				}
			});
			
			$('input:checkbox').change(function(){
				
				var ischecked = false;
			
				if($(this).is(':checked'))
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
						
						if(ischecked && ($(this).is('input:text') || $(this).is('textarea')))
						{
							$(this).val("");
						}
						
						if(ischecked && ($(this).is('select[name="box_option_day"]') || $(this).is('select[name="box_option_month"]') || $(this).is('select[name="box_option_year"]') || $(this).is('select[name="box_option_hour"]') || $(this).is('select[name="box_option_minute"]')))
						{
							$(this).val(-1);
						}
					});
				}
			});
			
			$('input:submit').click(function(){
				
				$('.question_controls').children().each(function(){
					
					if($(this).is('span'))
					{
						$(this).children().each(function(){
							
							if($(this).is('input:text'))
							{
								if($(this).val().toString().length > 0)
								{
									var value = $.fn.replaceAllCharacters($(this).val().toString(),',','');

									switch($('html').attr('lang').toLowerCase())
									{
										case 'vi-vn':
											value = value.replace('.',',');

											$(this).val(value);	

											var arr_number = $(this).val().toString().split(',');
									
											if(arr_number.length === 2)
											{
												if(arr_number[1].toString().length === 0)
												{
													$(this).val($(this).val().toString().substring(0, $(this).val().toString().length - 1));
												}
											}
											break;
										default:
											$(this).val(value);	

											var arr_number = $(this).val().toString().split('.');
									
											if(arr_number.length === 2)
											{
												if(arr_number[1].toString().length === 0)
												{
													$(this).val($(this).val().toString().substring(0, $(this).val().toString().length - 1));
												}
											}
											break;
									}
								}
							}
						});
					}
				});
			});
		}
	});


	
});