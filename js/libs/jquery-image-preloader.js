/*******JQUERY UI IMAGE LOADER PLUGIN by alan clarke**/
(function(c){c.widget("ui.imageLoader",{options:{async:!0,images:[]},total:0,_init:function(){var a;this.total++;this.loaded=0;this.data=[];this.stats={loaded:0,errored:0,allcomplete:!1};if(typeof this.options.images==="string"){var b=[];c.map(c(this.options.images),function(a){b.push(c(a).attr("src"))});this.options.images=b}for(a=0;a<this.options.images.length;a++)this.data.push({init:!1,complete:!1,error:!1,src:this.options.images[a],img:new Image,i:a});for(a=0;a<this.data.length&&(this.options.async===
!0||a===0||a<parseInt(this.options.async,10));a++)this._loadImg(a);return this},_loadImg:function(a){var b=this;if(a!==!1&&a<b.data.length&&!b.data[a].init)b.data[a].init=!0,b._trigger("start",null,{i:a,data:c.extend(!0,{},b.data)}),setTimeout(function(){b.data[a].img.onerror=function(){b.loaded++;b.stats.errored++;b.data[a].error=!0;b._trigger("error",null,{i:a,data:c.extend(!0,{},b.data)});b._complete(a)};b.data[a].img.onload=function(){if(b.data[a].img.width<1)return b.data[a].img.onerror();b.loaded++;
b.stats.loaded++;b.data[a].complete=!0;b._trigger("complete",null,{i:a,data:c.extend(!0,{},b.data)});b._complete(a)};b.data[a].img.src=b.data[a].src},1)},_complete:function(a){(!this.options.async||typeof this.options.async==="number")&&this._loadImg(this._next(a));if(this.loaded===this.data.length)this._trigger("allcomplete",null,c.extend(!0,{},this.data)),this.stats.allcomplete=!0},_next:function(a){var b;for(b=0;b<this.data.length;b++)if(b!==a&&!this.data[b].init)return b;return!1},getData:function(){return c.extend(!0,
[],this.data)},getStats:function(){return c.extend(!0,[],this.stats)},destroy:function(){c.Widget.prototype.destroy.apply(this,arguments)}})})(jQuery);
/*******END JQUERY UI IMAGE LOADER PLUGIN ************/