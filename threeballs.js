// Canvas setup
var canvas = document.getElementById('myCanvas');
var width, height, radius, center;
var canvasInit = function(){
	width = window.innerWidth;
	height = window.innerHeight;
	radius = Math.min(height, width) / 2;
	center = [width / 2, height /2 ];

	canvas.width = width;
	canvas.height = height 
	view.viewSize = new Size(width, height);
	view.draw();
}
canvasInit();
window.onresize = canvasInit;


// Circle setup
var radius = 40;
var speed = 2;
var mainCircs = new Array(3);
var mainVel = new Array(3);
for(t =0; t<3; t++){
	var myCircle = new Path.Circle(new Point( radius + ( Math.random() * ( width - ( 2 * radius ) ) ) , radius + ( Math.random() * ( height - (2 * radius) )  ) ), radius);
	myCircle.fillColor = 'white';
	mainCircs[t] = myCircle;
	mainVel[t] = 2 * Math.PI * Math.random();
}


// Main loop
function onFrame(event){

	for(t =0; t<3; t++){
		var newPoint = new Point( mainCircs[t].position.x + speed * Math.cos( mainVel[t] ), mainCircs[t].position.y + speed * Math.sin( mainVel[t]) );
		while( (newPoint.x - radius) < 0 || width < (newPoint.x + radius) || (newPoint.y - radius) < 0 || height < (newPoint.y + radius) ){
			mainVel[t] = 2 * Math.PI * Math.random();
			var newPoint = new Point( mainCircs[t].position.x + speed * Math.cos( mainVel[t] ), mainCircs[t].position.y + speed * Math.sin( mainVel[t]) );
		}
		mainCircs[t].position = newPoint;
	}

}
