

$(document).ready(function(){

    switch($('.mrQuestionTable').prop('tagName').toLowerCase()){
        case 'table':
            $(".mrQuestionTable").addClass('grid-container');

            $(".mrQuestionTable tbody tr").get().map(function(row){
                
                $(row).addClass('grid-row');
                $(row).before($(row).find('td:first'));
                $(row).prev().wrap("<tr class='grid-row'/>");
                $(row).prev().find('td:first').removeAttr('style');
                $(row).prev().find('td:first').attr('colspan', $(row).find('td').length);
                
                $(row).find('td').get().map(function(cell){

                    if($(cell).find('.mrQuestionText').length == 0){
                        $(cell).addClass('grid-scale');
                    } else {
                        $(cell).addClass('grid-cell');
                    }

                    $(cell).removeAttr('style');

                    $item = $(cell).find('input[type=radio]');
                    $item.wrap("<span class='cat-default'/>");
                    $item.after("<label for='" + $item.prop('id') + "'></label>");
                });
            });
            
            $(".mrQuestionTable tbody tr:first").remove();

            //$(".mrQuestionTable tbody").before($(".mrQuestionTable tbody tr:first"));
            //$(".mrQuestionTable tbody").prev().wrap("<thead/>")
            
            var $header_scales = $(".mrQuestionTable tbody tr:first");
            $(".mrQuestionTable tbody tr:first").remove();
            
            $(".mrQuestionTable tbody tr").get().map(function(row){
                
                if($(row).find('.mrGridCategoryText').length == 1){
                    $(row).removeClass('grid-row');
                    $(row).addClass('grid-attr');
                    
                    var text = $(row).find('.mrQuestionText').html();
                    var regExp = new RegExp("<img.*?>");
                    
                    if(regExp.test(text)){
                        var s1 = text.replace(regExp, "");
                        var s2 = text.replace(s1, "");

                        s1 = s1.replace(/<.*?(\/>)/, "");
                        s1 = s1.replace(/<.*?(>)/, "");
                        
                        $(row).find('.mrQuestionText').html(s1 + "<br/>" + s2);
                    }
                    
                    $(row).after("<tr class='grid-row'>" + $header_scales.html() + "</tr>");
                } else if ($(row).find('.grid-scale').length > 0){
                    if(!$(row).is('tr:last')){
                        $(row).after("<tr><td style='padding:3px' colspan='" + $(row).find('.grid-scale').length + "'></td></tr>")
                    }
                }
            });
            break;
    }
});