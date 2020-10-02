

$(document).ready(function(){
    
    switch($('.mrQuestionTable').prop('tagName').toLowerCase()){
        case 'table':
            
            $(".mrQuestionTable").addClass('grid-container');
            
            var $header_scales = $(".mrQuestionTable tbody tr:first");
            $(".mrQuestionTable tbody tr:first").remove();
            
            console.log($header_scales[0]['cells']);
            
            $(".mrQuestionTable tbody").find('td').unwrap().wrap($('<tr/>'));
            $(".mrQuestionTable tbody tr td").removeAttr('style');
            $(".mrQuestionTable tbody tr td").find('input[type=checkbox]').wrap("<span class='cat-group'/>");
            
            var step = 0;

            $(".mrQuestionTable tbody tr td").get().map(function(cell){
                
                if($(cell).find('.mrQuestionText').length == 1){
                    
                    var $td = $(cell).parent().find('td');

                    if($td.prop('rowspan') != 1){
                        $(cell).parent().addClass('grid-subgroup');
                        $td.removeAttr('rowspan');
                    } else {
                        $(cell).parent().addClass('grid-attr');

                        if($td.prop('colspan') != 1){
                            step = $td.prop('colspan') - 1;
                            $td.removeAttr('colspan');
                        } else {
                            step = $td.prop('id').split('.')[1];
                        }
                    }
                    
                    $(cell).parent().addClass('grid-content');
                    $(cell).parent().addClass('content-primary');
                }

                if($(cell).find('input[type=checkbox]').length == 1){
                    
                    $(cell).parent().addClass('grid-cat');

                    var id_cat = $(cell).prop('id').split('.');
                    
                    $chk = $(cell).find('input[type=checkbox]');

                    $chk.after("<label for='" + $chk.prop('id') + "'>" + $($header_scales[0]['cells'][id_cat[1] - step]).html() + "</label>");
                
                    $(cell).hide()
                }
            });
            
            break;
    }

    $('.grid-attr').click(function(event){
        
        var id1 = $(this).find('.mrGridCategoryText').prop('id').split('.');

        $('.grid-cat').get().map(function(cat){
            var $td = $(cat).find('td');

            var id2 = $td.prop('id').split('.');
            
            if(id1[2] == id2[2]){
                
                if($td.is(':visible')){
                    $td.hide();
                } else {
                    $td.show();
                }
            } else {
                $td.hide();
            }
        });
    });
});