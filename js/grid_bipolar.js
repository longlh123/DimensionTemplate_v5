/*****************************************************************/
/**																**/
/**	Name: grid_defaulticons.js									**/
/**	Summary: GRID DEFAULTICONS QUESTION                         **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/
(function($){
	$.fn.toggleOtherCategoricalTextBox = function(obj, ischecked){
		
		obj.children().each(function(){
			
			if($(this).is('span'))
			{
				$(this).toggle();
				
				$(this).children().each(function(){
						
					if(!ischecked && $(this).is('input:text'))
					{
						$(this).val("");
					}
				});

				if(ischecked)
				{
					$(this).show();
				}
				else
				{
					$(this).hide();
				}
			}
		});
	};

	//Functions
	$.fn.getTableData = function($table){

		var objRows = {};
		var index_row = 0, index_col = 0, index_header = -1;
		var arr_idx_cat_exclusives = [];
		var row_expand_grid = true;
		var cat = 'undefined';

		$table.find('tbody').children().each(function(){

			index_row = index_row + 1;
			index_col = 0;

			var objCells = {};
			var str_type = "";
			
			if(index_row == 1)
			{
				$(this).children().each(function(){

					if($(this).prop('class') == "mrGridQuestionText")
					{
						row_expand_grid = true;
					} 
					if($(this).prop('class') == "mrGridCategoryText")
					{
						row_expand_grid = false;
					} 
				});
			}

			$(this).children().each(function(){
				
				index_col = index_col + 1;

				var cell_name = $(this).prop('tagName').toLowerCase() + "_row" + index_row + "_col" + index_col;

				if($(this).children().length == 0)
				{
					str_type = 'thead';

					objCells[cell_name] = { type        : 'thead',
											id          : "#" + $(this).prop('id'),
											selector    : $(this),
											tab_name    : $(this).prop('tagName').toLowerCase(),
											row         : index_row,
											col         : index_col,
											cat_selector: undefined,
											ischeckbox  : false,
											ischecked   : false,
											isexclusive : false
										};

					index_header = index_row;
				}
				else
				{
					if(index_header != index_row)
					{
						index_header = -1
					}

					switch($(this).prop('class'))
					{
						case "mrGridQuestionText":
							str_type = index_header == -1 ? 'tbody' : 'thead';

							objCells[cell_name] = { type        : str_type, 
													id          : "#" + $(this).prop('id'),
													selector    : $(this),
													tab_name    : $(this).prop('tagName').toLowerCase(),
													row         : index_row,
													col         : index_col,
													cat_selector: undefined,
													ischeckbox  : false,
													ischecked   : false,
													isexclusive : false
												};

							if(index_row == 1)
							{
								var styles = $(this).children('span').attr('style').split(';');

								if(styles.length == 2)
								{
									cat = parseInt($(this).attr('id').split('.')[1])

									if(arr_idx_cat_exclusives.indexOf(cat) == -1) arr_idx_cat_exclusives.push(cat);
								}
							}
							else
							{
								if(index_col == 1 && !row_expand_grid)
								{
									var styles = $(this).children('span').attr('style').split(';');

									if(styles.length == 2)
									{
										cat = parseInt($(this).attr('id').split('.')[2])

										if(arr_idx_cat_exclusives.indexOf(cat) == -1) arr_idx_cat_exclusives.push(cat);
									}
								}
							}
							break;
						case "mrGridCategoryText":
							str_type = index_header == -1 ? 'tbody' : 'thead';

							objCells[cell_name] = { type        : str_type, 
													id          : "#" + $(this).prop('id'),
													selector    : $(this),
													tab_name    : $(this).prop('tagName').toLowerCase(),
													row         : index_row,
													col         : index_col,
													cat_selector: undefined,
													ischeckbox  : false,
													ischecked   : false,
													isexclusive : false
												};
							break;					
						default:
							var cat_type = "cat";

							if(arr_idx_cat_exclusives.indexOf(parseInt($(this).attr('id').split('.')[(row_expand_grid === true ? 1 : 2)])) != -1)
							{
								cat_type = "cat_exlusive";
							}
							else
							{
								if($(this).find('span').length > 0)
								{
									if($(this).find('span').find('input:text').length > 0)
									{
										cat_type = "cat_other";
									}	
								}
							}

							str_type = 'tbody';
							
							var _ischeckbox = false, _ischecked = false, _isexclusive = false;

							/*--Kiểm tra categorical là checkbox hay radio--*/

							if($(this).find('input:checkbox').length > 0) _ischeckbox = true;

							/*--Kiểm tra categorical có được check không?--*/

							var $this = $(this).find('input:checkbox').length > 0 ? $(this).find('input:checkbox') : $(this).find('input:radio'); 

							if($this.prop('checked'))
							{
								$this.attr('checked', true);
								_ischecked = true;
							}

							$.fn.toggleOtherCategoricalTextBox($(this), $this.attr('checked'));

							/*--Kiểm tra categorical có hide không? (style = 'visibility: hidden')--*/ 

							var styles = $this.attr('style').split(';');
							
							var str_styles = "";

							if(styles.length > 1)
							{
								$.each(styles, function(index, style){

									switch(style.split(':')[0].replace(' ','').toLowerCase())
									{
										case 'visibility':
											if(style.split(':')[1].replace(' ','').toLowerCase() == 'hidden')
											{
												$this.parent().attr('bgcolor', '#f1f1f1');
												
												str_styles = "style = 'visibility: hidden'";
											}
											break;
									}
								});
							}

							var str_html = "<label for = '" + $(this).children('input').prop('id') + "' class = '" + cat_type + "' " + (str_styles.length == 0 ? "" : str_styles) + "></label>";

							$this.after(str_html);

							objCells[cell_name] = { type        : 'tbody',
													id          : "#" + $(this).prop('id'),
													selector    : $(this),
													tab_name    : $(this).prop('tagName').toLowerCase(),
													row         : index_row,
													col         : index_col,
													cat_selector: $this,
													ischeckbox  : _ischeckbox,
													ischecked   : _ischecked,
													isexclusive : (arr_idx_cat_exclusives.indexOf(parseInt($(this).attr('id').split('.')[1])) != -1 ? true : false)
												};
							break;
					}
				}
				
			});

			objRows['row' + index_row] = { type : str_type,
										   index : index_row,	
										   cells : objCells
											};
		});

		return objRows;
	};

	$.fn.makeTable = function($table){

		var objTable = $.fn.getTableData($table);

		var str_table = "<table id ='defaulticon_table'>";
		var str_tr_thead = "<thead>";
		var str_tr_tbody = "<tbody>";

		var numberofcolumns = 0;
		var wcol_title = 0, wcol_cat = 0;

		$.each(objTable, function(index_row, row){

			if(row['type'] == "thead")
			{
				numberofcolumns = Object.keys(row['cells']).length;

				wcol_title = 30 + "%";
				wcol_cat = (40 / (numberofcolumns - 1)).toString()  + "%";
			}

			var str_tr = "<tr>";

			var contents = [];

			$.each(row['cells'], function(index_cell, cell){

				$cell = cell['selector'];

				if(cell['type'] == 'thead')
				{
					$cell.removeClass('mrGridQuestionText');
					$cell.addClass('cellofheader');
					$cell.children("span").removeClass("mrQuestionText");
					$cell.children("span").addClass("contentofheader");

					$cell.css({"width" : (cell['col'] == 1 ? wcol_title : wcol_cat)});
				}
				else
				{
					if($cell.find('input').length > 0)
					{
						$cell.find('input').next().css({"padding-bottom" : "20px"});
					}
					else
					{
						contents = $cell.find('span').text().split('][')
						
						$cell.find('span').text(contents[0].substring(1, contents[0].length));
					}
				}

				str_tr += $cell.wrap('<div></div>').parent().html();
			});

			if(row['type'] == "thead")
			{
				if(row['index'] == 1) 
				{
					str_tr_thead += str_tr + "<td id='Cell." + numberofcolumns + ".0' class = 'cellofheader' style='width: " + wcol_title + ";'></td>" + "</tr>";
				}
				else if(row['index'] > 1) 
				{
					str_tr_tbody += str_tr + "<td id='Cell." + numberofcolumns + ".0' class = 'cellofheader' style='width: " + wcol_title + ";'></td>" + "</tr>";
				}
			}
			else
			{
				str_tr_tbody += str_tr + "<td id = 'Cell." + numberofcolumns + "." + (row['index'] - 1) + "' class='mrGridCategoryText' style='text-Align: Left;vertical-align: Middle;'><span class='mrQuestionText' style=''>" + contents[1].substring(0, contents[1].length - 1) + "</span></td>" + "</tr>";
			}
		});

		if(str_tr_thead.length > 0) 
		{
			str_table += str_tr_thead + "</thead>";
		}
		if(str_tr_tbody.length > 0) 
		{
			str_table += str_tr_tbody + "</tbody>";
		}
	
		str_table += "</table>";

		var $parent = $table.parent();

		$parent.empty();
		$parent.html(str_table);
	};

	$.fn.toChangeCheckboxAndRadio = function($this, ids, row_expand_grid){
		
		var iteration = row_expand_grid === true ? $this.parent().prop('id').split('.')[2] : $this.parent().prop('id').split('.')[1];

		var cats = ids[iteration];

		$this.attr('checked', $this.prop('checked'));

		var id = $this.parent().attr('id');

		switch($this.next().attr('class'))
		{
			case 'cat':
				$.each(cats, function(index, cat){

					if(cat['id'] != id)
					{
						cat['selector'].children().each(function(){

							if($(this).is('input:checkbox') || $(this).is('input:radio'))
							{
								switch($(this).next().prop('class'))
								{
									case 'cat_other':
										if($(this).is('input:radio'))
										{
											$.fn.toggleOtherCategoricalTextBox($(this).parent(), false);
										}
										break;
									case 'cat_exlusive':
										$(this).prop('checked', false);
										break;
								}
							}
						});
					}
				});
				break;
			case 'cat_other':
				$.fn.toggleOtherCategoricalTextBox($this.parent(), $this.attr('checked'));

				$.each(cats, function(index, cat){

					if(cat['id'] != id)
					{
						cat['selector'].children().each(function(){

							if($(this).is('input:checkbox') || $(this).is('input:radio'))
							{
								switch($(this).next().prop('class'))
								{
									case 'cat_exlusive':
										$(this).prop('checked', false);
										break;
								}
							}
						});
					}
				});
				break;
			case 'cat_exlusive':
				$.each(cats, function(index, cat){

					if(cat['id'] != id)
					{
						cat['selector'].children().each(function(){

							if($(this).is('input:checkbox') || $(this).is('input:radio'))
							{
								$(this).prop('checked', false);

								if($(this).next().prop('class') == 'cat_other')
								{
									$.fn.toggleOtherCategoricalTextBox($(this).parent(), false);
								}
							}
						});
					}
				});
				break;
		}
	}

}(jQuery));

