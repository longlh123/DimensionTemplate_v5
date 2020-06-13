(function($){
    $.fn.convertJSON = function(s){
        var obj = {};
        var a = s.split(',');
        $.each(a, function(k, v){
            var b = v.split(':');
            obj[b[0].toLowerCase()] = b[1];
        })
        //Default is Text
        if(!obj.hasOwnProperty('type')) obj['type'] = 'text';
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
    }
}(jQuery));

$(document).ready(function(){

    //List the custom properties, if any.
    $(".mrBannerText").css('display', 'none');

    var props= {};

    if($(".custom_question_properties").length)
    {  
        var str_obj = $(".custom_question_properties").html();
        props = $.fn.convertJSON(str_obj);
    }

    $(".openend_basic").children().each(function(){
        
        if($(this).is("span"))
        {
            var hascheckbox = false;
            var checkboxes = new Array();

            var $textbox = null;
            var $select = null;

            $(this).children().each(function(){

                if($(this).is('input:text') || $(this).is('textarea'))
                {
                    $textbox = $(this);
                    
                    if(props.hasOwnProperty('placeholder'))
                    {
                        $textbox.attr('placeholder', props['placeholder']);
                    }
                } 
                else if($(this).is('input:checkbox'))
                {
                    hascheckbox = true;
                    checkboxes.push($(this));
                } 
            });

            if($textbox != null)
            {
                //Nếu textbox có giá trị thì sẽ tạo lại format 0.000,000
                if($textbox.val().length > 0)
                {
                    $textbox.val($.fn.formatNumber($textbox.val(), $('html').attr('lang').toLowerCase()));
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
                
                if(Object.keys(props).length)
                {
                    //Nếu type = long|double sẽ format theo 0.000,000
                    if(props['type'].toLowerCase() == 'long' || props['type'].toLowerCase() == 'double')
                    {
                        //Chỉ cho phép textbox được nhập number
                        $textbox.keypress(function(e){
                            //44 - dấu phẩy
                            //46 - dấu chấm
                            var lang = $('html').attr('lang').toLowerCase();
                            //alert(lang + " " +  e.keyCode);
                            var f = true;
                            f = f && (e.keyCode >= 48 && e.keyCode <= 57);
                            f = f && props['type'].toLowerCase() == 'long' ? e.keyCode != 44 && e.keyCode != 46
                                        : (lang == "vi-vn" ? e.keyCode != 46 : e.keyCode != 44);
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

                        //Format lại giá trị number khi nhấn submit
                        $('input:submit').click(function(e){

                            $('.openend_basic').children().each(function(){

                                if($(this).is('span')){

                                    $(this).children().each(function(){

                                        if($(this).is('input:text'))
                                        {
                                            switch($('html').attr('lang').toLowerCase())
                                            {
                                                case "vi-vn":
                                                    $(this).val($(this).val().split('.').join(''));
                                                    break;
                                                default:
                                                    $(this).val($(this).val().split(',').join(''));
                                                    break;
                                            }
                                        }
                                    });
                                }
                            })
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
                $select.append('<option value="--">--</option>');
            }
        }
    });
});