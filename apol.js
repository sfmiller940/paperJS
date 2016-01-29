var solveApol = function(s1, s2, s3){
	var x1 = mainCircs[0].position.x;
	var y1 = mainCircs[0].position.y;
	var r1 = mainCircs[0].bounds.width / 2;
	var x2 = mainCircs[1].position.x;
	var y2 = mainCircs[1].position.y;
	var r2 = mainCircs[1].bounds.width / 2;
	var x3 = mainCircs[2].position.x;
	var y3 = mainCircs[2].position.y;
	var r3 = mainCircs[2].bounds.width / 2;

	var v11 = 2*x2 - 2*x1;
	var v12 = 2*y2 - 2*y1;
	var v13 = x1*x1 - x2*x2 + y1*y1 - y2*y2 - r1*r1 + r2*r2;
	var v14 = 2*s2*r2 - 2*s1*r1;

	var v21 = 2*x3 - 2*x2;
	var v22 = 2*y3 - 2*y2;
	var v23 = x2*x2 - x3*x3 + y2*y2 - y3*y3 - r2*r2 + r3*r3;
	var v24 = 2*s3*r3 - 2*s2*r2;

	var w12 = v12/v11;
	var w13 = v13/v11;
	var w14 = v14/v11;

	var w22 = v22/v21-w12;
	var w23 = v23/v21-w13;
	var w24 = v24/v21-w14;

	var P = -w23/w22;
	var Q = w24/w22;
	var M = -w12*P-w13;
	var N = w14 - w12*Q;

	var a = N*N + Q*Q - 1;
	var b = 2*M*N - 2*N*x1 + 2*P*Q - 2*Q*y1 + 2*s1*r1;
	var c = x1*x1 + M*M - 2*M*x1 + P*P + y1*y1 - 2*P*y1 - r1*r1;

	var D = ( b*b ) - (4*a*c);
	var rs = (-b - Math.sqrt(D))/(2*a);
	var xs = M + N * rs;
	var ys = P + Q * rs;
	return [xs,ys,rs];

};

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
var radius = 80;
var speed = 1;
var mainCircs = new Array(3);
var mainVel = new Array(3);
for(t =0; t<3; t++){
	mainCircs[t] = new Path.Circle(new Point( radius + ( Math.random() * ( width - ( 2 * radius ) ) ) , radius + ( Math.random() * ( height - (2 * radius) )  ) ), radius);
	mainCircs[t].fillColor = 'white';
	mainVel[t] = 2 * Math.PI * Math.random();
};

for(t =0; t<3; t++){
	while( mainCircs[t].position.getDistance( mainCircs[ (t + 1) % 3].position ) < 2 * radius || mainCircs[t].position.getDistance( mainCircs[(t+2)%3].position) < 2 * radius ){
		mainCircs[t].position = new Point( radius + ( Math.random() * ( width - ( 2 * radius ) ) ) , radius + ( Math.random() * ( height - (2 * radius) ) ) );
		mainCircs[t].fillColor = 'white';
	}
}

var apolCircs = new Array(8);
for (t = 0; t<8; t++){
	apolCircs[t] = new Path.Circle(new Point( 0,0 ), radius);
	apolCircs[t].fillColor = 'red';
	apolCircs[t].fillColor.alpha = 0.25;
	apolCircs[t].fillColor.hue = t * 45;
}

// Main loop
function onFrame(event){

	for(t =0; t<3; t++){
		var newPoint = new Point( mainCircs[t].position.x + speed * Math.cos( mainVel[t] ), mainCircs[t].position.y + speed * Math.sin( mainVel[t]) );
		while( (newPoint.x - radius) < 0 || width < (newPoint.x + radius) || (newPoint.y - radius) < 0 || height < (newPoint.y + radius) || newPoint.getDistance( mainCircs[ (t + 1) % 3].position ) < 2 * radius || newPoint.getDistance( mainCircs[ (t + 2) % 3].position ) < 2 * radius ){
			mainVel[t] = 2 * Math.PI * Math.random();
			var newPoint = new Point( mainCircs[t].position.x + speed * Math.cos( mainVel[t] ), mainCircs[t].position.y + speed * Math.sin( mainVel[t]) );
		}
		mainCircs[t].position = newPoint;
	}

	var newCirc = solveApol(1,1,1);
	apolCircs[0].position = new Point( newCirc[0],newCirc[1] );
	apolCircs[0].scale( 2 * newCirc[2] / apolCircs[0].bounds.width );

	var newCirc = solveApol(-1,1,1);
	apolCircs[1].position = new Point( newCirc[0],newCirc[1] );
	apolCircs[1].scale( 2 * newCirc[2] / apolCircs[1].bounds.width );

	var newCirc = solveApol(1,-1,1);
	apolCircs[2].position = new Point( newCirc[0],newCirc[1] );
	apolCircs[2].scale( 2 * newCirc[2] / apolCircs[2].bounds.width );

	var newCirc = solveApol(1,1,-1);
	apolCircs[3].position = new Point( newCirc[0],newCirc[1] );
	apolCircs[3].scale( 2 * newCirc[2] / apolCircs[3].bounds.width );

	var newCirc = solveApol(-1,-1,-1);
	apolCircs[4].position = new Point( newCirc[0],newCirc[1] );
	apolCircs[4].scale( 2 * newCirc[2] / apolCircs[4].bounds.width );

	var newCirc = solveApol(1,-1,-1);
	apolCircs[5].position = new Point( newCirc[0],newCirc[1] );
	apolCircs[5].scale( 2 * newCirc[2] / apolCircs[5].bounds.width );

	var newCirc = solveApol(-1,1,-1);
	apolCircs[6].position = new Point( newCirc[0],newCirc[1] );
	apolCircs[6].scale( 2 * newCirc[2] / apolCircs[6].bounds.width );

	var newCirc = solveApol(-1,-1,1);
	apolCircs[7].position = new Point( newCirc[0],newCirc[1] );
	apolCircs[7].scale( 2 * newCirc[2] / apolCircs[7].bounds.width );

	for (t = 0; t<8; t++){ apolCircs[t].fillColor.hue = ( apolCircs[t].fillColor.hue + 0.5 ) % 360; }	

}
