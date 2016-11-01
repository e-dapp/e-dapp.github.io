var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
// var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
var renderer = new THREE.WebGLRenderer( { antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 2, 2, 2 );
var material = new THREE.MeshPhongMaterial();
var cube = new THREE.Mesh( geometry, material );

var mouse = new THREE.Vector2();


var cameraBaseZ = 20;

// scene.add( cube );
camera.position.x = 7.5;
camera.position.y = 30;
camera.position.z = cameraBaseZ;

// camera.position.x = 10;
// camera.position.y = 10;
// camera.position.z = 10;


// camera.rotation.order = "YZX";
// camera.rotation.y = 25 * Math.PI / 180;
// camera.rotation.x = -20 * Math.PI / 180;

// camera.lookAt(new THREE.Vector3(0, 10, 0));

var time = 0;

// skySide = 1000;
// var geometry2 = new THREE.CubeGeometry( skySide, skySide, skySide, 1, 1, 1, null, true );
// var material2 = new THREE.MeshBasicMaterial({ color: 0x7F737F});
// var skyCube = new THREE.Mesh( geometry2, material2 );
// skyCube.material.side = THREE.DoubleSide;
// scene.add ( skyCube );

scene.fog = new THREE.Fog( 0x7F737F, 500, 1000);

renderer.setClearColor( scene.fog.color );


var pointLight = new THREE.PointLight(0xfff0ff);
pointLight.position.set(20, 30, -20);

var texture = new THREE.TextureLoader().load("./name1.png");
var geometry3 = new THREE.PlaneGeometry( 20, 20, 32 );
// var material3 = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var material3 = new THREE.MeshBasicMaterial( 
	{ map: texture, transparent: true, opacity: 0.90});
// material3.transparent = true;
var plane = new THREE.Mesh( geometry3, material3 );
plane.position.y = 22.5;

scene.add( plane );

// camera.position.y = basePlanePosition;



scene.add( camera )

function isNegative(number) {
	// returns -1 for negative number
	// 			1 for positive number
	// 			0 for number = 0

	if (number < 0) {
		return -1;
	}
	else if (number > 0) {
		return 1;
	}
	else {
		return 0;
	}
}


var numCubes = 10;
var gridSize = numCubes * 2;
var stepSize = gridSize / numCubes;

var cubes = [];
var bPositions = [];
var cPositions = [];
var slots = [];
var elevated = [];
var elevation = 5;

for (var k = 0; k < numCubes; k++) {
	var slot = [];
	for (var i = 0; i < numCubes; i++){
		for (var j = 0; j < numCubes; j++) {
			
			var cube = new THREE.Mesh( geometry, material );
			cube.position.x = (stepSize - gridSize) / 2 + i * stepSize;
			cube.position.y = (stepSize - gridSize) / 2 + j * stepSize;
			cube.position.z = (stepSize - gridSize) / 2 + k * stepSize;

			// cube.position.x =  i * stepSize - 3 * gridSize / 4;
			// cube.position.y =  j * stepSize - 3 * gridSize / 4;
			// cube.position.z =  k * stepSize - 3 * gridSize / 4;

			positions = [cube.position.x, cube.position.y, cube.position.z];

			cubes.push(cube);
			scene.add(cube);
			cPositions.push(positions);
			bPositions.push(positions);
			
			tempPos = [positions[0], positions[1] + elevation, positions[2]];

			elevated.push(tempPos);
			slot.push(cube);
		}
	}
	slots.push(slot);
}

// var bPositions = [];
// bPositions = cPositions;

var lineMaterial = new THREE.LineBasicMaterial( { color : 0xf0f0f0 } );

var lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(new THREE.Vector3(-10, 20, 0));
lineGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
lineGeometry.vertices.push(new THREE.Vector3(10, 0, 0));

var line = new THREE.Line(lineGeometry, lineMaterial);

// scene.add(line);

 
scene.add(pointLight);
var lastTime = 0;
var amp = 0.05;
var freq = 0.001;

window.addEventListener( 'resize', onWindowResize, false );
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function getMouseLevel( mY ) {
	var levels = [];
	var current_level = -1;
	var step = 2.0 / numCubes;
	for (i = 0; i <= numCubes; i++) {
		current_level += step;
		levels.push(current_level);
	}

	var found = false;
	var index = 0;
	while ( !found && levels[index] ) {
		if ( mY <= levels[index] ) {
			return index;
		} 
		else { index += 1 }
	}
	
	return 0;
}

function checkAndElevate() {
	for (var j in slots) {
		slotBase = j * numCubes * numCubes;
		for (var i = 0; i < slots[j].length; i++) {
			// console.log(i);
			var index = slotBase + i;
			if (j == getMouseLevel(mouse.y)) {
				cPositions[index] = elevated[index];
				elevatedZ = cPositions[index][2];
			}
			else {
				cPositions[index] = bPositions[index];
			}
		}
	}
}

function positionTexture () {
	plane.position.z = elevatedZ + stepSize;
}

function positionCamera () {
	camera.position.z = cameraBaseZ + elevatedZ * 0.75;
}

var elevatedZ = 0;
basePlanePosition = 2 * gridSize;
camera.lookAt(basePlanePosition);

var something = acabaka;

var render = function () {
	requestAnimationFrame( render );

	var timeNow = new Date().getTime();

	// effFPS = 60/1000;
	if (lastTime != 0) {
		camera.lookAt(plane.position);
		var elapsed = (timeNow - lastTime);
		for (i in cubes) {

			var rad = Math.sqrt(
				cPositions[i][0] * cPositions[i][0] + 
				cPositions[i][1] * cPositions[i][1] +
				cPositions[i][2] * cPositions[i][2]
				)

			cubes[i].position.x =  cPositions[i][0] + amp * cPositions[i][0] * Math.cos( timeNow * freq );
			cubes[i].position.y =  cPositions[i][1] + amp * cPositions[i][1] * Math.cos( timeNow * freq );
			cubes[i].position.z =  cPositions[i][2] + amp * cPositions[i][2] * Math.cos( timeNow * freq );
			cubes[i].rotation.x += 0.00015 * elapsed;
			cubes[i].rotation.y += 0.00015 * elapsed;
			cubes[i].rotation.z += 0.00030 * elapsed;
		}

		plane.position.y = basePlanePosition + elevation + 2.5 * Math.cos( timeNow * freq / 2);
	}

	
	positionTexture();
	positionCamera();
	checkAndElevate();

	lastTime = timeNow;

	// console.log(getMouseLevel(mouse.y));

	camera.lookAt(plane.position);
	renderer.render( scene, camera );
};

render();