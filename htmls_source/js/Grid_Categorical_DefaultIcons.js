

$(document).ready(function(){
    
    switch($('.mrQuestionTable').prop('tagName').toLowerCase()){
        case 'table':
            
            $(".mrQuestionTable").addClass('grid-container');
            
            //Check if header of grid có chứa subgroup
            var number_of_rows = $(".mrQuestionTable tbody tr:first td:first").prop('rowspan');

            var objGroups = {}, objCats = {};

            if(number_of_rows > 1){
                $(".mrQuestionTable tbody tr:first").append($(".mrQuestionTable tbody tr:first").next().find('td').unwrap());
            }

            var $cells = $(".mrQuestionTable tbody tr:first td").get().sort(function(a, b){

                var pos_1 = parseInt($(a).prop('id').split('.')[1]);
                var pos_2 = parseInt($(b).prop('id').split('.')[1]);
                
                var result = pos_1 > pos_2 ? 1 : (pos_1 < pos_2) ? -1 : 0;
                
                return result;
            });
            
            $.each($cells, function(index, cell){
                if($(cell).prop('colspan') > 1){
                    objGroups[$(cell).prop('id')] = $(cell);
                } else {
                    objCats[$(cell).prop('id')] = $(cell); 
                }
            });

            $(".mrQuestionTable tbody tr:first").find('td').removeAttr('colspan');
            $(".mrQuestionTable tbody tr:first").find('td').removeAttr('rowspan');

            $.each($cells, function(index, cell){
                if($(cell).prop('colspan') == 1){
                    $(".mrQuestionTable tbody tr:first").append(cell);
                } 
            });

            console.log($cells);
            console.log(objGroups);
            console.log(objCats);

            var $header_scales = $(".mrQuestionTable tbody tr:first");
            $(".mrQuestionTable tbody tr:first").remove();
            
            console.log($header_scales);
            
            $(".mrQuestionTable tbody").find('td').unwrap().wrap($('<tr/>'));
            $(".mrQuestionTable tbody tr td").removeAttr('style');
            
            $(".mrQuestionTable tbody tr td").find('input[type=checkbox]').wrap("<span class='cat-group'/>");
            
            $(".mrQuestionTable tbody tr td").find('.cat-group').get().map(function(cat){
                
                if($(cat).next().prop('tagName') == 'SPAN'){
                    $(cat).append($(cat).next());
                }
            });
            
            var step = 0;

            $(".mrQuestionTable tbody tr td").get().map(function(cell){
                
                if($(cell).find('input[type=checkbox]').length == 1){
                    
                    $(cell).parent().addClass('grid-cat');
                    
                    var row = $(cell).prop('id').substring($(cell).prop('id').lastIndexOf('.') + 1, $(cell).prop('id').length);

                    $(cell).attr('row', row);

                    var id_cat = $(cell).prop('id');
                    id_cat = id_cat.substring(0, id_cat.lastIndexOf('.') + 1) + "0";
                    
                    if(Object.keys(objGroups).indexOf(id_cat) != -1){
                        $(cell).parent().before("<tr class='grid-cat'><td id='" + id_cat + "' row='" + row + "' style='display:none;'>" + $(objGroups[id_cat]).html() + "</td></tr>");
                    }

                    if(Object.keys(objCats).indexOf(id_cat) == -1){
                        id_cat = id_cat.substring(0, id_cat.lastIndexOf('.') + 1) + "1";
                    }

                    $chk = $(cell).find('input[type=checkbox]');

                    $chk.after("<label for='" + $chk.prop('id') + "'>" + $(objCats[id_cat]).html() + "</label>");
                
                    $(cell).hide()
                } else {
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
                }
            });
            
            break;
    }

    $('.grid-attr').click(function(event){
        
        var id_attr = $(this).find('.mrGridCategoryText').prop('id').split('.');

        $('.grid-cat').get().map(function(cat){
            var $td = $(cat).find('td');

            var id_cat = $td.prop('id').split('.');
            
            if(id_attr[2] == $td.attr('row')){
                
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