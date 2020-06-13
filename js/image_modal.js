window.onload = function(){
    //Get the modal
    var modal = document.getElementById("imgModal");

    modal.innerHTML += "<span class='close'>&times;</span><img class='modal-content' id='modal_img'><div id='caption'></div>";

    //Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById("current_image");
    var modal_img = document.getElementById("modal_img");
    var caption_text = document.getElementById("caption");

    img.onclick = function(){
        modal.style.display = "block";
        modal_img.src = this.src;
        caption_text = this.alt;
    }

    //Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    //When the user clicks on <span> (x), close the modal
    span.onclick = function(){
        modal.style.display = "none";
    }
}
