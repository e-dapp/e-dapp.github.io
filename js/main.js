var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;

//	Camera options
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

camera.position.x = 7.5;
camera.position.y = 15;
camera.position.z = cameraBaseZ;

var time = 0;

scene.fog = new THREE.Fog( 0x7F737F, 500, 1000);

renderer.setClearColor( scene.fog.color );


var pointLight = new THREE.PointLight(0xfff0ff);
pointLight.position.set(20, 30, -20);


var texture = new THREE.TextureLoader().load( './images/title.png' );
var geometry3 = new THREE.PlaneGeometry( 20, 20, 32 );
var material3 = new THREE.MeshBasicMaterial( 
	{ map: texture, transparent: true, opacity: 0.90});
var plane = new THREE.Mesh( geometry3, material3 );
plane.position.y = 22.5;

scene.add( plane );

var textures = [];
var newPlane;

function initTextures () {
	var newTexture0 = new THREE.TextureLoader().load( './images/title.png' )
	textures.push(newTexture0);

	newTexture1 = new THREE.TextureLoader().load( './images/edu1.png' );
	textures.push(newTexture1);

	newTexture2 = new THREE.TextureLoader().load( './images/edu2.png' );
	textures.push(newTexture2);

	newTexture3 = new THREE.TextureLoader().load( './images/exp.png' );
	textures.push(newTexture3);

	newTexture4 = new THREE.TextureLoader().load( './images/skills1.png' );
	textures.push(newTexture4);

	newTexture5 = new THREE.TextureLoader().load( './images/skills2.png' );
	textures.push(newTexture5);


	//	This is an attempt to preload the textures that will be used
	//	to avoid slowdown when textures would be sent to the gpu for
	// 	the first time. 

	// for (i in textures) {
	// 	// console.log(i, textures[i]);
	// 	var newPlaneGeometry = new THREE.PlaneGeometry( 20, 20, 32 );
	// 	var newPlaneMaterial = new THREE.MeshBasicMaterial( 
	// 		{ map: textures[i], transparent: true, opacity: 0.90});
	// 	newPlane = new THREE.Mesh( newPlaneGeometry, newPlaneMaterial );

	// 	newPlane.position.y = 20;
	// 	newPlane.position.z = i + 40;

	// 	scene.add( newPlane );
	// }
}


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


var numCubes = 6;
var gridSize = numCubes * 2;
var stepSize = gridSize / numCubes;

var cubes = [];
var bPositions = [];
var cPositions = [];
var slots = [];
var elevated = [];
var elevation = 5;


function initCubes() {
	for (var k = 0; k < numCubes; k++) {
		var slot = [];
		for (var i = 0; i < numCubes; i++){
			for (var j = 0; j < numCubes; j++) {
				
				var cube = new THREE.Mesh( geometry, material );
				cube.position.x = (stepSize - gridSize) / 2 + i * stepSize;
				cube.position.y = (stepSize - gridSize) / 2 + j * stepSize;
				cube.position.z = (stepSize - gridSize) / 2 + k * stepSize;

				positions = [cube.position.x, cube.position.y, cube.position.z];

				cubes.push( cube );
				scene.add( cube );
				cPositions.push( positions );
				bPositions.push( positions );
				
				tempPos = [positions[0], positions[1] + elevation, positions[2]];

				elevated.push(tempPos);
				slot.push(cube);
			}
		}
		slots.push(slot);
	}
}
 
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

