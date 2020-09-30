(function($){
   
}(jQuery));

$(document).ready(function(){
    
    var objCats = {}, objCatOthers = {}, objCatExclusives = {};

    //Determine whether a question is the single or multiple answer question.
    var ismultiple = false;
    var cells = [];

    var iscatimages = $('.content').find('.categorical_imagineicons').length == 1;
    //var iscatscales = $('.content').find('.categorical_scales').length == 1; 

    console.log(iscatimages);

    switch($(".mrQuestionTable").prop('tagName').toLowerCase())
    {
        case "table":
            $('.mrQuestionTable').css('border-collapse', 'collapse');

            $(".mrQuestionTable").addClass('cat-container');
            
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
            
            var $rows = $(".mrQuestionTable tbody tr").get();

            $rows.sort(function(a, b){

                var x1 = parseInt($(a).attr('pos_1')), x2 = parseInt($(b).attr('pos_1'));
                
                var result = x1 > x2 ? 1 : (x1 < x2) ? -1 : 0;
                
                return result;
            });

            $.each($rows, function(index, row) {
                $('.mrQuestionTable tbody').append(row);
            });

            $cells = $(".mrQuestionTable tbody tr");
            break;
        default:
            $(".mrQuestionTable").addClass('cat-container');

            $cells = $(".mrQuestionTable");
            break;
    }

    cells = $cells.children().get().map(function(span){

        var ischecked = false, isonlycat = true;
        
        $(span).addClass('cat-group');

        if (iscatimages) $(span).addClass('cat-image');
        //if (iscatscales) $(span).addClass('cat-scales');

        $(span).children().each(function(){

            if($(this).is('input:radio') || $(this).is('input:checkbox'))
            {
                if($(this).hasClass('mrSingle'))
                {
                    $(this).addClass('cat-single-item');
                } 
                if($(this).hasClass('mrMultiple'))      
                {
                    $(this).addClass('cat-multiple-item');
                }
                
                ischecked = $(this).is(':checked');
            }
            else if($(this).is('label'))
            {
                $(this).children().each(function(){

                    if($(this).is('span') && $(this).attr('class') == "mrMultipleText")
                    {
                        if($(this).css('font-weight') == "700")
                        {
                            objCatExclusives[$(span).prop('id')] = $(span);

                            $(this).addClass('exclusive');

                            $(span).addClass('exclusive');

                            isonlycat = false;
                        }
                    }
                });
            }
            else if($(this).is('span'))
            {
                $(this).children().each(function(){
                    
                    if($(this).is('span') && $(this).prop('class') == 'mrErrorText'){
                        $(this).addClass('error');
                        $(this).show();
                    } else if($(this).is('input:text'))
                    {
                        objCatOthers[$(span).prop('id')] = $(span);

                        $(this).addClass('cat-other');

                        $(this).show();   
                        if(!ischecked) $(this).hide();

                        isonlycat = false;
                    }
                });
            }
        });

        if(isonlycat) objCats[$(span).prop('id')] = $(span);

        return($(span));        
    });

    $('.cat-single-item').change(function(event){
        
        var $cat_group = $(this).parent();
        
        $other = $cat_group.find('.cat-other');
        $other.show();

        $.each(objCatOthers, function(key, cat){
            
            if(key != $cat_group.prop('id')) {

                $oth = cat.find('.cat-other');
                $oth.hide();
                $oth.val("");

                $err = cat.find('.mrErrorText');
                $err.hide();
            }
        });
    });

    $('.cat-multiple-item').change(function(event){
        
        var $cat_group = $(this).parent();
        
        if($(this).is(':checked')){
            $cat_group.find('.cat-other').show();

            if($cat_group.hasClass('exclusive')) {
                
                $.each(objCats, function(key, cat){
                    cat.find('.cat-multiple-item').prop('checked', false);
                });

                $.each(objCatOthers, function(key, cat){
                    cat.find('.cat-multiple-item').prop('checked', false);

                    cat.find('.cat-other').hide();
                    cat.find('.cat-other').val("");

                    cat.find('.mrErrorText').hide();
                });

                $.each(objCatExclusives, function(key, cat){
                    
                    if($cat_group.prop('id') != key){
                        cat.find('.cat-multiple-item').prop('checked', false);
                    }
                });
            } else {
                
                $.each(objCatExclusives, function(key, cat){
                    cat.find('.cat-multiple-item').prop('checked', false);
                });
            }
        } else {
            $cat_group.find('.cat-other').hide();
            $cat_group.find('.cat-other').val("");

            $cat_group.find('.mrErrorText').hide();
        }
    });

    
});

