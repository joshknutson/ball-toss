var canvas;
var ctx;
var ball = {
	x : 200,
	y : 400,
	radius : 20,
	vx : 0,
	vy : 0

};
var bounds = {
	left : 0,
	right : 600
};
var currentX = ball.x;
var lastX = currentX;
var currentY = ball.y;
var lastY = currentY;
var isDragging = false;
var offset;
var gravity = 10;
var bounce = 0.6;
var mousePosX = 0;
var mousePosY = 0;
var thrown = 'false';

function animate() {
	if(isDragging) {
		// throw physics for x
		lastX = currentX;
		currentX = mousePosX;
		ball.vx = (currentX - lastX) / 2;
		// throw physics for y
		lastY = currentY;
		currentY = mousePosY;
		ball.vy = (currentY - lastY) / 2;

	} else {

		// ball motion and bounds testing
		collideTest(ball);
		ball.x += ball.vx;
		// left
		if(ball.x - ball.radius <= 0) {
			// reverse velocity sign
			ball.vx *= -1;
			// move ball back off the edge so it doesn't duplicate the hit detection on
			// consecutive frames
			ball.x = ball.x + (ball.radius - ball.x);
		}
		// right

		if(ball.x + ball.radius >= 600) {
			ball.vx *= -1;
			ball.x = ball.x - ((ball.x + ball.radius) - 600);

			//if(thrown=='false'){
			//socket.publish("myChannel",{name: 'Publisher', id: '123'});
			//socket.publish("myChannel",{name: 'Ball', ballx: ball.x});
			//socket.publish("myChannel",{name: 'Ball', ballx: ball.x, bally: ball.y,ballvx: ball.vx,ballvy: ball.vy, radius:ball.radius});
			//thrown = 'true';
			//}

		}
		// top
		if(ball.y - ball.radius <= 0) {
			if(ball.userid == undefined) {
				ball.userid = myid;
			}

			if(thrown == 'false' && ball.userid == myid) {
				//console.log('thrown out of bounds');
				console.log('publish');
				clearBall();
				socket.publish("myChannel", {
					userid : myid,
					name : 'Ball',
					ballx : ball.x,
					bally : ball.y,
					ballvx : ball.vx,
					ballvy : ball.vy,
					radius : ball.radius,
					color : ball.color
				});
				thrown = 'true'

				//ball.vy *= -1;
				//ball.y = ball.y + (ball.radius - ball.y);

			} else {
				ball.vy *= -1;
				ball.y = ball.y + (ball.radius - ball.y);
			}
		}
		// bottom
		if(ball.y + ball.radius >= 600) {
			ball.vy *= -1;
			ball.vy *= bounce;
			ball.y = ball.y - ((Math.floor(ball.y) + ball.radius) - 600);
		}
		ball.y += ball.vy;
		ball.vy = ball.vy + (gravity / 40);
		// sideways friction
		ball.vx *= 0.99;
	}

	drawBall(ball);
	//requestAnimFrame(animate)
}

function clickevent(me) {
	var clickevent = me;
	if(clickevent == 'mousedown' && 'ontouchstart' in document.documentElement) {
		clickevent == 'touchstart';
	} else if(clickevent == 'mousemove' && 'ontouchmove' in document.documentElement) {
		clickevent == 'touchmove';
	} else if(clickevent == 'mouseup' && 'ontouchend' in document.documentElement) {
		clickevent == 'touchend';
	}
	;

	return clickevent;
}

function onDown(e) {

	thrown == 'false'
	//ball.userid=myid;
	isDragging = true;
	mousePosX = e.clientX - canvas.offsetLeft;
	mousePosY = e.clientY - canvas.offsetTop;
	try {
		addEventListener(clickevent('mousemove'), function(e) {
			onMove(e);

		}, false);
	} catch(e) {
		// ie
		attachEvent('mousemove', function(e) {
			onMove(e);
		}, false);
	}
}