function checkAndElevate(elapsed) {
	for (var j in slots) {
		slotBase = j * numCubes * numCubes;
		for (var i = 0; i < slots[j].length; i++) {
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

var texturePosTargetZ = 0; 

function positionTexture (elapsed) {
	plane.position.z = elevatedZ + stepSize;
}

var cameraPosTargetZ = 0.0;
var interpDur = 1000;

function positionCamera (elapsed) {
	if (mouseLevelChange) {
		cameraPosTargetZ = cameraBaseZ + elevatedZ;
	}

	camera.position.z =  interpolate(
		camera.position.z, cameraPosTargetZ, 
		interpDur, elapsed);
}

var look = new THREE.Vector3(	plane.position.x, 
								plane.position.y, 
								plane.position.z);
var lookTarget = new THREE.Vector3(0, 0, 0);

function updateLook(elapsed) {
	if (mouseLevelChange) {
		lookTarget = plane.position;
	}

	look.x = interpolate(look.x, lookTarget.x, interpDur, elapsed);
	look.y = interpolate(look.y, lookTarget.y, interpDur, elapsed);
	look.z = interpolate(look.z, lookTarget.z, interpDur, elapsed);

}

function orientCamera (elapsed) {
	updateLook(elapsed);
	camera.lookAt(look);
}

var lineZtarget = 0;

function updateLinesZ (elapsed) {
	if (mouseLevelChange) {
		lineZtarget = plane.position.z;
	}

	for (var i = 0; i < lineGeometries.length; i++) {
		for (var j = 0; j < lineGeometries[i].vertices.length; j++) {
			lineGeometries[i].vertices[j].z = interpolate(
				lineGeometries[i].vertices[j].z, lineZtarget, 
				 interpDur , (i + j + 1) * elapsed);
		}
		lineGeometries[i].verticesNeedUpdate = true;
	}
}

function interpolate(from, to, dur, el) {
	// Adds a custom interpolated step from from to to ( haha! )
	// based on duration ( dur ) of total movement and elapsed time
	// since last call ( el )

	var step = (to - from) * el / dur
	from += step;
	return from;
}

function updateLine(){
	lineGeometry.vertices[0] =  new THREE.Vector3(
		plane.position.x,
		plane.position.y,
		plane.position.z
		);
}

function updateLines(elapsed, timeNow) {
	var numGeos = lineGeometries.length;
	var inRange = 0;
	var rangeChanger = 0;
	var tempVertStep = 0;
	for (i = 0; i < numGeos; i++) {
			if (lineGeometries[i].vertices[0].x != tempVertStep && i !=0) {
				inRange++;
				if (inRange > (numPoints - range) + 1 && rangeChanger != range) {
					rangeChanger++;
				}
			}
			for (j = 0; j < lineGeometries[i].vertices.length; j++) {
				if (j == 0) {
					lineGeometries[i].vertices[j] = new THREE.Vector3(
					 	lineGeometries[i].vertices[j].x,
						startY + 2 * Math.cos(timeNow * freq + 2 * Math.PI * (inRange) / numPoints ),
					  	lineGeometries[i].vertices[j].z);
				}
				else {
					lineGeometries[i].vertices[j] = new THREE.Vector3(
					 	lineGeometries[i].vertices[j].x,
						startY + 2 * Math.cos(timeNow * freq + 2 * Math.PI * (inRange + (i % (range - rangeChanger)) + 1) / numPoints ),
					  	lineGeometries[i].vertices[j].z);
				}
			}
		tempVertStep = lineGeometries[i].vertices[0].x;
		lineGeometries[i].verticesNeedUpdate = true;
	}

	for (i = 0; i <= numPoints; i++) {
		pointGeometry.vertices[i] = new THREE.Vector3(
			pointGeometry.vertices[i].x,
			startY + 2 * Math.cos(timeNow * freq + 2 * Math.PI * (i) / numPoints),
			pointGeometry.vertices[i].z
			)
		pointGeometry.verticesNeedUpdate = true;
	}
	updateLinesZ(elapsed);
}

var elevatedZ = 0;
var basePlanePosition = gridSize;

var lineMaterial = new THREE.LineBasicMaterial( { color : 0xf0f0f0 } );


//	Test Line
var lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(new THREE.Vector3(0, basePlanePosition, 0));
lineGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
var line = new THREE.Line(lineGeometry, lineMaterial);

//scene.add(line);

var numPoints = 6;
var range = 3;
var graphLength = 7;
var startX = 2;
var startY = 20;

var lineGeometries = []
var lineGeometriesInit = []
var lineGeometry2;
var pointGeometry;

function initLines() {
	pointGeometry = new THREE.Geometry();
	var pointMaterial = new THREE.PointsMaterial( 
		{ color : 0x0f0f0f , size : 0.1 } );
	for (i = 0; i <= numPoints; i ++) {
		pointGeometry.vertices.push(new THREE.Vector3(
			startX + i * graphLength/numPoints, 
			startY + 3 * Math.sin( 2 * Math.PI * i / numPoints), 
			10
			));
	}

	var points = new THREE.Points(pointGeometry, pointMaterial);
	// scene.add(points);

	var l = pointGeometry.vertices.length;

	for (var i = 0; i < l; i++) {
		for (j = 1; j <= range; j++) {
			if (pointGeometry.vertices[i + j]) {
				lineGeometry2 = new THREE.Geometry();
				lineGeometry2.vertices.push(pointGeometry.vertices[i]);
				lineGeometry2.vertices.push(pointGeometry.vertices[i + j]);
				lineGeometries.push(lineGeometry2);
				var line2 = new THREE.Line(
					lineGeometries[lineGeometries.length - 1], 
					lineMaterial);
				scene.add(line2);
				lineGeometriesInit.push(lineGeometry2);
			}
		}
	}

}

// scene.add(line);

var lastMouseLevel = -1;

function mouseLevelChange () {
	var currentMouseLevel = getMouseLevel(mouse.y);
	if (lastMouseLevel != -1) {
		if (currentMouseLevel == lastMouseLevel) {
			lastMouseLevel = currentMouseLevel;
			return false;
		} else { lastMouseLevel = currentMouseLevel; return true; }
	}	
	lastMouseLevel = currentMouseLevel;
}

function updateTexture () {

	if (mouseLevelChange) {
		var mouseLevel = getMouseLevel(mouse.y);
		if (mouseLevel < numCubes) {
			plane.material.map = textures[5 - mouseLevel];
			plane.material.needsUpdate = true;
		}
	}
}


function animate(elapsed, timeNow) {
	updateLine();
	updateLines(elapsed, timeNow);
	updateTexture();
	positionTexture(elapsed);
	checkAndElevate(elapsed);
	positionCamera(elapsed);
	orientCamera(elapsed);
	// lineGeometry.verticesNeedUpdate = true;
}

var startYbase = startY;

var render = function () {
	requestAnimationFrame( render );

	// if (firstTime) {

	// }

	var timeNow = new Date().getTime();

	if (lastTime != 0) {
		// camera.lookAt(plane.position);
		var elapsed = (timeNow - lastTime);
		for (i in cubes) {

			// var rad = Math.sqrt(
			// 	cPositions[i][0] * cPositions[i][0] + 
			// 	cPositions[i][1] * cPositions[i][1] +
			// 	cPositions[i][2] * cPositions[i][2]
			// 	)

			cubes[i].position.x =  (cPositions[i][0] + amp * 
					cPositions[i][0] * Math.cos( timeNow * freq ));
			cubes[i].position.y =  (cPositions[i][1] + amp * 
					cPositions[i][1] * Math.cos( timeNow * freq ));
			cubes[i].position.z =  (cPositions[i][2] + amp * 
					cPositions[i][2] * Math.cos( timeNow * freq ));
			cubes[i].rotation.x += 0.00015 * elapsed;
			cubes[i].rotation.y += 0.00015 * elapsed;
			cubes[i].rotation.z += 0.00030 * elapsed;
		}


		animate(elapsed, timeNow);
		plane.position.y = basePlanePosition + elevation + 2.5 * Math.cos( timeNow * freq / 2);
		startY = startYbase + elevation + 2.5 * Math.cos( timeNow * freq / 2);
	}

	lastTime = timeNow;
	renderer.render( scene, camera );
};

initCubes();
initTextures();
initLines();
render();