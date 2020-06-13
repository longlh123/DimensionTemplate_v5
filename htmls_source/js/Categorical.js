(function($){

}(jQuery));

$(document).ready(function(){
    
    var objCats = {}, objCatOthers = {}, objCatExclusives = {};

    //Determine whether a question is the single or multiple answer question.
    var ismultiple = false;
    var cells = [];

    switch($(".mrQuestionTable").prop('tagName').toLowerCase())
    {
        case "table":
            $('.mrQuestionTable').css('border-collapse', 'collapse');

            var nocs = 0, nors = 0;

            var arr = $('.mrQuestionTable tbody tr').get() //convert jquery object to array
                            .map(function(row){

                                $(row).css('border-bottom', '1px solid #e6e6e6');
                                nors++;

                                return $(row).find('td').get() //convert jquery object to array
                                    .map(function(cell){
                                        
                                        nocs++;

                                        return $(cell);
                                    });
                            });
            
            $.each(arr, function(key1, item1){

                $.each(item1, function(key2, item2){

                    $(item2).css('width', (1.0 / (nocs / nors) * 100) + '%');

                    cells.push(item2);
                });
            });
            break;
        default:
            cells = $(".mrQuestionTable").children().get()
                            .map(function(span){
                                return($(span));        
                            });
            break;
    }
    
    //Xac dinh template?
    var template = "";

    $('.content').children().each(function(){

        switch($(this).attr('class'))
        {
            case "categorical_imagineicons":
            case "categorical_defaulticons":
                template = $(this).attr('class');
                break;
            case "categorical_scales":
                template = $(this).attr('class');
                $('.mrQuestionTable').addClass('cat-scales');
                break;
        }
    });

    //Liệt kê danh sách categories
    $.each(cells, function(key, item){
        
        var $cat = null, $other = null, $error = null;
        var iserror = false, ischecked = false, isexclusive = false, isgroup = false;

        item.children().each(function(){
            
            if($(this).is('input:radio') || $(this).is('input:checkbox'))
            {
                $cat = $(this);

                ischecked = $cat.is(':checked');
            }
            else if($(this).is('label'))
            {
                $(this).children().each(function(){

                    if($(this).is('span') && $(this).attr('class') == "mrMultipleText")
                    {
                        //Determine whether a question is the single or multiple answer question.
                        ismultiple = true;
                        
                        //Determine that a category is an exclusive category.
                        //var styles = $(this).attr('style').split(';');
                        if($(this).css('font-weight') == "700")
                        {
                            isexclusive = true;
                        }
                    }
                });
            }
            else if($(this).is('span'))
            {
                $(this).children().each(function(){

                    if($(this).is('span'))
                    {
                        if($(this).attr('class') == "mrErrorText")
                        {
                            iserror = true;
                            $error = $(this);
                            $(this).addClass('error');
                        }
                        else if($(this).attr('class') == "mrShowText")
                        {
                            isgroup = true;
                        }
                    }
                    else if($(this).is('input:text'))
                    {
                        $other = $(this);

                        if($other.val().length == 0 && !iserror && !ischecked) $other.css('display', 'none');
                    }
                });
            }
        });

        if(!isgroup)
        {
            if(isexclusive)
            {
                objCatExclusives[$(this).attr('id')] = {
                    'cell' : item,
                    'cat' : $cat,
                    'other' : $other,
                    'error' : $error,
                    'iserror' : iserror,
                    'ischecked' : ischecked
                }
            }
            else
            {
                if($other == null)
                {
                    if(template == "categorical_imagineicons")
                    {
                        item.addClass('cat-image');
                    }
                    else if(template == "categorical_scales")
                    {
                        item.addClass('cat-scales-item');
                    }

                    objCats[$(this).attr('id')] = {
                        'cell' : item,
                        'cat' : $cat,
                        'other' : $other,
                        'error' : $error,
                        'iserror' : iserror,
                        'ischecked' : ischecked
                    }
                }
                else
                {
                    objCatOthers[$(this).attr('id')] = {
                        'cell' : item,
                        'cat' : $cat,
                        'other' : $other,
                        'error' : $error,
                        'iserror' : iserror,
                        'ischecked' : ischecked
                    }
                }
            }
        }
    });
 
    $.each(objCats, function(key, item){

        item['cat'].change(function(){

            $.each(objCatOthers, function(k, i){

                if(!ismultiple)
                {
                    i['other'].css('display', 'none');
                    i['other'].val("");
                    if (i['error'] != null) i['error'].css('display', 'none');
                }
            });

            if(item['cat'].is(':checked')) 
            {
                $.each(objCatExclusives, function(k, i){
                    
                    i['cat'].prop('checked', false);
                });
            }
        });
    });

    $.each(objCatExclusives, function(key, item){
        
        item['cat'].change(function(){
            
            if(item['cat'].is(':checked')) 
            {
                $.each(objCats, function(k, i){
                    
                    i['cat'].prop('checked', false);
                });

                $.each(objCatOthers, function(k, i){
                    
                    i['cat'].prop('checked', false);
                    
                    i['other'].css('display', 'none');
                    i['other'].val("");
                    if (i['error'] != null) i['error'].css('display', 'none');
                });

                $.each(objCatExclusives, function(k, i){
                    if(key != k){
                        i['cat'].prop('checked', false);
                    }
                });
            }
        });
    });

    $.each(objCatOthers, function(key, item){

        item['cat'].change(function(){

            item['other'].css('display', 'block');

            if(ismultiple)
            {
                if(!item['cat'].is(':checked')) 
                {
                    item['other'].css('display', 'none');
                    item['other'].val("");
                    if (item['error'] != null) item['error'].css('display', 'none');
                }
            }
            else
            {
                $.each(objCatOthers, function(k, i){
                
                    if(key != k)
                    {    
                        i['other'].css('display', 'none');
                        i['other'].val("");
                        if (i['error'] != null) i['error'].css('display', 'none');
                    }
                });
            }

            if(item['cat'].is(':checked')) 
            {
                $.each(objCatExclusives, function(k, i){
                     
                    i['cat'].prop('checked', false);
                });
            }
        });
    });
});

