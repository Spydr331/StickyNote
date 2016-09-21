
/* Sticky Note Class */

function Sticky()
{
	var $colors = $(".color");
	var $pixelboard = $(".pixeleditboard");
	var $results = $(".results");
	var $eraser = $(".eraser");
	var selected = "active";
	var isMouseDown = false;
	this.color = [$colors.filter(".active").css("background-color"), $colors.filter(".active").find("span").attr("rel")];
	var eraser = false;

	var size = 30;
	var width = 15;
	var height = 10;
	var spacing = 6;

	var $div = $('<div class="pixel"></div>');
	var $divPixels = null;
	var resultList = {};

	function rgb2hex(rgb){
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
	}

	this.countPostits = function(){
		var that = this;
		if($divPixels != null && $divPixels.size() > 0){
			$divPixels.each(function() {
				var count = $(this).attr("rel");

				if(count && resultList){
					var bg = rgb2hex($colors.eq(count).find("span").css("background-color"));
					resultList[bg] = resultList[bg] + 1 || 1;
				}
			});

			$results.html('');
			$.each(resultList, function(k,v){
				$results.append('<div class="col-md-4 col-sm-6 col-xs-12"><div class="pixel postit" style="background-color:#' + k + '"></div>'+v+'</div>');
			});

			resultList = {};
		}
	}

	this.setboard = function(){
		var that = this;
		$pixelboard.css({
			"width": (size * width + spacing * width + spacing) + "px",
				"height": (size * height + spacing * height + spacing) + "px"
		});

		$pixelboard.html("");

		for (i = 0; i < (width * height); i++) {
			var a = Math.random() * 10 - 5;
			$pixelboard.append($div.clone().css('transform', 'rotate(' + a + 'deg)'));
		}

		$divPixels = $pixelboard.find(".pixel");

		$divPixels.css({
			"width": size + "px",
				"height": size + "px"
		});

		$colors.click(function (e) {
			$colors.removeClass("active");
			$eraser.removeClass("active");
			eraser = false;
			that.color = [$(this).addClass("active").find("span").css("background-color"), $(this).find("span").attr("rel")];
		});
		$divPixels.on("mouseenter", function () {
			if (isMouseDown) {
				if (eraser === true)
					$(this).css("background-color", "").attr("rel", "").removeClass("postit");
				else
					$(this).css("background-color", that.color[0]).attr("rel", that.color[1]).addClass("postit");
				that.countPostits();
			}
		}).on("mousedown touchstart", function () {
			if (eraser === true)
				$(this).css("background-color", "").attr("rel", "").removeClass("postit");
			else
				$(this).css("background-color", that.color[0]).attr("rel", that.color[1]).addClass("postit");
			that.countPostits();
		});
		$eraser.click(function (e) {
			$colors.removeClass("active");
			$eraser.addClass("active");
			eraser = true;
		});

		$(".eraseall").click(function (e) {
			$divPixels.css("background-color", "").removeClass("postit");
			$results.html('');
		});
	}

	this.init = function(){
		var that = this;
		$('body').on("mousedown touchstart", function () {
			isMouseDown = true;
		}).on("mouseup touchend", function () {
			isMouseDown = false;
		});

		width = width > Math.round($(window).width() / (size + spacing*2)) ? Math.round($(window).width() / (size + spacing*2)) : width;

		$( "#coloreditresize" ).submit(function(e) {
		  	e.preventDefault();
			if((this.valsize.value  != '' && this.valwidth.value  != '' && this.valheight.value  != '')){
				size = this.valsize.value;
				width = this.valwidth.value;
				height = this.valheight.value;

				that.setboard();
			}
		});

		that.setboard();
		resultList = {};
	}
}


/* Sticky Note Code */
if($(".pixeleditboard").size() > 0){
	var s = new Sticky();
	s.init();
}
