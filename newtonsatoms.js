// Canvas setup
var canvas = document.getElementById('myCanvas');
var ctx=canvas.getContext("2d");
var width, height;
var rects;
var canvasInit = function(){
	width = window.innerWidth;
	height = window.innerHeight;	
	canvas.width = width;
	canvas.height = height;
	view.viewSize = new Size(width, height);
	view.draw();
	
	rects = new Array(width);
	for(var i = 0;i < width;i++){
		rects[i] = new Array(height);
		for(var j = 0;j < height;j++){
			var rectangle = new Rectangle(i,j,1,1);
			rects[i][j] = new Path.Rectangle(rectangle);
			rects[i][j].fillColor = 'red';
		}
	}
};

canvasInit();
window.onresize = canvasInit;

var maxIt = 20;
var eps = 0.005;
var zalpha, zbeta,zgamma;
	
// Zero points. Clean up into an object.
var alpha = math.complex(Math.random(), height * Math.random() / width );
var beta = math.complex(Math.random(), height * Math.random() / width );
var gamma = math.complex(Math.random(), height * Math.random() / width );
var alphaD = 2 * Math.PI * Math.random();
var betaD = 2 * Math.PI * Math.random();
var gammaD = 2 * Math.PI * Math.random();
var delta = 1 / width;
// Clean up to keep within boundaries.
var moveGreeks = function(){
	alpha = math.add( alpha, math.multiply( delta, math.complex( Math.cos( alphaD ), Math.sin( alphaD ) ) ) );	
	beta = math.add( beta, math.multiply( delta, math.complex( Math.cos( betaD ), Math.sin( betaD ) ) ) );	
	gamma = math.add( gamma, math.multiply( delta, math.complex( Math.cos( gammaD ), Math.sin( gammaD ) ) ) );	
};

var F = function(){
	return math.multiply(zalpha,math.multiply(zbeta, zgamma));
};

var dF = function(){
	return math.add(math.multiply(zalpha,zbeta),math.add(math.multiply(zalpha,zgamma),math.multiply(zbeta,zgamma)));
};

// Main loop	
function onFrame(event){
	moveGreeks();
	for(var i = 0;i < width;i++){
		var zx = i / width;
		for(var j=0;j<height;j++){
			var zy = j / width;
			var z = math.complex(zx, zy);
			for(var loop=0; loop<maxIt; loop++){
				zalpha = math.subtract(z,alpha);
				zbeta = math.subtract(z,beta);
				zgamma = math.subtract(z,gamma);
				var fillHue, fillAlpha;
				z =  math.subtract(z , math.divide( F() , dF() ) );
				if (math.abs(math.subtract(z, alpha)) < eps){
					fillHue = event.count % 360;
					fillAlpha = loop/maxIt;
					break;
				}
				else if (math.abs(math.subtract(z, beta)) < eps){
					fillHue = (120 + event.count) % 360;
					fillAlpha = loop/maxIt;
					break;
				}
				else if (math.abs(math.subtract(z, gamma)) < eps){ 
					fillHue = ( 240 + event.count ) % 360;
					fillAlpha = loop/maxIt;
					break;
				}
			}
		rects[i][j].fillColor.hue = fillHue;
		rects[i][j].fillColor.alpha = fillAlpha;
		}
	}
}


