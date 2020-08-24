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
        
        //Determine whether the grid has sum or not.
        obj['hassum'] = obj.hasOwnProperty('sum');

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

    var props= {};

    if($(".custom_question_properties").length)
    {  
        var str_obj = $(".custom_question_properties").html();
        props = $.fn.convertJSON(str_obj);
    }

    var contents = {}, textareas = {};
    
    switch($(".mrQuestionTable").prop('tagName').toLowerCase())
    {
        case "table":
            if($(".grid_openend_basic").find('.error').length != 0)
            {
                $(".grid_openend_basic").find('.error').hide();
            }

            $(".mrQuestionTable").addClass('grid_oe');
            
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
            
            //For sum
            var sum = 0;

            var items = $('.mrQuestionTable tbody tr').get().map(function(row){
                                
                        return $(row).find('td').get().map(function(cell){
                            
                            $(cell).css({
                                'text-align' : '',
                                'vertical-align' : ''
                            });
                            
                            var attr = isgridrow ? $(cell).attr('rowspan') :  $(cell).attr('colspan');

                            if(typeof attr != 'undefined' && attr !== false)
                            {
                                $(cell).addClass('grid-group');
                            }

                            //Open-End Grid
                            if($(cell).find('textarea').length > 0)
                            {
                                var $concent = $(cell).parent().prev().find('.mrGridCategoryText');
                                
                                $concent.addClass('grid-content');
                                $concent.addClass('grid-content-openend');
                                $concent.addClass('content-primary');

                                var str = $concent.find('span').html();

                                $(cell).addClass('grid-openend');

                                if($(cell).find('.mrErrorText').length != 0)
                                {
                                    var $error = $(cell).find('.mrErrorText');
                                    $error.hide();
                                    
                                    $concent.find('span').html(str + "<hr><span class='error'>&ldquo;" + $error.html() + "&rdquo;</span>");
                                }
                                else
                                {
                                    if($(cell).find('textarea').val().length != 0)
                                    {
                                        $concent.find('span').html(str + "<hr><span>&ldquo;" + $(cell).find('textarea').val() + "&rdquo;</span>");
                                    }
                                    else
                                    {
                                        if($(cell).find('input[type=checkbox]:checked').length > 0)
                                        {
                                            var anstxt = "";

                                            $(cell).find('input[type=checkbox]:checked').each(function(index, chk){

                                                anstxt += (anstxt.length == 0 ? "" : ", ") + $(chk).next().text();
                                            });

                                            $concent.find('span').html(str + "<hr><span>&ldquo;" + anstxt + "&rdquo;</span>");
                                        }
                                    }
                                }

                                $(cell).find('textarea').addClass('grid-openend-txt');

                                if(props.hasOwnProperty('placeholder'))
                                {
                                    $(cell).find('textarea').attr('placeholder', props['placeholder']);
                                }
                                else
                                {
                                    $(cell).find('textarea').attr('placeholder', "Điền câu trả lời ở đây..");
                                }
                                
                                if($(cell).find('input[type=checkbox]').length != 0)
                                {
                                    $(cell).find('input[type=checkbox]').each(function(index, chk){
                                        
                                        $(chk).addClass('grid-openend-chk');
                                    });
                                }
                            }
                            //Numeric Grid
                            else if($(cell).find('input[type=text]').length > 0)
                            {
                                var $this = $(cell).find('input[type=text]');
                                
                                var $concent = $(cell).parent().prev().find('.mrGridCategoryText');
                                
                                $concent.addClass('grid-content');
                                $concent.addClass('grid-content-numeric');
                                $concent.addClass('content-primary');

                                var str = $concent.find('span').html();

                                $this.addClass('grid-numeric-txt');

                                if($(cell).find('.mrErrorText').length != 0)
                                {
                                    var $error = $(cell).find('.mrErrorText');
                                    $error.hide();

                                    $concent.find('span').html(str + "<hr><span class='error'>&ldquo;" + $error.html() + "&rdquo;</span>");
                                } 

                                if(props.hasOwnProperty('placeholder'))
                                {
                                    $this.attr('placeholder', props['placeholder']);
                                }
                                else
                                {
                                    $this.attr('placeholder', "Điền câu trả lời ở đây..");
                                }
                                
                                if($(cell).find('input[type=checkbox]').length != 0)
                                {
                                    $(cell).find('input[type=checkbox]').each(function(index, chk){
                                        
                                        $(chk).addClass('grid-numeric-chk');
                                    });
                                }
                                
                                

                                //Nếu type = long|double sẽ format theo 0.000,000
                                if(props['type'].toLowerCase() == 'long' || props['type'].toLowerCase() == 'double')
                                {
                                    $this.val($.fn.formatNumber($this.val(), $('html').attr('lang').toLowerCase()));

                                    if(props['hassum']) sum += $.fn.convertToNumber($this.val(), props['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
                                }
                            }

                            return $(cell);
                        });
                    });

            if(props['hassum'])
            {
                $('.mrQuestionTable').parent().after("<div class='grid-content'><span id='grid-sum' style='font-weight:800'>Tổng cộng : " + sum + "</span></div>");
            }
            break;
    }

    //The OpenEnd Grid
    $('.grid-content-openend').click(function(event){
        
        var $textarea = $(this).parent().next().find('textarea');

        if($textarea.is(':visible'))
        {
            $(this).parent().next().find('td').hide();

            var str = $(this).find('span').html();

            if($textarea.val().length != 0)
            {
                $(this).find('span').html(str + "<hr><span>&ldquo;" + $textarea.val() + "&rdquo;</span>");
            }
            else
            {
                if($(this).parent().next().find('td').find('input[type=checkbox]:checked').length > 0)
                {
                    var anstxt = "";

                    $(this).parent().next().find('td').find('input[type=checkbox]:checked').each(function(index, chk){

                        anstxt += (anstxt.length == 0 ? "" : ", ") + $(chk).next().text();
                    });
                    
                    $(this).find('span').html(str + "<hr><span>&ldquo;" + anstxt + "&rdquo;</span>");
                }
                else
                {
                    if($(this).parent().next().find('td').find('.mrErrorText').length != 0)
                    {
                        $(this).find('span').html(str + "<hr><span class='error'>&ldquo;" + $(this).parent().next().find('td').find('.mrErrorText').html() + "&rdquo;</span>");
                    }
                }
            }
        }
        else
        {
            var str = $(this).find('span').html().split('<hr>')[0];
            $(this).find('span').html(str);
            
            $(this).parent().next().find('td').show();
            
            $textarea.attr('rows', 3);
            $textarea.focus();
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
    
    //The Numeric Grid
    
    //Format giá trị sau mỗi lần nhập 
    $('.grid-numeric-txt').keyup(function(){
        //Nếu type = long|double sẽ format theo 0.000,000
        if(props['type'].toLowerCase() == 'long' || props['type'].toLowerCase() == 'double')
        {
            $(this).val($.fn.formatNumber($(this).val(), $('html').attr('lang').toLowerCase()));
            
            var $content = $(this).parent().parent().parent().prev().find('.mrQuestionText');
            
            if($(this).val().length > 0)
            {
                var str = $content.html().split('<hr>');
                $content.html(str[0]);
            }
        }
    });

    $('.grid-numeric-txt').keypress(function(e){
        
        //Nếu type = long|double sẽ format theo 0.000,000
        if(props['type'].toLowerCase() == 'long' || props['type'].toLowerCase() == 'double')
        {
            //44 - dấu phẩy
            //46 - dấu chấm
            var lang = $('html').attr('lang').toLowerCase();
            var f = props['type'].toLowerCase() == 'long' ? ((e.keyCode >= 48 && e.keyCode <= 57) && e.keyCode != 44 && e.keyCode != 46)
                                            : ((lang == "vi-vn" ? (((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 44) && e.keyCode != 46) : (((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 46) && e.keyCode != 44)));
            
            if(!f)
            {
                e.preventDefault();
                return false;
            }
        }
    });

    $('.grid-numeric-txt').focusin(function(event){
        
        if(props['hassum']) $(this).data('val', $(this).val());
    });

    $('.grid-numeric-txt').focusout(function(event){
        
        if($(this).val().length > 0)
        {
            if($(this).parent().find('input[type=checkbox]').length > 0)
            {
                $(this).parent().find('input[type=checkbox]').each(function(index, chk){

                    if($(chk).is(':checked')) $(chk).prop('checked', false);
                });
            }
        }

        if(props['hassum'])
        {
            var prev = $.fn.convertToNumber($(this).data('val'), props['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            var current = $.fn.convertToNumber($(this).val(), props['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            
            var s = $('#grid-sum').html().split(':');
            
            var sum_prev = $.fn.convertToNumber(s[1].trim(), props['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            
            var sum = sum_prev - prev + current;
            
            $('#grid-sum').html("Tổng cộng : " + $.fn.formatNumber(sum));
        }
    });

    /*

    $('.grid-numeric-txt').change(function(event){
        
        if($(this).val().length > 0)
        {
            if($(this).parent().find('input[type=checkbox]').length > 0)
            {
                $(this).parent().find('input[type=checkbox]').each(function(index, chk){

                    if($(chk).is(':checked')) $(chk).prop('checked', false);
                });
            }
        }

        if(props['hassum'])
        {
            var prev = $.fn.convertToNumber($(this).data('val'), props['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            var current = $.fn.convertToNumber($(this).val(), props['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            
            var s = $('#grid-sum').html().split(':');
            
            var sum_prev = $.fn.convertToNumber(s[1].trim(), props['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            
            var sum = sum_prev - prev + current;
            
            $('#grid-sum').html("Tổng cộng : " + $.fn.formatNumber(sum));
        }
    });

    */

    $('.grid-numeric-chk').change(function(event){

        if($(this).is(':checked'))
        {
            $(this).parent().find('input[type=text]').each(function(index, txt){

                $(txt).val("");
            });
        }
    });

    //Format lại giá trị number khi nhấn submit
    $('input:submit').click(function(e){

        //Nếu type = long|double sẽ format theo 0.000,000
        if(props['type'].toLowerCase() == 'long' || props['type'].toLowerCase() == 'double')
        {
            if(props['hassum'])
            {
                var s = $('#grid-sum').html().split(':');

                var sum = $.fn.convertToNumber(s[1].trim(), props['type'].toLowerCase(), $('html').attr('lang').toLowerCase());

                var html_error = "<div class='error'>Kiểm tra tổng phải bằng 100.</div>";

                if(sum != props['sum'])
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
        }
    });
});