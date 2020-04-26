/*****************************************************************/
/**																**/
/**	Name: base.js												**/
/**	Summary: CATEGORICAL DEFAULTICON 	                        **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/

(function($){
	
	$.fn.checkCategoricalType = function(obj){
		
		var isidentified = false;
		var categorical_type = "categorical";
		
		obj.children().each(function(){
			
			if($(this).is('span'))
			{
				isidentified = true;
				categorical_type = "categorical_other";
			}
		});
		
		if(!isidentified)
		{
			obj.children().each(function(){
				
				if($(this).is('input:checkbox') || $(this).is('input:radio'))
				{
					$(this).next('label').children().each(function(){
						
						if($(this).is('span'))
						{
							var styles = $(this).attr('style').split(';');
							
							if(styles.length === 2)
							{
								isidentified = true;
								categorical_type = "categorical_exclusive";
							}
						}
					});
				}
			});
		}
		
		return categorical_type;
	};

	$.fn.getCategoriesList = function($cats){

		var objCatsList = {};

		$cats.children().each(function(){

			if($(this).find('input:radio').length > 0 || $(this).find('input:checkbox').length > 0)
			{
				$(this).addClass('categorical');
				
				var $this = $(this).find('input:radio').length > 0 ? $(this).find('input:radio') : $(this).find('input:checkbox');
				
				var _ischeckbox = false;

				if($(this).find('input:checkbox').length > 0) _ischeckbox = true;

				var _ischecked = false;
				
				if($this.prop('checked'))
				{
					$this.next().addClass('selected');
					$this.attr('checked', true);
					_ischecked = true;
				}

				var _cat_type = $.fn.checkCategoricalType($(this));

				if(_cat_type === "categorical_other")
				{
					$.fn.setCSSOtherCategorical($(this));
					$.fn.toggleOtherCategoricalTextBox($(this), _ischecked);
				}

				if(_cat_type === "categorical_exclusive")
				{
					$this.next().children().each(function(){

						$(this).css("font-weight", "100");
					});
				}

				objCatsList[$this.attr('id')] = {   id        : $this.attr('id'),
													type      : _cat_type,
													selector  : $this,
													ischeckbox: _ischeckbox,
													ischecked : _ischecked
													};
			}
			else
			{
				objCatsList[$(this).attr('id')] = { id        : $(this).attr('id'),
													type      : "group",
													selector  : $this,
													ischeckbox: false,
													ischecked : false
													};
			}
		});

		$.each(objCatsList, function(index_cat, cat){

			if(cat['type'] != "group")
			{
				cat['selector'].change(function(){

					if(cat['selector'].prop('checked'))
					{
						cat['selector'].next().addClass('selected');
						cat['selector'].attr('checked', true);
						cat['ischecked'] = true;
					}
					else
					{
						cat['selector'].next().removeClass('selected');
						cat['selector'].attr('checked', false);
						cat['ischecked'] = false;
					}

					switch(cat['type'])
					{
						case "categorical":
							if(cat['ischecked'])
							{
								$.each(objCatsList, function(index_cat_1, cat_1){

									switch(cat_1['type'])
									{
										case "categorical_exclusive":
											cat_1['selector'].next().removeClass('selected');
											cat_1['selector'].prop('checked', false);
											cat_1['ischecked'] = false;
											break;
										case "categorical_other":
											if(cat_1['selector'].is('input:radio'))
											{
												$.fn.toggleOtherCategoricalTextBox(cat_1['selector'].parent(), false);
											}	
											break;
									}
								});
							}
							break;
						case "categorical_other":
							$.fn.toggleOtherCategoricalTextBox(cat['selector'].parent(), cat['ischecked']);

							if(cat['ischecked'])
							{
								$.each(objCatsList, function(index_cat_1, cat_1){

									if(cat_1['type'] == "categorical_exclusive")
									{
										cat_1['selector'].next().removeClass('selected');
										cat_1['selector'].prop('checked', false);
										cat_1['ischecked'] = false;
									}
								});
							}
							break;
						case "categorical_exclusive":
							if(cat['ischecked'])
							{
								$.each(objCatsList, function(index_cat_1, cat_1){

									if(cat_1['type'] != "group" && cat_1['id'] !== cat['id'])
									{
										cat_1['selector'].next().removeClass('selected');
										cat_1['selector'].prop('checked', false);
										cat_1['ischecked'] = false;

										if(cat_1['type'] == "categorical_other")
										{
											$.fn.toggleOtherCategoricalTextBox(cat_1['selector'].parent(), cat_1['ischecked']);
										}
									}
								});
							}	
							break;
					}
				});
			}
		});

		return objCatsList;
	};

	$.fn.setCSSOtherCategorical = function(obj){
		
		obj.children().each(function(){
			
			if($(this).is('span'))
			{
				$(this).addClass('rwd_break');

				$(this).children().each(function(){
					
					if($(this).is('input:text'))
					{
						$(this).removeClass("mrEdit");
						$(this).addClass("textbox");
					}
				});
			}
		});
	};
	
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
	
	
	
}(jQuery));

$(document).ready(function(){
	
	$('.content').children().each(function(){

		if($(this).prop('class') === "Categorical_DefaultIcons_namediv")
		{
			$(this).children().each(function(){

				if($(this).prop('class') === "control_everything")
				{
					$(this).children().each(function(){

						if($(this).prop('id') === "question_name")
						{
							$(this).children().each(function(){

								if($(this).prop('class') === "question_controls")
								{
									$(this).find('span').children().each(function(){

										if($(this).prop('class') === "mrQuestionTable")
										{
											var objCatsList = $.fn.getCategoriesList($(this));
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