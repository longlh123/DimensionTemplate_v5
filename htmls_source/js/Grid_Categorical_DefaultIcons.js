

$(document).ready(function(){

    switch($('.mrQuestionTable').prop('tagName').toLowerCase()){
        case 'table':
            
            var $header_scales = $(".mrQuestionTable tbody tr:first");
            $(".mrQuestionTable tbody tr:first").remove();
            
            $(".mrQuestionTable tbody").find('td').unwrap().wrap($('<tr/>'));
            $(".mrQuestionTable tbody tr td").removeAttr('style');
            $(".mrQuestionTable tbody tr td").find('input[type=checkbox]').wrap("<span class='cat-group'/>");
            
            $(".mrQuestionTable tbody tr td").get().map(function(cell){
                
                if($(cell).find('.mrQuestionText').length == 1){
                    $(cell).parent().addClass('grid-attr');
                    $(cell).parent().addClass('grid-content');
                    $(cell).parent().addClass('content-primary');
                }

                if($(cell).find('input[type=checkbox]').length == 1){
                    
                    $(cell).parent().addClass('grid-scale');

                    var id = $(cell).prop('id').split('.');
                    
                    $chk = $(cell).find('input[type=checkbox]');

                    $chk.after("<label for='" + $chk.prop('id') + "'>" + $($header_scales[0]['cells'][id[1]]).html() + "</label>");
                }
            });

            break;
    }
});