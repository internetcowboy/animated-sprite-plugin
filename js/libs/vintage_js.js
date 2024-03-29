/* calling source
http://vintagejs.com


var isBig = true;

var updateTweets = function (query)
{
    $.get('/scripts/twitter.php', {query:query}, function (response) {
        var target = $('#tweets');
        for (var i in response.results) {
            var tweet = response.results[i].text;
            tweet = tweet.replace(/(http:\/\/\S+)/g,"<a href='$1' target='_blank'>$1</a>");
            tweet = tweet.replace(/@(\w+)/g,"<a href='http://twitter.com/#!/$1' target='_blank'>$1</a>");
            target.append('<li class="clearfix"><img src="'+response.results[i].profile_image_url+'" alt="" class="fleft" /><span><a href="http://twitter.com/#!/'+response.results[i].from_user+'" class="user" target="_blank"><strong>' + response.results[i].from_user + '</strong></a>: '+tweet+'</span></li>');
        }
        
        setTimeout("updateTweets('" + response.refresh_url + "')",30000);
    }, 'json');
}

var showApply = function (path)
{
    if (isBig) {
        $('*').removeClass('big');
        $('#content article').hide();
        var section = $('#uploadForm').parent('section');
        section.empty();
        section.append('<div class="loader">Loading</div>');

        var image = new Image();
        image.src = path;
        image.onload = function () {
            this.onload=null;
            var img = $(this).addClass('theImage').hide().data('vintageSource',this.src);
            var height = this.height - 441 + 120;
            
            section.empty();

            $('body').css('background-position','50% ' + height + 'px');

            section.append(img);
            img.fadeIn('slow');

            $.get('controls.html', function (r) {
                section.append(r);
            });
        }
        isBig = false;
    }
};

var vintageDefaults = {
    vignette: {black:0,white:0},
    noise: false,
    screen: false,
    desaturate: false,
    allowMultiEffect: true,
    mime: 'image/jpeg',
    viewFinder: false,
    curves: false,
    blur: false,
    callback: function () {
        $('#saveImage').removeClass('disabled');
    }
};

var updateVintageJS = function (el, value) {
    if (el.is('.vignette-dark')) {
           vintageDefaults.vignette.black = value/100 || 0;
    }
    else if (el.is('.vignette-light')) {
           vintageDefaults.vignette.white = value/100 || 0;
    }
    else if (el.is('.curves')) {
        vintageDefaults.curves = (vintageDefaults.curves === false) ? true : false;
    }
    else if (el.is('.ttv')) {
        vintageDefaults.viewFinder = (vintageDefaults.viewFinder === false) ? '/img/viewfinder_bw.jpg' : false;
    }
    else if (el.is('.screenlayer')) {
        vintageDefaults.screen = (vintageDefaults.screen === false) ? {red: 227,green: 12,blue: 169,strength: 0.15} : false;
    }
    else if (el.is('.desaturate')) {
        vintageDefaults.desaturate = value/100 || false;
    } else if (el.is('.blur')) {
        vintageDefaults.blur = (vintageDefaults.blur === false) ? 1 : false;
    }
    var img = $('.theImage');
    img.vintage(vintageDefaults);
};

var saveImage = function (hash,obj) {
    obj.addClass('disabled').text('Saving...');

    var public = 0;
    if ($('.switch.public').is('.on')) {
        public = 1;
    }
    
    $.ajax({
        type: 'POST',
        url: '/scripts/save.php',
        dataType: 'json',
        cache: false,
        data: {
            filename: tmpFile,
            hash: hash,
            imageData: $('.theImage').attr('src'),
            public: public
        },
        error: function () {
            alert('An error occured. Pleas try again.');
            obj.removeClass('disabled').text('Save image');
        },
        success: function (response) {
            window.location = response.url;
        }
        
    });
}

var tmpFile;

$(function () {
    $('.uploadify label, .uploadify input[type=submit]').hide();
    $('#file_upload').uploadify({
        uploader: '/js/uploadify.swf',
        script: '/uploadify.php',
        cancelImg: '/img/cancel.png',
        folder: '/uploads/tmp/',
        auto: true,
        buttonImg: '/img/upload.png',
        multi: false,
        wmode: 'opaque',
        height: 178,
        width: 136,
        fileExt: '*.jpg',
        fileDesc: 'JPEG Images',
        queueID: 'uploadqueue',
        onComplete: function (event, ID, fileObj, response, data) {
            if (response !== null && response !== undefined) {
                tmpFile = response;
                showApply(response);
            }
        }
    });

    $('.switch').live('click', function (e) {
        e.preventDefault();
        if ($(this).is('.on')) {
            $(this).removeClass('on').addClass('off');
        } else {
            $(this).removeClass('off').addClass('on');
        }
        if (!$(this).is('.public')) {
            updateVintageJS($(this));
          }
    });
    
    $('#content article').hide();
    $('#nav a').not(':first').click(function(e) {
        e.preventDefault();
        var obj = $($(this).attr('href'));
        if (obj.is(':visible')) {
            obj.hide();
            $('#content').hide();
        } else {
            $('#content').show();
            $('#content article').hide();
            obj.show();
        }
    });
    
    $('.voices a').click(function() {
      updateTweets('?q=vintageJS')
    });
    
    $('.vintageDemo').live('click', function () {
        var demoImg = $(this);
        if(!demoImg.data('vintageSource')) {
            demoImg.data('vintageSource', demoImg.attr('src'))
        }
        demoImg.vintage({
            vignette: {
                black: 0.6 + (0.3-Math.random()*0.6),
                white: 0.4 + (0.1-Math.random()*0.2)
            },
            noise: Math.round(Math.random()*20),
            screen: {
                red: 227,
                green: 12,
                blue: 169,
                strength: 0.1+(Math.random()*0.1)
            },
            desaturate: Math.pow(Math.random(),5),
            allowMultiEffect: true,
            mime: 'image/jpeg',
            viewFinder: '/img/viewfinder_bw.jpg',
            curves: true,
            blur: false
        });
    });
    
});
*/

