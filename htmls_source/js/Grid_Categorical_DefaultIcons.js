
$(document).ready(function(){

    console.log("hi")
    switch($('.mrQuestionTable').prop('tagName').toLowerCase()){
        case 'table':
            //$(".mrQuestionTable").addClass('grid-container');

            $(".mrQuestionTable tbody tr").get().map(function(row){

                $(row).addClass('grid-row');
                $(row).before($(row).find('td:first'));
                $(row).prev().wrap("<tr class='grid-row'/>");
                $(row).prev().find('td:first').removeAttr('style');
                $(row).prev().find('td:first').attr('colspan', $(row).find('td').length);

                $(row).find('td').get().map(function(cell){

                    $(cell).removeAttr('style');
                });
            });
            
            $(".mrQuestionTable tbody tr:first").remove();

            var $header_scales = $(".mrQuestionTable tbody tr:first");
            $(".mrQuestionTable tbody tr:first").remove();

            $(".mrQuestionTable tbody tr").get().map(function(row){
                
                if($(row).find('.mrGridCategoryText').length == 1){
                    $(row).removeClass('grid-row');
                    $(row).addClass('grid-attr');
                    $(row).after("<tr class='grid-row'>" + $header_scales.html() + "</tr>");
                }
            });
            break;
    }
});