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

        if(obj['validation'] != null && (obj['type'] == 'long' || obj['type'] == 'double')){
            var regExp = new RegExp(/checksum\([0-9]*\)/);

            if(regExp.test(obj['validation'].toLowerCase())){
                var str = obj['validation'].toLowerCase().replace('checksum(', '');
                str = str.replace(')', '');

                obj['validation'] = "checksum";
                obj['sumcheck'] = (obj['type'] == 'long' ? parseInt(str) : parseFloat(str));
            }
        }
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
    }

    $.fn.convertToNumber = function(n, type, lang){

        if(n.length == 0) return 0;
        
        var x = n;
        x = x.split((lang == "vi-vn" ? "." : ",")).join('');
        return (type == "long" ? parseInt(x) : parseFloat(x));
    };
}(jQuery));

$(document).ready(function(){

    //List the custom properties, if any.
    $(".mrBannerText").css('display', 'none');

    var objProperties = {};

    var str_obj = $(this).find(".custom_question_properties").length == 0 ? "" : $(this).find(".custom_question_properties").html();
    objProperties[0] = $.fn.convertJSON(str_obj);

    var contents = {}, textareas = {};
    
    switch($(".mrQuestionTable").prop('tagName').toLowerCase())
    {
        case "table":
            if($(".grid_openend_basic").find('.error').length != 0)
            {
                $(".grid_openend_basic").find('.error').hide();
            }

            $(".mrQuestionTable").addClass('grid-container');
            
            $(".mrQuestionTable").find('td').unwrap().wrap($('<tr/>'));
            
            var cols = [], rows = [];
            var isgridrow = true;

            $(".mrQuestionTable tbody tr").get().map(function(row){
                
                return $(row).find('td').get().map(function(cell){
                    
                    var arr = $(cell).prop('id').split('.');
                    
                    if(cols.indexOf(arr[1]) == -1) cols.push(arr[1]);
                    if(rows.indexOf(arr[2]) == -1) rows.push(arr[2]);

                    $(row).attr('pos_1', arr[1]);
                    $(row).attr('pos_2', arr[2]);        
                });
            });

            //Determine whether the open-end grid have column or row attribute.
            if(cols.length > rows.length) isgridrow = false;

            if(!isgridrow)
            {
                var $rows = $(".mrQuestionTable tbody tr").get();

                $rows.sort(function(a, b){

                    var x1 = parseInt($(a).attr('pos_1')), x2 = parseInt($(b).attr('pos_1'));
                    
                    var result = x1 > x2 ? 1 : (x1 < x2) ? -1 : 0;
                    
                    return result;
                });

                $.each($rows, function(index, row) {
                    $('.mrQuestionTable tbody').append(row);
                });
            }
            
            var sumcheck = 0;

            var items = $('.mrQuestionTable tbody tr').get().map(function(row){
                                
                return $(row).find('td').get().map(function(cell){
                    
                    var $td_txt = $(cell);

                    $td_txt.css({
                        'text-align' : '',
                        'vertical-align' : ''
                    });
                    
                    var attr = isgridrow ? $td_txt.attr('rowspan') :  $td_txt.attr('colspan');

                    if(typeof attr != 'undefined' && attr !== false)
                    {
                        $td_txt.addClass('grid-group');
                    }
                    
                    if($td_txt.find('textarea').length > 0 || $td_txt.find('input[type=text]').length > 0)
                    {
                        var $td_content = $td_txt.parent().prev().find('td');;
                        var $error = $td_txt.find('.mrErrorText').length != 0 ? $td_txt.find('.mrErrorText') : undefined;
                        var $checkboxs = $td_txt.find('input[type=checkbox]').length != 0 ? $td_txt.find('input[type=checkbox]') : undefined;
                        
                        var $texts = $td_txt.find('textarea').length > 0 ? $td_txt.find('textarea') : undefined;
                        
                        if($texts == undefined){
                            $texts = $td_txt.find('input[type=text]').length > 0 ? $td_txt.find('input[type=text]') : undefined;
                        }

                        //console.log($td_content);
                        
                        $td_content.addClass('grid-content');
                        $td_content.addClass('grid-content-openend');
                        $td_content.addClass('content-primary');
                        
                        //$td_txt.addClass('grid-openend');

                        $texts.addClass('grid-openend-txt');
                        $texts.attr('placeholder', objProperties[0]['placeholder']);
                        
                        if($texts.is('textarea')){
                            $texts.attr('rows', 3);
                        }
                        
                        if($checkboxs != undefined){
                            $checkboxs.each(function(index, chk){
                                $(chk).addClass('grid-openend-chk');
                            });
                        }

                        var str = $td_content.find('.mrQuestionText').html().replace(/<hr>.*<\/span>/g, '');
                        
                        $td_content.find('.mrQuestionText').html(str);

                        if($error != undefined) {
                            $error.hide();
                            $td_content.find('.mrQuestionText').append("<hr><span class='error'>&ldquo;" + $error.html() + "&rdquo;</span>");
                        
                            $td_txt.show();
                            $texts.focus();
                        } else {
                            $td_txt.hide();

                            if($texts.val().length > 0){
                                switch(objProperties[0]['type'].toLowerCase()){
                                    case 'text':
                                        $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $texts.val() + "&rdquo;</span>");
                                        break;
                                    case 'long':
                                    case 'double':
                                        $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $.fn.formatNumber($texts.val(), $('html').attr('lang').toLowerCase()) + "&rdquo;</span>");
                                        break;
                                }
                            } else {
                                if($checkboxs != undefined){
                                    var flag = false;
                                    $checkboxs.each(function(index, chk){
                                        if($(chk).is(':checked')){
                                            flag = true;
                                            $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $(chk).next().find('span').html() + "&rdquo;</span>");
                                        }
                                    });

                                    if(!flag){
                                        $td_content.find('.mrQuestionText').append("<hr><span class='error'>&ldquo;" + "Thiếu câu trả lời." + "&rdquo;</span>");
                                    }
                                }
                            }
                        }

                        if(objProperties[0]['validation'] != null){
                            sumcheck += ($texts.val().length == 0 ? 0 : objProperties[0]['type'].toLowerCase() ? parseInt($texts.val()) : parseFloat($texts.val()));
                        }
                    }

                    return $(cell);
                });
            });

            if(objProperties[0]['validation'] != null){
                $(".mrQuestionTable").parent().append("<div id='grid-sum' class='grid-group'>Tổng cộng: " + sumcheck + "</div>")
            }
            break;
    }

    console.log(objProperties[0]);

    //The OpenEnd Grid
    $('.grid-content-openend').click(function(event){
        
        var $td_content = $(this);
        var $td_txt = $(this).parent().next().find('td');
        var $checkboxs = $td_txt.find('input[type=checkbox]').length != 0 ? $td_txt.find('input[type=checkbox]') : undefined;
        var $error = $td_txt.find('.mrErrorText').length != 0 ? $td_txt.find('.mrErrorText') : undefined;
                        
        var $texts = $td_txt.find('textarea').length > 0 ? $td_txt.find('textarea') : undefined;
                        
        if($texts == undefined){
            $texts = $td_txt.find('input[type=text]').length > 0 ? $td_txt.find('input[type=text]') : undefined;
        }

        var str = $td_content.find('.mrQuestionText').html().replace(/<hr>.*<\/span>/g, '');
        
        $td_content.find('.mrQuestionText').html(str);
        
        if($texts.is(':visible')){
            if($texts.val().length > 0){
                switch(objProperties[0]['type'].toLowerCase()){
                    case 'text':
                        $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $texts.val() + "&rdquo;</span>");
                        break;
                    case 'long':
                    case 'double':
                        $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $.fn.formatNumber($texts.val(), $('html').attr('lang').toLowerCase()) + "&rdquo;</span>");
                        break;
                }
            } else {
                if($checkboxs != undefined){
                    $checkboxs.each(function(index, chk){
                        if($(chk).is(':checked')){
                            $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $(chk).next().find('span').html() + "&rdquo;</span>");
                        }
                    });
                } else {
                    if($error != undefined) {
                        $error.hide();
                        $td_content.find('.mrQuestionText').append("<hr><span class='error'>&ldquo;" + $error.html() + "&rdquo;</span>");
                    } else {
                        $td_content.find('.mrQuestionText').append("<hr><span class='error'>&ldquo;" + "Thiếu câu trả lời." + "&rdquo;</span>");
                    }
                }
            }
            
            $td_txt.hide();
        } else {
            if(objProperties[0]['type'].toLowerCase() == 'long' || objProperties[0]['type'].toLowerCase() == 'double')
            {
                $texts.val($.fn.formatNumber($texts.val(), $('html').attr('lang').toLowerCase()));
            }

            $td_txt.show();
            $texts.focus();
        }
    });

    //Format giá trị sau mỗi lần nhập 
    $('.grid-openend-txt').keyup(function(){
        //Nếu type = long|double sẽ format theo 0.000,000
        if(objProperties[0]['type'].toLowerCase() == 'long' || objProperties[0]['type'].toLowerCase() == 'double')
        {
            $(this).val($.fn.formatNumber($(this).val(), $('html').attr('lang').toLowerCase()));
            /*
            var $content = $(this).parent().parent().parent().prev().find('.mrQuestionText');
            
            if($(this).val().length > 0)
            {
                var str = $content.html().split('<hr>');
                $content.html(str[0]);
            }
            */
        }
    });

    $('.grid-openend-txt').keypress(function(e){
        //Nếu type = long|double sẽ format theo 0.000,000
        if(objProperties[0]['type'].toLowerCase() == 'long' || objProperties[0]['type'].toLowerCase() == 'double')
        {
            //44 - dấu phẩy
            //46 - dấu chấm
            var lang = $('html').attr('lang').toLowerCase();
            var f = objProperties[0]['type'].toLowerCase() == 'long' ? ((e.keyCode >= 48 && e.keyCode <= 57) && e.keyCode != 44 && e.keyCode != 46)
                                            : ((lang == "vi-vn" ? (((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 44) && e.keyCode != 46) : (((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 46) && e.keyCode != 44)));
            
            if(!f)
            {
                e.preventDefault();
                return false;
            }
        }
    });

    $('.grid-openend-txt').change(function(event){
        
        if($(this).val().length > 0)
        {
            if($(this).parent().find('input[type=checkbox]').length > 0)
            {
                $(this).parent().find('input[type=checkbox]').each(function(index, chk){

                    if($(chk).is(':checked')) $(chk).prop('checked', false);
                });
            }
        }
    });

    $('.grid-openend-chk').change(function(event){

        if($(this).is(':checked'))
        {
            $(this).parent().find('textarea').each(function(index, txt){

                $(txt).val("");
            });
        }
    });

    $('.grid-openend-txt').focusin(function(event){
        
        if(objProperties[0]['validation'] != null){
            $(this).data('sumcheck', $(this).val());
        }
    });

    $('.grid-openend-txt').focusout(function(event){
        
        if(objProperties[0]['validation'] != null){
            var prev = $.fn.convertToNumber($(this).data('sumcheck'), objProperties[0]['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            var current = $.fn.convertToNumber($(this).val(), objProperties[0]['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            
            var s = $('#grid-sum').html().split(':');
            
            var sum_prev = $.fn.convertToNumber(s[1].trim(), objProperties[0]['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            
            var sum = sum_prev - prev + current;
            
            $('#grid-sum').html("Tổng cộng: " + sum);
        }
    });

    //Format lại giá trị number khi nhấn submit
    $('input:submit').click(function(e){
        //Nếu type = long|double sẽ format theo 0.000,000
        if(objProperties[0]['type'].toLowerCase() == 'long' || objProperties[0]['type'].toLowerCase() == 'double')
        {
            $('.mrQuestionTable tbody tr').get().map(function(row){
                
                return $(row).find('td').get().map(function(cell){
                    
                    if($(cell).find('input[type=text]').length == 1)
                    {
                        var $this = $(cell).find('input[type=text]');

                        if($this.val().length > 0)
                        {
                            switch($('html').attr('lang').toLowerCase())
                            {
                                case "vi-vn":
                                    $this.val($this.val().split('.').join(''));
                                    break;
                                default:
                                    $this.val($this.val().split(',').join(''));
                                    break;
                            }
                        }
                    }
                });
            });
            
            if(objProperties[0]['validation'] != null)
            {
                var s = $('#grid-sum').html().split(':');

                var sum = $.fn.convertToNumber(s[1].trim(), objProperties[0]['type'].toLowerCase(), $('html').attr('lang').toLowerCase());

                var html_error = "<div class='error'>Kiểm tra tổng phải bằng " + objProperties[0]['sumcheck'] + ".</div>";

                if(sum != objProperties[0]['sumcheck'])
                {
                    if($('#grid-sum').parent().find('.error').length == 0) $('#grid-sum').before(html_error);
                    
                    e.preventDefault();
                    return false;
                }
                else
                {
                    $('#grid-sum').parent().find('.error').each(function(index, k){
                        k.remove()
                    });
                }
            }
        }
    });
});