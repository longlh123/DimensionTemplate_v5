/*****************************************************************/
/**																**/
/**	Name: base.js												**/
/**	Summary: GRID OPEN-END QUESTION                             **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/
(function($){

	//Functions
	$.fn.getTableData = function($table){

		var objRows = {};
		var index_row = 0, index_col = 0, numberofcolumns = 0;

		$table.find('tbody').children().each(function(){

			index_row = index_row + 1;
			index_col = 0;
			
			var objCells = {};
			var str_type = "";

			$(this).children().each(function(){
				
				index_col = index_col + 1;

				var cell_name = $(this).prop('tagName').toLowerCase() + "_row" + index_row + "_col" + index_col;

				if($(this).children().length == 0)
				{
					str_type = 'thead';

					objCells[cell_name] = { type      : 'thead',
											id        : "#" + $(this).prop('id'),
											selector : $(this),
											tab_name  : $(this).prop('tagName').toLowerCase(),
											row       : index_row,
											col       : index_col
										};	
				}
				else
				{
					switch($(this).prop('class'))
					{
						case "mrGridQuestionText":
							str_type = 'thead';

							objCells[cell_name] = { type      : 'thead', 
													id        : "#" + $(this).prop('id'),
													selector : $(this),
													tab_name  : $(this).prop('tagName').toLowerCase(),
													row       : index_row,
													col       : index_col
												};
							break;
						case "mrGridCategoryText":
							str_type = 'tbody';

							objCells[cell_name] = { type      : 'tbody', 
													id        : "#" + $(this).prop('id'),
													selector : $(this),
													tab_name  : $(this).prop('tagName').toLowerCase(),
													row       : index_row,
													col       : index_col
												};
							break;					
						default:
							str_type = 'tbody';

							objCells[cell_name] = { type      : 'tbody',
													id        : "#" + $(this).prop('id'),
													selector : $(this),
													tab_name  : $(this).prop('tagName').toLowerCase(),
													row       : index_row,
													col       : index_col
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

		var $tableData = $.fn.getTableData($table);

		var str_table = "<table id ='defaulticon_table'>";
		var str_tr_tbody = "<tbody>";

		var wcol_text = "60%";

		$.each($tableData, function(index_row, row){

			var str_tr = "<tr>";

			$.each(row['cells'], function(index_cell, cell){

				$cell = cell['selector'];

				if(row['index'] == 1 && cell['col'] == Object.keys(row['cells']).length)
				{
					$cell.css({"width" : wcol_text});
				}

				if($cell.find('span').length > 0)
				{
					if($cell.find('span').find('input:text').length > 0)
					{
						$cell.find('span').find('input:text').removeClass('mrEdit');
						$cell.find('span').find('input:text').addClass('textbox');
					}
				}

				str_tr += $cell.wrap('<div></div>').parent().html();
			});

			str_tr_tbody += str_tr + "</tr>";
		});

		if(str_tr_tbody.length > 0) 
		{
			str_table += str_tr_tbody + "</tbody>";
		}
	
		str_table += "</table>";

		$table.parent().html(str_table);
	};
}(jQuery));

$(document).ready(function(){

	$('.content').children().each(function(){

		if($(this).prop('class') === "Grid_OpenEnd_Basic_namediv")
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