function onUp(e) {
	isDragging = false;
	try {
		removeEventListener(clickevent('mousemove'), function(e) {
			onMove(e);
		}, false);
	} catch(e) {
		// ie
		detachEvent('mousemove', function(e) {
			onMove(e);
		}, false);
	}
}

function onMove(e) {
	if(isDragging) {

		mousePosX = e.clientX - canvas.offsetLeft;
		mousePosY = e.clientY - canvas.offsetTop;
		ball.x = mousePosX;
		ball.y = mousePosY;
		if(ball.x <= bounds.left) {
			ball.x = bounds.left;
		} else if(ball.x >= bounds.right) {
			ball.x = bounds.right;
		}

	}
}

function grab() {

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	reciever = document.querySelector('.receiver');
	if(reciever == null) {
		try {
			canvas.addEventListener(clickevent('mousedown'), function(e) {
				onDown(e);
			}, false);
			canvas.addEventListener('mouseup', function(e) {
				onUp(e);
			}, false);
		} catch(e) {
			// for IE
			canvas.attachEvent(clickevent('mousedown'), function(e) {
				onDown(e);
			}, false);
			canvas.attachEvent('mouseup', function(e) {
				onUp(e);
			}, false);
		}
		drawBall(ball);
		thing = setInterval(animate, 1000 / 30);
	}


}

function drawBall(ball) {
	ctx.clearRect(0, 0, 600, 600);
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
	ctx.stroke();

	ctx.fillStyle = ball.color;
	//if(ball.color==undefined){
	//	ctx.fillStyle= '#8ED6FF';
	//	ball.color= '#8ED6FF';
	//}
	//ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();

}

function redrawBall(ball) {
	isDragging = false;
	drawBall(ball);
	this.ball = ball;
	thing = setInterval(animate, 1000 / 30);
}

function clearBall() {
	clearInterval(thing)
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, 600, 600);

}

messageHandler = function(msg) {
	reciever = document.querySelector('.receiver');
	if( typeof (msg) == 'object' && Object.prototype.hasOwnProperty.call(msg, 'data') && reciever != null) {
		if (typeof msg.dat === 'string') {
			response = JSON.parse(msg.data);
		} else {
			theObj = msg.data;
		}
		console.log('thrown by:  ' + theObj.userid);
		if(thrown) {
			App.addMessage("incoming ball");
			var ball2 = {
				x : 600,
				y : 600,
				radius : theObj.radius,
				vx : Math.abs(theObj.ballvx),
				vy : Math.abs(theObj.ballvy),
				userid : theObj.userid,
				color : theObj.color
			};
			redrawBall(ball2);
		}
	}

};

function collideTest(ball) {

	t = document.getElementById('target_0');

	if(t != undefined) {

		var targets = document.querySelectorAll('.target');
		var balls = [ball];

		for( i = targets.length; i--; ) {
			for( j = balls.length; j--; ) {
				var T = targets[i];
				var B = balls[j];

				T.class = T.getAttribute('id');
				T.top = T.offsetHeight;
				T.left = T.offsetLeft;
				T.height = T.clientHeight;
				T.width = T.clientWidth;

				B.class = ball.id;
				B.top = B.y;
				B.left = B.x;
				B.height = B.radius * 2;
				if((T.top <= B.top && (T.top + T.height) >= B.top) || (B.top <= T.top && (B.top + B.height) >= T.top)) {
					if((T.left <= B.left && (T.left + T.width) >= B.left) || (B.left <= T.left && (B.left + B.width) >= T.left)) {
						App.addMessage("Ouch!");
					}
				}
			}
		}

	}
}

function reset() {
	clearBall();
	var ball = {
		x : 200,
		y : 400,
		radius : 20,
		vx : 0,
		vy : 0
	};

	currentX = ball.x;
	lastX = currentX;
	currentY = ball.y;
	lastY = currentY; offset;
	gravity = 10;
	bounce = 0.6;
	mousePosX = 0;
	mousePosY = 0;

	thrown = 'false';
	isDragging = false;
	ball.userid = undefined;
	//ball.userid = myid;
	this.ball = ball;
	this.ball.color = randomColor();
	grab();
}

window.onload = grab;
