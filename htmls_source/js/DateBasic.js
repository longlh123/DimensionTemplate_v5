(function($){
    /*
    obj = {
        placeholder : "text", //a symbol or piece of text that temporarily replaces st that is missing. 
        validation : "checkphonenumber", //the act of proving that st is true or correct
        type : "text|long|double", 
        sum : value
    }
    */
    $.fn.convertJSON = function(s){
        var obj = {};
        var a = s.split(',');
        $.each(a, function(k, v){
            var b = v.split(':');
            obj[b[0].toLowerCase()] = b[1];
        });

        //set the default value of type of a text field is 'text'.
        if(!obj.hasOwnProperty('type')) obj['type'] = 'text';
        //set the default value of validation is null.
        if(!obj.hasOwnProperty('validation')) obj['validation'] = null;
        //set the default value of placeholder
        if(!obj.hasOwnProperty('placeholder')) obj['placeholder'] = 'Điền câu trả lời...'
        //set the default value of step
        if(!obj.hasOwnProperty('step')) obj['step'] = 1
        return obj;
    };

    $.fn.checkDate = function(dt){
		
		var d = parseInt(dt.substring(0, 2));
		var m = parseInt(dt.substring(3, 5));
		var y = parseInt(dt.substring(6, 11));
		
		var result = false;
		
		switch(m)
		{
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				if(d >= 1 && d <= 31)
				{
					result = true;
				}
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				if(d >= 1 && d <= 30)
				{
					result = true;
				}
				break;
			case 2:
				if(y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0))
				{
					if(d >= 1 && d <= 29)
					{
						result = true;
					}
				}
				else
				{
					if(d >= 1 && d <= 28)
					{
						result = true;
					}
				}
		}
		
		return result;
	};
}(jQuery));

$(document).ready(function(){
    var objProperties = {};
    var $properties = undefined;
    var id = "";
    var $textbox = null;

    var dateNow = new Date();
    var month = dateNow.getMonth() + 1;
    var day = dateNow.getDate();
    var year = dateNow.getFullYear();

    $('.datebasic').children().each(function(){

        if($(this).prop('class') == "mrBannerText"){

            $properties = $(this).find(".custom_question_properties");
            $(this).hide();
        } else if($(this).is("span")) {
            
            $(this).children().each(function(){

                if($(this).is('input:text'))
                {
                    id = $(this).prop('id');
                    
                    $textbox = $(this);
                    $textbox.hide();

                    var str_obj = ($properties == undefined ? "" : $properties.html());
                    objProperties[id] = $.fn.convertJSON(str_obj);
                    $properties = undefined;
                } 
            });
        } else if($(this).prop('class') == "datebasic-container"){

            var d = null, m = null, y = null;
            
            if($textbox.val().length > 0){
                d = parseInt($textbox.val().split('/')[0]);
                m = parseInt($textbox.val().split('/')[1]);
                y = parseInt($textbox.val().split('/')[2]);
            }

            var day_html = "<span><select class='sel-day'>";
            day_html += "<option value='--' disabled='disabled' selected>Ngày</option>";

            for(var i = 1; i <= 31; i++){
                if(d == i){
                    day_html += "<option value='" + i + "' selected>" + i + "</option>"
                } else {
                    day_html += "<option value='" + i + "'>" + i + "</option>"
                }
            }
            
            day_html += "</select></span>";

            var month_html = "<span><select class='sel-month'>";
            month_html += "<option value='--' disabled='disabled' selected>Tháng</option>";

            for(var i = 1; i <= 12; i++){
                if(m == i) {
                    month_html += "<option value='" + i + "' selected>" + i + "</option>"
                } else {
                    month_html += "<option value='" + i + "'>" + i + "</option>"
                }
            }
            
            month_html += "</select></span>";

            var year_html = "<span><select class='sel-year'>";
            year_html += "<option value='--' disabled='disabled' selected>Năm</option>";

            for(var i = year + 5; i >= 1900; i--){
                if(y == i){
                    year_html += "<option value='" + i + "' selected>" + i + "</option>"
                } else {
                    year_html += "<option value='" + i + "'>" + i + "</option>"
                }   
            }

            year_html += "</select></span>";

            $(this).html(day_html + "<span class='separate'>/</span>" + month_html + "<span class='separate'>/</span>" + year_html);
        }

    });

    $('input:submit').click(function(e){
        
        if($(e.currentTarget).prop('name') == '_NNext'){

            var datebasics = $('.datebasic').find('.datebasic-container');
        
            $('.datebasic').find('.error').remove();
            
            $.each(datebasics, function(key, datebasic){
                
                var $sel_day = $(datebasic).find('.sel-day');
                var $sel_month = $(datebasic).find('.sel-month');
                var $sel_year = $(datebasic).find('.sel-year');
                
                var $txt = $(datebasic).parent().find('input:text');

                if($sel_day.val() != null && $sel_month.val() != null && $sel_year.val() != null){
                    
                    var dt = ($sel_day.val().length == 1 ? "0" : "") + $sel_day.val() + "/" + ($sel_month.val().length == 1 ? "0" : "") + $sel_month.val() + "/" + $sel_year.val();

                    if($.fn.checkDate(dt)){
                        $txt.val(dt);
                    } else {
                        var str = "<span class='error'>&ldquo;" + "Ngày '" + dt + "' không hợp lệ." + "&rdquo;</span>";
                    
                        if($(datebasic).parent().find('.mrBannerText').length == 1){
                            $(datebasic).parent().find('.mrBannerText').after(str);
                        }
                        else {
                            $(datebasic).parent().prepend(str);
                        }

                        e.preventDefault();    
                    }

                    console.log(dt);
                }else{
                    var str = "<span class='error'>&ldquo;" + "Nhập thông tin Ngày/Tháng/Năm." + "&rdquo;</span>";
                    
                    if($(datebasic).parent().find('.mrBannerText').length == 1){
                        $(datebasic).parent().find('.mrBannerText').after(str);
                    }
                    else {
                        $(datebasic).parent().prepend(str);
                    }

                    e.preventDefault();
                }
            });
        }
    });
});




