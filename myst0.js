// Animation parameters
var steps = 3000;
var frames = 600;

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

// Helper function
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Initial values
var primes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
var randind = getRandomInt(0,4);
var lastind = randind;
var lastprime = primes[getRandomInt(0,primes.length)];
var alpha = [lastprime,lastprime,lastprime,lastprime];
//var alpha = [ primes[getRandomInt(0,primes.length)], primes[getRandomInt(0,primes.length)], primes[getRandomInt(0,primes.length)], primes[getRandomInt(0,primes.length)]];
var beta = [0,0,0,0];

// Path setup
var path = new Path({strokeWidth: 0.25, strokeColor: 'red'});
path.strokeColor.saturation = 1;
path.strokeColor.brightness = 1;
for(t =0; t<steps; t++){
	path.add( new Point( 0,0 ) );
}

// Text setup
var text = new PointText({
    point: [0, 15],
    fillColor: 0.8,
    fontSize: 15,
    content: alpha
});

// Main loop
function onFrame(event){
	var relcount = (event.count - 1) % frames;

	// New prime at zero
	if( relcount == 0 ){
		while (lastprime == alpha[randind]){
			alpha[randind] = primes[getRandomInt(0,primes.length)];
		}
		text.content = alpha;
	}

	// Update index halfway
	if( relcount == (frames/2) ){
		while(lastind == randind){
			randind = getRandomInt(0,4);
		}
		lastind = randind;
		lastprime = alpha[randind];
	}

	// Calculate betas
	var delta = ( 1 - Math.cos( 2 * Math.PI * (relcount % (frames/2 )) / frames ) ) / 8;
	if( relcount < (frames / 2)  ){
		for(j=0;j<4;j++){
			if(j==randind){ beta[j] = delta; }
			else{ beta[j] = (1/3) - ( delta / 3); }
		}
	}
	
	else{
		for(j=0;j<4;j++){
			if(j==randind){ beta[j] = 0.25 - delta; }
			else{ beta[j] = 0.25 + ( delta / 3 ); }
		}
	}

	// Update path
	path.strokeColor.hue = ( path.strokeColor.hue + 1) % 360;
	for(t =0; t<steps; t++){
		var theta = 2 * Math.PI * t / steps;
		Z = math.add(math.add(math.add(math.multiply(beta[0],math.exp( math.complex(0,alpha[0]*t))), math.multiply(beta[1],math.exp( math.complex(0,alpha[1]*t)))), math.multiply(beta[2],math.exp( math.complex(0,alpha[2]*t)))), math.multiply(beta[3],math.exp( math.complex(0,alpha[3]*t))));
		X = center[0] + ( math.re(Z) * radius )
		Y = center[1] + ( math.im(Z) * radius )
		path.segments[t].point = new Point( X,Y );
	}
	path.smooth();

}