$(document).ready(function(){

	$('.content').children().each(function(){

		if($(this).prop('class') === "Grid_Bipolar_namediv")
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

											/*Kiểm tra grid là row expand grid hoặc column expand grid*/
											var row_expand_grid = true;

											$('#defaulticon_table').find('thead').children().each(function(){

												$(this).children().each(function(){

													if($(this).prop('class') == "mrGridQuestionText")
													{
														row_expand_grid = true;
													} 
													if($(this).prop('class') == "mrGridCategoryText")
													{
														row_expand_grid = false;
													} 
												});
											});

											/*Danh sách các ids có trong table*/
											var ids = {};
											var idx_row = 0, idx_col = 0;

											$('#defaulticon_table').find('tbody').children().each(function(){

												var iteration = 'undefined';

												if(row_expand_grid)
												{
													/*--grid là row expand grid--*/
													var cats = [];
													
													$(this).children().each(function(){

														if($(this).find('input:checkbox').length > 0 || $(this).find('input:radio').length > 0)
														{
															iteration = $(this).prop('id').split('.')[2];

															cats.push({'id' : $(this).prop('id'), 'selector' : $(this)});
														}
													});

													if(cats.length > 0) ids[iteration] = cats;
												}
												else
												{
													/*--grid là column expand grid--*/
													
													$(this).children().each(function(){

														if($(this).find('input:checkbox').length > 0 || $(this).find('input:radio').length > 0)
														{
															iteration = $(this).prop('id').split('.')[1];

															if(!ids[iteration])
															{
																// if 'iteration' not exist in obj
																var cats = [];
																cats.push({'id' : $(this).prop('id'), 'selector' : $(this)});
																ids[iteration] = cats;
															}
															else
															{
																ids[iteration].push({'id' : $(this).prop('id'), 'selector' : $(this)});
															}
														}
													});
												}
											});

											$('input:radio').change(function(){
												
												$.fn.toChangeCheckboxAndRadio($(this), ids, row_expand_grid);
											});

											$('input:checkbox').change(function(){

												$.fn.toChangeCheckboxAndRadio($(this), ids, row_expand_grid);
											});
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