"use strict";

var program;
var canvas;
var gl;

var NumVertices  = 36;

var forwardStepLeft = 0.1;
var forwardStepRight = 0.1;
var moveMatrix;
var modelViewMatrix;
var modelViewMatrixLoc;
var objectRotateMatrix;
var cmt;
var cmtLoc;

var step = 0.1;
var enlargement = vec3(0.4,0.4,0.4); //init size

var objectRotateSum = vec3(0,0,0);

var eyePosition = vec3(0.0, 0.0, 0.0);
var at = vec3(0,0,0);
var up = vec3(0,0,-1);

var texture;

var pointsArray = [];
var normalsArray = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var texCoordsArray = [];

function configureTexture(imageFile) {
	texture = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, texture );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imageFile );
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.uniform1i(gl.getUniformLocation(program, "textureMap"), 0);
}

function vecMultInversed(v, u) {
	var result = vec4();
	for ( var i = 0; i < v.length; ++i ) {
		var sum = 0;
		for ( var j = 0; j < u.length; ++j ) {
			sum = sum + u[j] * v[i][j];
		}
		result[i] = sum;
	}
	return result;
}

function calTex() {
	var mode = mult(modelViewMatrix, cmt);
	var temp;
	for (var i = 0; i < pointsArray.length; ++i ){
			temp = vecMultInversed(mode, pointsArray[i]);
		texCoordsArray[i] = vec2(temp[0], temp[1]);
	}
	gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
}

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[a]);
     var normal = cross(t1, t2);
     normal[3] = 0.0;

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function colorCube(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function objectRotate() {
	if (auto_rotate_object_Flag[0] == 1) {
		cmt = mult(cmt, rotateX(incAngel));
		objectRotateSum[0] += incAngel;
	}
	if (auto_rotate_object_Flag[1] == 1) {
		cmt = mult(cmt, rotateY(incAngel));
		objectRotateSum[1] += incAngel;
	}
	if (auto_rotate_object_Flag[2] == 1) {
		cmt = mult(cmt, rotateZ(incAngel));
		objectRotateSum[2] += incAngel;
	}
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    gl.enable(gl.DEPTH_TEST);
    
	colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal");
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vNormal);

	// push point vector
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	cmt = mat4();
	cmt = mult(cmt, scalem(enlargement))
    cmtLoc = gl.getUniformLocation(program, "cmt");
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
	
	//rotate angel control at object asix by slider
	document.getElementById("rotate_object_X").onchange = function(event) {
		objectRotateSum[0] += event.target.value / 10 - 180;
		cmt = mult(cmt, rotateX(event.target.value / 10 - 180));
    };
	
	document.getElementById("rotate_object_Y").onchange = function(event) {
		objectRotateSum[1] += event.target.value / 10 - 180;
		cmt = mult(cmt, rotateY(event.target.value / 10 - 180));
    };
	
	document.getElementById("rotate_object_Z").onchange = function(event) {
		objectRotateSum[2] += event.target.value / 10 - 180;
		cmt = mult(cmt, rotateZ(event.target.value / 10 - 180));
    };
	
	// move at screen axises
	document.getElementById("shiftright").onclick = function(event) {
		moveMatrix = mat4();
		moveMatrix[0][3] += step;
		cmt = mult(moveMatrix, cmt);
    };
	
	document.getElementById("shiftleft").onclick = function(event) {
		moveMatrix = mat4();
		moveMatrix[0][3] -= step;
		cmt = mult(moveMatrix, cmt);
    };
	
	document.getElementById("down").onclick = function(event) {
		moveMatrix = mat4();
		moveMatrix[1][3] -= step;
		cmt = mult(moveMatrix, cmt);
    };
	
	document.getElementById("up").onclick = function(event) {
		moveMatrix = mat4();
		moveMatrix[1][3] += step;
		cmt = mult(moveMatrix, cmt);
    };
    
    var tBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

	var vTexCoord = gl.getAttribLocation( program, "a_texcoord" );
	gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vTexCoord );
	configureTexture(document.getElementById("textureGalaxy"));
    
    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniformMatrix4fv(cmtLoc, false, flatten(cmt));
	
	modelViewMatrix = lookAt(eyePosition, at, up);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	
	 var normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix) );
	gl.uniform3fv( gl.getUniformLocation(program,"eyePosition"),flatten(eyePosition));	
	gl.drawArrays( gl.TRIANGLES, 0,36 );
	calTex();
    setTimeout(
        function () {requestAnimFrame( render );},
    );
}