/*
*	Programmed By: Codin Pangell, InternetCowboy.org
*/
$(document).ready(function() {
	
	
	preload([
		'GuideBuild2_00000.png'
	]);
	
	$('.forward').live('click',function(){
		$('#guideimg').sprite({
			'spriteHeight': 3952, 
			'height': 104,
			'image': 'GuideBuild2_00000.png', 
			'intervalRate': 40, 
			'stopOnEnd': false,
			'direction': 'forward',
			'callbackfunction': function(){}
		});
	});
	$('.reverse').live('click',function(){
		$('#guideimg').sprite({
			'spriteHeight': 3952, 
			'height': 104,
			'image': 'GuideBuild2_00000.png', 
			'intervalRate': 40, 
			'stopOnEnd': false,
			'direction': 'reverse',
			'callbackfunction': function(){}
		});
	});
	
});
function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
       $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
}


(function( $ ) {
/**
 * jquery.sprite - jQuery Plugin to animate a sprite.
 * @version: 1.0
 * @requires jQuery v1.2.2 or later
 * @author Codin Pangell - Internet Cowboy LLC 2012
 * All Rights Reserved
**/
	$.fn.sprite = function( options ) {
		var settings = $.extend( {
			'spriteHeight': 12064, 
			'height': 104,
			'curFrame': 0,
			'intervalRate': 40, 
			'image': '',
			'direction': 'forward',
			'stopOnEnd': true,
			'callbackfunction': function(){}
		}, options);
		var opt = settings;   
		var obj = $(this);
		
		var availableFrames=(opt.spriteHeight/opt.height);
		//set image
		$(obj).html("<img src='"+opt.image+"' />");
		if (opt.direction=="forward"){
			opt.curFrame=0;
		}else{
			opt.curFrame=availableFrames;
		}
		
		var spriteIvl=setInterval(function(){	
			//increment or decrement based on vertical direction
			if (opt.direction=="forward"){
				opt.curFrame++;
			}else{
				opt.curFrame--;
			}
			//animate	
			if ((availableFrames<=opt.curFrame) || ($(obj).css('marginTop')==$(obj).css('marginTop',opt.spriteHeight+'px')) || (opt.direction=="reverse" && opt.curFrame==0) ){
				if (opt.stopOnEnd==true){
					opt.curFrame=-1;
				}else{
					clearInterval(spriteIvl);
				}
				opt.callbackfunction();
			}else{
				$(obj).css('marginTop',((opt.height*opt.curFrame)*-1)+'px');
			}
			console.log(opt.curFrame);
		},opt.intervalRate);
	};
})( jQuery );