window.onload = function(){
	
    var elements = document.getElementsByTagName("input");
    
    for(var i = 0; i < elements.length; i++)
    {
        switch(elements[i].type)
        {
            case "submit":
                elements[i].style.removeProperty("width");
                break;
            case "text":
            case "checkbox":
            case "radio":
                elements[i].style.removeProperty("margin-left");
                break;
        }
    }

    var elements = document.getElementsByTagName("textarea");

    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("margin-left");
    }

    var elements = document.getElementsByTagName("select")
    
    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("margin-left");
    }

    var elements = document.getElementsByClassName("mrErrorText");

    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("color");
        elements[i].style.removeProperty("font-weight");
        elements[i].style.removeProperty("border-color");
    }

    var elements = document.getElementsByClassName("mrQuestionTable");

    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("display");
        elements[i].style.removeProperty("margin-left");
    }

    var elements = document.getElementsByClassName("mrMultipleText");

    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("text-align");
        elements[i].style.removeProperty("vertical-align");
    }

    
    
    
}	