/**
 * vintageJS is a jQuery plugin that uses the HTML5 canvas element to add a vintage look to images
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 * http://jquery.com
 *
 *
 * @author Robert Fleischmann
 * @version 1.1.0
 */
jQuery.fn.vintage = function (options) {

    /**
     * RGB-Curves for vintage effect
     */
    var r = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        g = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255],
        b = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];

    /**
     * default options
     */
    var defaultOptions = {

        //effect settings
        curves: false,
        screen: false,
        blur: false,
        desaturate: false,
        vignette: false,
        noise: false,
        viewFinder: false,

        //general settings
        allowMultiEffect: true,
        mime: 'image/jpeg',
        callback: false
    };

    /**
     * Load default preset options or custom configuration
     */
    options = jQuery.extend(defaultOptions, options) || defaultOptions;

    return this.each(function () {

        var obj = jQuery(this),
            ctx,
            canvas,
            loader,
            imageData,
            stack = new Array();

        /**
         * Check if the object is an image
         */
        if (!obj.is('img')) {
            return;
        }

        /**
         * Set Flag if allowMultiEffect is false and stop script if it was executed before and allowMultiEffect is false
         */
        if (options.allowMultiEffect === false) {
            if (obj.data('vintage-applied') !== true) {
                obj.data('vintage-applied', true);
            } else {
                return;
            }
        }

        /**
         * Add loader on top of the image and start the image manipulation routine
         */
        var initVintage = function () {
            var pos = obj.offset();
            pos.top += Math.round(obj.height()/2);
            pos.left += Math.round(obj.width()/2);
            loader = jQuery('<div class="vintage-loader">Loading&hellip;</div>');
            loader.css('top',pos.top+'px').css('left',pos.left+'px').hide().appendTo('body').fadeTo(0, 0.8, function () {
                process();
            });
        };


        /**
         * The image manipulation routine:
         * At first a canvas element will be created and the source image is drawn on it.
         * After that all the effects are applied to the canvas as defined in the options object.
         * To finish the process, the image data is converted into a base64 string which will overwrite the src attribute of the source image
         */
        var process = function () {

            canvas = jQuery('<canvas></canvas>').get(0);

            if (!canvas.getContext) {
                loader.addClass('error').html('Your browser does not support the canvas element.').animate({opacity:'+=0'},3000,function () {
                    $(this).fadeOut(300, function () {
                        $(this).remove();
                    });
                });
            } else {
                ctx = canvas.getContext('2d');
                //create image object
                var image = new Image();
                //set image source
                image.src = obj.data('vintageSource') || obj.attr('src');
                //bind onload function to manipulate the image
                image.onload = function () {

                    //resize canvas
                    canvas.width = this.width;
                    canvas.height = this.height;

                    //draw image
                    ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);

                    imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

                    //prepare routine
                    if (options.curves !== false) {
                        stack.push(adjustCurves);
                    }

                    if (options.screen !== false) {
                        stack.push(screenLayer);
                    }

                    if (options.blur !== false) {
                        stack.push(blurImage);
                    }

                    if (options.desaturate !== false) {
                        stack.push(desaturate);
                    }

                    if (options.vignette !== false) {
                        stack.push(addVignette);
                    }

                    if (options.noise !== false) {
                        stack.push(addNoise);
                    }

                    if (options.viewFinder !== false) {
                        stack.push(addViewfinder);
                    }

                    if (options.finalize !== false) {
                        stack.push(function () {
                            ctx.putImageData(imageData,0,0);
                            //replace source with BASE64 code
                            obj.attr('src', canvas.toDataURL(options.mime));
                            loader.remove();
                            runFunctions();
                        });
                    }
                    
                    if (options.callback !== false) {
                        stack.push(options.callback);
                    }

                    runFunctions();

                };
            }
        };

        var adjustCurves = function ()
        {
            for (var i=0; i < imageData.data.length; i+=4) {
                imageData.data[i  ] = r[imageData.data[i  ]];
                imageData.data[i+1] = g[imageData.data[i+1]];
                imageData.data[i+2] = b[imageData.data[i+2]];
            }
            runFunctions();
        }

        var screenLayer = function ()
        {
            for (var i=0; i < imageData.data.length; i+=4) {
                imageData.data[i  ] = 255 - ((255 - imageData.data[i  ]) * (255 - options.screen.red * options.screen.strength) / 255);
                imageData.data[i+1] = 255 - ((255 - imageData.data[i+1]) * (255 - options.screen.green * options.screen.strength) / 255);
                imageData.data[i+2] = 255 - ((255 - imageData.data[i+2]) * (255 - options.screen.blue * options.screen.strength) / 255);
            }
            runFunctions();
        }

        var blurImage = function ()
        {
            ctx.putImageData(imageData,0,0);
            var bluredImageData = imageData;
            
            var maxDistance = Math.sqrt(Math.pow(canvas.width/2,2) + Math.pow(canvas.height/2,2));
            
            for (var y=0; y < canvas.height; y++) {
                for (var x=0; x < canvas.width; x++) {
                    
                    var blur = Math.sqrt(Math.pow(x-canvas.width/2, 2) + Math.pow(y-canvas.height/2,2)) / maxDistance;

                    //i want a 9x9 matrix or smaller on edges
                    var px = x-2,
                        py = y-2,
                        dx = 5,
                        dy = 5;

                    if (px < 0) {
                        dx += px;
                        px = 0;
                    }

                    if (py < 0) {
                        dy += py;
                        py = 0;
                    }

                    if ((px+dx) > canvas.width) {
                        dx += canvas.width-(px+dx);
                    }

                    if ((py+dy) > canvas.height) {
                        dy += canvas.height-(py+dy);
                    }

                    var partialData = ctx.getImageData(px,py,dx,dy);

                    //get median
                    var pixelData = [0,0,0];
                    for (var j=0; j<partialData.data.length; j+=4) {
                        pixelData[0] += partialData.data[j  ] / (partialData.data.length/4);
                        pixelData[1] += partialData.data[j+1] / (partialData.data.length/4);
                        pixelData[2] += partialData.data[j+2] / (partialData.data.length/4);
                    }

                    var idx = (y*canvas.width+x)*4;
                    bluredImageData.data[idx  ] = Math.floor(blur*pixelData[0] + (1-blur)*imageData.data[idx  ]);
                    bluredImageData.data[idx+1] = Math.floor(blur*pixelData[1] + (1-blur)*imageData.data[idx+1]);
                    bluredImageData.data[idx+2] = Math.floor(blur*pixelData[2] + (1-blur)*imageData.data[idx+2]);

                }
            }
            imageData = bluredImageData;
            ctx.putImageData(imageData,0,0);
            runFunctions();
        }

        var desaturate = function ()
        {
            for (var i=0; i < imageData.data.length; i+=4) {
                var average = ( imageData.data[i] + imageData.data[i+1] + imageData.data[i+2] ) / 3;

                imageData.data[i  ] += Math.round( ( average - imageData.data[i  ] ) * options.desaturate );
                imageData.data[i+1] += Math.round( ( average - imageData.data[i+1] ) * options.desaturate );
                imageData.data[i+2] += Math.round( ( average - imageData.data[i+2] ) * options.desaturate );
            }
            runFunctions();
        }

        /**
         * Adds a vignette effect to the canvas with a lighten effect in the middle and a darken effect on the edges
         */
        var addVignette = function () {
            var gradient;
            var outerRadius = Math.sqrt( Math.pow(canvas.width/2, 2) + Math.pow(canvas.height/2, 2) );

            ctx.putImageData(imageData,0,0);

            ctx.globalCompositeOperation = 'source-over';
            gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, outerRadius);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.5, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,' + options.vignette.black + ')');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = 'lighter';
            gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, outerRadius);
            gradient.addColorStop(0, 'rgba(255,255,255,' + options.vignette.white + ')');
            gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

            runFunctions();
        };

        var addNoise = function ()
        {
            for (var i=0; i < imageData.data.length; i+=4) {
                var noise = Math.round(options.noise - Math.random() * options.noise/2);

                var dblHlp = 0;
                for(var k=0; k<3; k++){
                    dblHlp = noise + imageData.data[i+k];
                    imageData.data[i+k] = ((dblHlp > 255) ? 255 : ((dblHlp < 0) ? 0 : dblHlp));
                }
            }
            
            runFunctions();
        }

        var addViewfinder = function ()
        {
            var img = new Image();
            img.src = options.viewFinder;
            img.onload = function () {

                var viewFinderCanvas = jQuery('<canvas></canvas>').get(0);
                var viewFinderCtx = viewFinderCanvas.getContext('2d');

                viewFinderCanvas.width = canvas.width;
                viewFinderCanvas.height = canvas.height;

                viewFinderCtx.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);
                var viewFinderImageData = viewFinderCtx.getImageData(0, 0, canvas.width, canvas.height);

                for (var a = 0; a < imageData.data.length; a+=4) {
                    //red channel
                    var red = ( imageData.data[a  ] * viewFinderImageData.data[a  ]) / 255;
                    imageData.data[a  ] = red > 255 ? 255 : red < 0 ? 0 : red;
                    //green channel
                    var green = ( imageData.data[a+1] * viewFinderImageData.data[a+1]) / 255;
                    imageData.data[a+1] = green > 255 ? green : green < 0 ? 0 : green;
                    //blue channel
                    var blue = ( imageData.data[a+2] * viewFinderImageData.data[a+2]) / 255;
                    imageData.data[a+2] = blue > 255 ? 255 : blue < 0 ? 0 : blue;
                }
                runFunctions();
            }
        }

        var runFunctions = function ()
        {
            if (stack.length <= 0) {
                return;
            }
            
            var leFunction = stack[0];
            stack.splice(0,1);
            leFunction();
        }

        /**
         * Run vintage effec
         */
        initVintage();

    });
};

