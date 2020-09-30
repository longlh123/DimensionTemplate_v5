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

    $.fn.formatNumber = function(num, lang) {
        switch(lang)
        {
            case "vi-vn":
                var n = num.toString().split(',');
                p = n[0].toString().split('.').join('');  
                return p.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.') + (n.length == 2 ? "," + n[1] : "");
                break;
            default:
                var n = num.toString().split('.');
                p = n[0].toString().split(',').join('');  
                return p.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.') + (n.length == 2 ? "." + n[1] : "");
                break;
        }
    };

    $.fn.valCheckPhoneNumber = function(n){
        var regexPattern = new RegExp(/^[0-9]{8,10}$/);
        return regexPattern.test(n);
    };

    $.fn.valCheckCellPhoneNumber = function(n){
        var regexPattern = new RegExp(/0((3[2-9]|5[2,6,8,9]|7[0,6-9]|8[1-6,8,9]|9[0-9])|(12[0-9]|16[2-9]|18[6,8]|199))[0-9]{7}$/);
        return regexPattern.test(n);
    };

    $.fn.valCheckEmail = function(n){
        var regexPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regexPattern.test(n);
    };
}(jQuery));

$(document).ready(function(){

    //List the custom properties, if any.
    $(".mrBannerText").css('display', 'none');

    var objProperties = {};
    var $properties = undefined;

    $(".openend_basic").children().each(function(){
        
        if($(this).prop('class') == "mrBannerText"){

            $properties = $(this).find(".custom_question_properties");

        } else if($(this).is("span")) {

            var hascheckbox = false;
            var checkboxes = new Array();

            var $textbox = null;
            var $select = null;

            var id = "";

            $(this).children().each(function(){

                if($(this).is('input:text') || $(this).is('textarea'))
                {
                    id = $(this).prop('id');
                    
                    $textbox = $(this);
                    
                    var str_obj = ($properties == undefined ? "" : $properties.html());
                    objProperties[id] = $.fn.convertJSON(str_obj);

                    console.log(objProperties);
                } 
                else if($(this).is('input:checkbox'))
                {
                    hascheckbox = true;
                    checkboxes.push($(this));

                    var $label = $(this).next().clone();

                    $(this).next().remove();
                    $(this).wrap("<span class='cat-group'/>");
                    $(this).parent().append($label);
                    
                } 
                else if($(this).is('select'))
                {
                    $select = $(this);
                }
            });

            if($textbox != null)
            {
                $textbox.attr('placeholder', objProperties[id]['placeholder']);

                //Nếu textbox có giá trị thì sẽ tạo lại format 0.000,000
                if($textbox.val().length > 0)
                {
                    if(objProperties[id]['type'].toLowerCase() == 'long' || objProperties[id]['type'].toLowerCase() == 'double')
                    {
                        $textbox.val($.fn.formatNumber($textbox.val(), $('html').attr('lang').toLowerCase()));
                    }
                }
                
                $textbox.change(function(){
                
                    if($(this).val().length > 0)
                    {
                        for(var i = 0; i < checkboxes.length; i++)
                        {
                            if(checkboxes[i].is(':checked'))
                            {
                                checkboxes[i].prop('checked', false);
                            }
                        }
                    }
                });
                
                if(Object.keys(objProperties[id]).length)
                {
                    //Nếu type = long|double sẽ format theo 0.000,000
                    if(objProperties[id]['type'].toLowerCase() == 'long' || objProperties[id]['type'].toLowerCase() == 'double')
                    {
                        //Chỉ cho phép textbox được nhập number
                        $textbox.keypress(function(e){
                            //44 - dấu phẩy
                            //46 - dấu chấm
                            var lang = $('html').attr('lang').toLowerCase();
                            var f = objProperties[id]['type'].toLowerCase() == 'long' ? ((e.keyCode >= 48 && e.keyCode <= 57) && e.keyCode != 44 && e.keyCode != 46)
                                            : ((lang == "vi-vn" ? (((e.keyCode >= 48 && e.keyCode <= 57) || 
                                            e.keyCode == 44) && e.keyCode != 46) : (((e.keyCode >= 48 && e.keyCode <= 57) 
                                            || e.keyCode == 46) && e.keyCode != 44)));
                            //alert(f);
                            if(!f)
                            {
                                e.preventDefault();
                                return false;
                            }
                        });

                        //Format giá trị sau mỗi lần nhập 
                        $textbox.keyup(function(){
                            
                            $(this).val($.fn.formatNumber($(this).val(), $('html').attr('lang').toLowerCase()));
                        });
                    } 
                }
                 
                //Xóa giá trị tren textbox nếu checkbox được chọn
                if(hascheckbox)
                {
                    for(var i = 0; i < checkboxes.length; i++)
                    {
                        checkboxes[i].change(function(){
    
                            if($(this).is(':checked'))
                            {
                                $textbox.val("");
                            }
                        });
                    }
                }
            }
            
            if($select != null)
            {
                $select.append('<option value="" disabled="disabled" selected>Chọn câu trả lời...</option>');
            }
        }
    });

    //Format lại giá trị number khi nhấn submit
    $('input:submit').click(function(e){

        $('.openend_basic').children().each(function(){

            if($(this).is('span')){

                $(this).children().each(function(){
                    
                    if($(this).prop('class') == "error"){
                        $(this).remove();
                    } else if($(this).is('input:text'))
                    {
                        var props = objProperties[$(this).prop('id')];

                        if($(this).val().length > 0){
                            
                            switch(props['type'].toLowerCase())
                            {
                                case 'long':
                                case 'double':
                                    //Nếu format theo 0.000,000
                                    switch($('html').attr('lang').toLowerCase())
                                    {
                                        case "vi-vn":
                                            $(this).val($(this).val().split('.').join(''));
                                            break;
                                        default:
                                            $(this).val($(this).val().split(',').join(''));
                                            break;
                                    }
                                    break;   
                                case 'text':
                                    if(props['validation'] != null){
                                        switch(props['validation'].toLowerCase()){
                                            case 'checkphonenumber':
                                                if(!$.fn.valCheckPhoneNumber($(this).val())){
                                                    
                                                    $(this).parent().prepend("<span class='error'>&ldquo;" + "Số điện thoại không đúng." + "&rdquo;</span>");
                                                    $(this).parent().parent().find('.mrErrorText').hide();
                                                    e.preventDefault();
                                                }
                                                break;
                                            case 'checkcellphonenumber':
                                                if(!$.fn.valCheckCellPhoneNumber($(this).val())){
                                                    $(this).parent().prepend("<span class='error'>&ldquo;" + "Số điện thoại không đúng." + "&rdquo;</span>");
                                                    $(this).parent().parent().find('.mrErrorText').hide();
                                                    e.preventDefault();
                                                }
                                                break;
                                            case 'checkemail':
                                                if(!$.fn.valCheckEmail($(this).val())){
                                                    $(this).parent().prepend("<span class='error'>&ldquo;" + "Email không đúng." + "&rdquo;</span>");
                                                    $(this).parent().parent().find('.mrErrorText').hide();
                                                    e.preventDefault();
                                                }
                                                break;
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
});