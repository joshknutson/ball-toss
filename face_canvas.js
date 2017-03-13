var App = {
	Start : function(stream) {
		if (App.video.mozSrcObject !== undefined) {
            App.video.mozSrcObject = stream;
        } else {
			var domURL = window.URL || window.webkitURL;
			App.video.src = domURL ? domURL.createObjectURL(stream) : stream;
		}
		setTimeout(function() {
			App.canvas.width = App.video.videoWidth;
			App.canvas.height = App.video.videoHeight;
			App.backCanvas.width = App.video.videoWidth / 4;
			App.backCanvas.height = App.video.videoHeight / 4;
			App.backContext = App.backCanvas.getContext('2d');
			var w = 300 / 4 * 0.8, h = 270 / 4 * 0.8;
			App.comp = [{
				x : (App.video.videoWidth / 4 - w) / 2,
				y : (App.video.videoHeight / 4 - h) / 2,
				width : w,
				height : h
			}];
			//setTimeout(App.drawToCanvas, 60);
			setInterval(App.drawToCanvas, 600);
		}, 500);
	},
	Error : function(error) {
		alert('Please go to about:flags in Google Chrome and enable the "MediaStream" flag.');
		return;
	},
	drawToCanvas : function() {
		var video = App.video, ctx = App.context, backCtx = App.backContext, m = 4, w = 4, i, comp, previous, current;

		if(App.video.paused || App.video.ended)
			return false;

		ctx.drawImage(video, 0, 0, App.canvas.width, App.canvas.height);

		//get base64 encoded data from Canvas
		current = App.canvas.toDataURL("image/png");

		App.cleanUp();

		if(App.comp.length > 1) {
			console.log(App.comp.length);
		}

		//just in case if the previous frame is same as current
		if(previous != current) {

			backCtx.drawImage(video, 0, 0, App.backCanvas.width, App.backCanvas.height);

			comp = ccv.detect_objects(App.ccv = App.ccv || {
				canvas : App.backCanvas,
				cascade : cascade,
				interval : 4,
				min_neighbors : 1
			});

			if(comp.length) {
				App.comp = comp;
			}
			if(comp.length) {
				var x_offset = 0, y_offset = 0, x_scale = 1, y_scale = 1;

				if(App.canvas.clientWidth * App.canvas.height > App.canvas.width * App.canvas.clientHeight) {
					x_offset = (App.canvas.clientWidth - App.canvas.clientHeight * App.canvas.width / App.canvas.height) / 2;
				} else {
					y_offset = (App.canvas.clientHeight - App.canvas.clientWidth * App.canvas.height / App.canvas.width) / 2;
				}
				x_scale = (App.canvas.clientWidth - x_offset * 2) / App.canvas.width;
				y_scale = (App.canvas.clientHeight - y_offset * 2) / App.canvas.height;

				/*console.log(x_offset, 'x_offset')
				 console.log(y_offset, 'y_offset')
				 console.log(x_scale, 'x_scale')
				 console.log(y_scale, 'y_scale')
				 */
				for( i = App.comp.length; i--; ) {

					App.target = document.getElementById('target_' + i);
					if(App.target === null) {
						App.target = document.createElement('div');
						App.target.setAttribute('id', 'target_' + i);
						App.target.setAttribute('class', 'target');
						document.querySelector('body').appendChild(App.target);
						App.target = document.getElementById('target_' + i);
					}
					var opacity = 0.1;

					if(App.comp[i].confidence > 0) {
						opacity += App.comp[i].confidence / 10;
						if(opacity > 1.0)
							opacity = 1.0;
					}

					App.target.style.opacity = roundNumber(opacity, 2);

					App.target.style.border = roundNumber(opacity * 10, 2) + 'px solid rgb(255,0,0)';
					/*
					 comp[i].width = comp[i].width * x_scale;
					 comp[i].height = comp[i].height * y_scale;
					 comp[i].x = comp[i].x * x_scale + x_offset;
					 comp[i].y = comp[i].y * y_scale + y_offset;
					 */

					App.target.style.width = roundNumber(((App.comp[i].width * x_scale) + w) * m, 2) + 'px';
					App.target.style.height = roundNumber(((App.comp[i].height * y_scale) + w) * m, 2) + 'px';
					//App.target.style.left = roundNumber(((App.comp[i].x * x_scale) + x_offset) * m, 2) + 'px';
					App.target.style.left = Math.round(((App.comp[i].x - w / 2) * m)) + 'px';
					App.target.style.top = roundNumber(((App.comp[i].y * y_scale) + y_offset) * m, 2) + 'px';

					/*
					 App.target.style.width = Math.round((App.comp[i].width + w) * m)+ 'px';
					 App.target.style.height = Math.round((App.comp[i].height + w) * m) + 'px';
					 App.target.style.left = Math.round(((App.comp[i].x - w / 2) * m) )+ 'px';
					 App.target.style.top = Math.round((App.comp[i].y - w / 2) * m )+ 'px';
					 */
					//App.video.pause();
				}
			} else {
				App.addMessage('Are you Hiding');
			}
		}
		previous = current;
		//requestAnimationFrame(App.drawToCanvas)

	},
	cleanUp : function() {
		//remove the blocks
		var targets = document.querySelectorAll('.target');
		if(targets !== null) {
			for( i = targets.length; i--; ) {
				var target = document.getElementById('target_' + i);
				target.parentNode.removeChild(target);
			}
		}
	},
	addMessage : function(message) {

		var li = document.createElement('li');
		li.innerHTML = message;

		var el = document.querySelector('#messages');
		el.appendChild(li);
		div = el.parentNode;
		var scrollHeight = Math.max(div.scrollHeight, div.clientHeight);
		div.scrollTop = scrollHeight - div.clientHeight;

	}
};

App.init = function() {
	App.video = document.createElement('video');
	App.backCanvas = document.createElement('canvas');
	App.canvas = document.querySelector("#output");
	App.context = App.canvas.getContext("2d");

	App.video.style.width = '300px';
	App.video.style.height = '270px';

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	if(navigator.getUserMedia_) {
		navigator.getUserMedia_({"video": true, "audio": false}, App.Start, App.Error);
	} else {
		App.Error();
	}

	App.video.loop = App.video.muted = true;
	App.video.load();
	App.video.play();

};

document.addEventListener('DOMContentLoaded', function() {
	App.init();
}, false);
function roundNumber(num, dec) {
	var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
	return result;
}