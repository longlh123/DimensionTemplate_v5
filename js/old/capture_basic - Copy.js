/*****************************************************************/
/**																**/
/**	Name: capture_basic.js										**/
/**	Summary: CAPTURE BASIC QUESTION                             **/
/** Template: Mobile										    **/
/**	Copyright LongPham								            **/
/**																**/
/*****************************************************************/

(function($){

	$.fn.processImage = function(id){

		var options = {
			client_hints: true,
		};

		return '<img src="'+ $.cloudinary.url(id, options) +'" style="width: 100%; height: auto"/>'
	};
}(jQuery));

$(document).ready(function(){

	//Your Cloudinary account dashboard
	var CLOUDINARY_NAME = "";
	var CLOUDINARY_API_KEY = "";
	var CLOUDINARY_API_SECRET = "";
	var CLOUDINARY_PRESET_NAME = "etwqhewl";

	var count = 0;
	var projectname = "";
	var imagename = "";

	$('.content').children().each(function(){

		if($(this).prop('class') === "Capture_Basic_namediv")
		{
			$(this).children().each(function(){

				if($(this).prop('class') === "control_everything")
				{
					$(this).children().each(function(){

						switch($(this).prop('class'))
						{
							case "question_banners":
								$(this).children().each(function(){

									if($(this).prop('class') === "mrBannerText")
									{
										if($(this).find('span').length > 0)
										{
											if($(this).find('span').prop('class') == "custom_question_properties")
											{
												var str_properties = $(this).find('span').text();

												var arr_str_properties = str_properties.split('#');

												if(arr_str_properties.length > 0)
												{
													for(var i = 0; i < arr_str_properties.length; i++)
													{
														var arr_property = arr_str_properties[i].replace("[","").replace("]","").split(':');

														switch(arr_property[0].toLowerCase())
														{
															case "projectname":
																projectname = arr_property[1];
																count++;
																break;
															case "imagename":
																imagename = arr_property[1];
																count++;
																break;
															case "cloudinaryname":
																CLOUDINARY_NAME = arr_property[1];
																count++;
																break;
															case "cloudinaryapikey":
																CLOUDINARY_API_KEY = arr_property[1];
																count++;
																break;
															case "cloudinaryapisecret":
																CLOUDINARY_API_SECRET = arr_property[1];
																count++;
																break;
														}
													}
												}
											}
										}
									}
								});

								$(this).hide();
								break;
							case "capture_container":
								$(this).append("<div class = 'cloudinary_fileupload_container'><input type='file' name='file' id='cloudinary_fileupload' class='cloudinary_fileupload'><label for = 'cloudinary_fileupload' class = 'cloudinary_fileupload_trigger'>Select a file..</label></div><br><br/><div class='thumbnails'></div>");
								
								if(count == 5)
								{
									$.cloudinary.config({"cloud_name" : CLOUDINARY_NAME, 
																			 "api_key" : CLOUDINARY_API_KEY, 
																			 "api_secret" : CLOUDINARY_API_SECRET
																			});

									$('.upload_field').unsigned_cloudinary_upload("etwqhewl", {cloud_name: CLOUDINARY_NAME, 
																								public_id: imagename, 
																								tags: projectname, 
																								folder: projectname},
														{multiple: true}).bind('cloudinarydone', function(e, data){

															$('.thumbnails').append($.cloudinary.image(data.result.public_id, {
																format: 'jpg',
															    width: 150,
															    height: 100,
															    crop: 'thumb',
															    gravity: 'face',
															    effect: 'sharpen:300'
															}));

															$('input:text').val($('.thumbnails').find('img').prop('src'));		
														});
								}
								break;
						}
					});
				}
			});
		}
	});
})
    