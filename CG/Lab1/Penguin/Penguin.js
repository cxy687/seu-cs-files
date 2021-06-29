"use strict";

var gl;

var autoGO = false;
var stop = false;
//horiDirection true为向右，false为向左
var horiDirection = true;
//vertiDirecition true为向上，false为向下
var vertiDirection = true;

var autoJump = false;
var jumpStep = 0.8;

var right = 0.0;
var up = 0.0;
var step = 0.05;
var rightLoc;
var upLoc;

var horiCount = 20;
var vertiCount = 20;

var isMouseMove = 0;


var bodyVertexPositionBuffer;
var bodyVertexColorBuffer;
var fcolor;
var start;
var end;

var points;
var num;
var points_num;

var isWave = false;
var isJump = false;

// var ice = false;
// var eye = false;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // our own code start from here
    points = new Array();
    num = new Array();
    points_num = new Array();

    //头部
    //整个灰色头部
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.65, 0.55, 0.6, 0.45, 0));
    //头部中的白色部分
    //两个椭圆形
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.3, 0.40, 0.45, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.3, 0.80, 0.45, 0));
    //一个长方形
    num.push(points.length / 2);
    points.push(0.2);
    points.push(-0.15);
    points.push(0.2);
    points.push(0);
    points.push(0.4);
    points.push(-0.15);
    points.push(0.4);
    points.push(0);
    points_num.push(4);
    //眼睛
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.08, 0.08, 0.40, 0.47, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.08, 0.08, 0.80, 0.47, 0));
    //嘴巴
    num.push(points.length / 2);
    points.push(0.3);
    points.push(0.07);
    points.push(0.34);
    points.push(0.15);
    points.push(0.26);
    points.push(0.15);
    points_num.push(3);
    //身体
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.7, 0.9, 0.6, -0.7, 0));
    //手
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, 1.50, -0.3, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, -0.30, -0.3, 0));
    //肚子
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.5, 0.65, 0.6, -0.65, 0));
    //jiojio
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.2, 0.08, 0.9, -1.6, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.2, 0.08, 0.3, -1.6, 0));
    //一个小梯形，用来消除重叠处的颜色
    num.push(points.length / 2);
    points.push(0.4);
    points.push(0.1);
    points.push(0.2);
    points.push(0.1);
    points.push(0.5);
    points.push(-0.13);
    points.push(0.1);
    points.push(-0.13);
    points_num.push(4);
    //白色手
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.29, 0.09, 1.50, -0.3, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.29, 0.09, -0.30, -0.3, 0));
    
    //灰手大
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, 1.50, -0.3, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, -0.30, -0.3, 0));
    //16、17

    //jiojio
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.2, 0.08, 0.9, -1.6, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.2, 0.08, 0.3, -1.6, 0));
    //18、19

    // points_num.push(oval(0, 180, 0.08, 0.08, 0.40, 0.49, 0));
    // num.push(points.length / 2);
    // points_num.push(oval(0, 180, 0.08, 0.08, 0.80, 0.49, 0));

    // Load the data into the GPU
    bodyVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bodyVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    fcolor = gl.getUniformLocation(program, "fcolor");
    rightLoc = gl.getUniformLocation(program, "right");
    upLoc = gl.getUniformLocation(program, "up");

    // Initialize event handlers
    document.getElementById("menu").onclick = function( event) {
        console.log(event.target.index)
        switch(event.target.index) {
            case 0:
                autoGO = true;
                autoJump = false;
                stop = false;
                break;
            case 1:
                autoJump = true;
                autoGO = false;
                stop = false;
                break;
            case 2:
                stop = true;
                autoGO = false;
                autoJump = false;
                isWave = false;
                isJump = false;
                break;
            case 3:
                right += step;
                isWave = !isWave
                horiCount = (horiCount+1)%40;
                horiDirection = true;
                break;
            case 4:
                right -= step;
                isWave = !isWave;
                horiCount = (horiCount-1)%40;
                horiDirection = false;
                break;
            case 5:
                up += step;
                isWave = !isWave;
                vertiCount = (vertiCount+1)%40;
                vertiDirection = true;
                break;
            case 6:
                up -= step;
                isWave = !isWave;
                vertiCount = (vertiCount-1)%40;
                vertiDirection = false;
                break;
            // case 7:
            //     eye = !eye;
            //     break;
        }
    };

    window.onkeydown = function( event ) {
        var keycode = event.keyCode;
        
        switch( keycode){
            case 38://向上按键
                up += step;
                isWave = !isWave;
                vertiCount = (vertiCount+1)%40;
                vertiDirection = true;
                break;
            case 40 ://向下按键
                up -= step;
                isWave = !isWave;
                vertiCount = (vertiCount-1)%40;
                vertiDirection = false;
                break;
            case 37 ://向左按键
                right -= step;
                isWave = !isWave;
                horiCount = (horiCount-1)%40;
                horiDirection = false;
                break;
            case 39://向右按键
                right += step;
                isWave = !isWave
                horiCount = (horiCount+1)%40;
                horiDirection = true;
                break;
        }
        if (keycode == 38 && event.ctrlKey)
           {
            up += jumpStep;
            right += step;
            horiCount = (horiCount+1)%40;
            vertiCount = (vertiCount+1)%40;
            horiDirection = true;
            vertiDirection = true;
            isJump = !isJump;
           } 
    };

    canvas.onmousedown = function(event)
    {
        isMouseMove = 1;
        var rect = canvas.getBoundingClientRect();//画布

        var x = event.x - rect.left;
        var y = event.y - rect.top;

        right = x*2 / canvas.width - 1;
        up = 1 - y*2 / canvas.width ;

    }

    canvas.onmouseup = function(event)
    {
        isMouseMove = 0;
    }

    canvas.onmousemove = function(event)
    {
        if(isMouseMove){ 
            var rect = canvas.getBoundingClientRect();//画布
           
            var x = event.x - rect.left;
            var y = event.y - rect.top;

            right = x*2 / canvas.width - 1;
            up = 1 - y*2 / canvas.width;
        }
    }
    render();
};
//画圆

function oval(start_degree, end_degree, radius_x, radius_y, origin_x, origin_y, turn_angle) {
    start = start_degree / 180;
    end = end_degree / 180;
    turn_angle = turn_angle / 180
    var length = 0;
    radius_x = radius_x / 2;
    radius_y = radius_y / 2;
    origin_x = origin_x / 2;
    origin_y = origin_y / 2;


    for (var i = start; i <= end + 0.01; i = i + 0.01) {
        var x_up = origin_x + Math.cos(Math.PI * i) * radius_x;
        var y_up = origin_y + Math.sin(Math.PI * i) * radius_y;
        points.push(Math.cos(Math.PI * turn_angle) * x_up - Math.sin(Math.PI * turn_angle) * y_up);
        points.push(Math.sin(Math.PI * turn_angle) * x_up + Math.cos(Math.PI * turn_angle) * y_up);
        y_up = origin_y - Math.sin(Math.PI * i) * radius_y;
        points.push(Math.cos(Math.PI * turn_angle) * x_up - Math.sin(Math.PI * turn_angle) * y_up);
        points.push(Math.sin(Math.PI * turn_angle) * x_up + Math.cos(Math.PI * turn_angle) * y_up);
        length += 2;
    }
    return length; // 计算一共有多少个点
}
// //眨眼
// function wink() {
//     //眨眼
//     eye = true;
//     num.push(points.length / 2);

//     console.log(points_num.length);

//     points_num.push(oval(0, 180, 0.08, 0.08, 0.40, 0.49, 0));
//     num.push(points.length / 2);
//     points_num.push(oval(0, 180, 0.08, 0.08, 0.80, 0.49, 0));
//     gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
// }
// //回复眨眼前
// function returnwink() {
//     eye = false;
//     for (var i = 0; i < points_num[21] + points_num[20]; i++) {
//         points.pop();
//     }
//     num.pop();
//     num.pop();
//     points_num.pop();
//     points_num.pop();
//     gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
// }

//企鹅晃手
function wave() {
    console.log('进入wave')
    for (var i = 0; i < points_num[14] + points_num[15] + points_num[16] + points_num[17] + points_num[18] + points_num[19]; i++) {
        points.pop();
    }
    
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();

    num.pop();
    num.pop();
    num.pop();
    num.pop();
    num.pop();
    num.pop();

    //灰手小
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.29, 0.09, 1.50, -0.5, 10));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.29, 0.09, -0.30, -0.3, -10));

    //灰手大
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, 1.50, -0.5, 10));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, -0.30, -0.3, -10));
    //16、17

    //jiojio
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.2, 0.08, 0.9, -1.6, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.2, 0.08, 0.3, -1.6, 0));
    //18、19

    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
}

function jumpWave(){
    for (var i = 0; i < points_num[14] + points_num[15] + points_num[16] + points_num[17] + points_num[18] + points_num[19]; i++) {
        points.pop();
    }
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();

    num.pop();
    num.pop();
    num.pop();
    num.pop();
    num.pop();
    num.pop();

    //灰手小
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.29, 0.09, 1.44, -0.5, 10));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.29, 0.09, -0.26, -0.3, -10));

    //灰手大
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, 1.44, -0.5, 10));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, -0.26, -0.3, -10));
    //16、17

    //jiojio
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.08, 0.25, 0.9, -1.76, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.08, 0.25, 0.3, -1.76, 0));
    //18、19

    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
}

//企鹅手回正
function backToNormal() {
    console.log('back')
    for (var i = 0; i < points_num[14] + points_num[15] + points_num[16] + points_num[17] + points_num[18] + points_num[19]; i++) {
        points.pop();
    }
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();
    points_num.pop();

    num.pop();
    num.pop();
    num.pop();
    num.pop();
    num.pop();
    num.pop();

    //灰手小
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.29, 0.09, 1.50, -0.3, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.29, 0.09, -0.30, -0.3, 0));

    //灰手大
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, 1.50, -0.3, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.3, 0.1, -0.30, -0.3, 0));
    //16、17

    //jiojio
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.2, 0.08, 0.9, -1.6, 0));
    num.push(points.length / 2);
    points_num.push(oval(0, 180, 0.2, 0.08, 0.3, -1.6, 0));
    //18、19

    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (autoGO == true && (!stop))
    {
        isWave = !isWave;
        
        if(horiDirection)
        {
            right += step;horiCount++;
            up +=step; vertiCount++;
        }
        else
        {
            right -= step;horiCount++;
            up -= step; vertiCount--;
        }
        
        horiCount = horiCount % 40;
        vertiCount = vertiCount % 40;
        
    }
    if(autoJump && (!stop))
    {
        isJump = !isJump;

        if(vertiDirection)
        {
            up += jumpStep;
            right += step; horiCount++;
        }
        else
        {
            up -= jumpStep;
            right -= step; horiCount--;
        }
    }

    //出画布就重置
    if (right < -1)
        right = 0.99;
    if (right > 1)
        right = -0.99;
    if(up < -1)
        up = 0.99;
    if(up > 1)
        up = -0.99;


    backToNormal();

    if(isWave)
        wave();
    if(isJump)
        jumpWave();



    // if(eye)
    //     wink();
    // else
    //     returnwink();
    

    gl.uniform1f(rightLoc, right);
    gl.uniform1f(upLoc, up);
            
    //灰色头部
    gl.uniform4fv(fcolor, flatten(vec4(0/255, 0/255, 0/255, 1)));
    gl.drawArrays(gl.TRIANGLE_STRIP, num[0], points_num[0]);

    //白色头部
    gl.uniform4fv(fcolor, flatten(vec4(255, 255, 255, 1)));
    gl.drawArrays(gl.TRIANGLE_STRIP, num[1], points_num[1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, num[2], points_num[2]);
    gl.drawArrays(gl.TRIANGLE_STRIP, num[3], points_num[3]);

    //黑色眼睛
    gl.uniform4fv(fcolor, flatten(vec4(0, 0, 0, 1)));
    gl.drawArrays(gl.TRIANGLE_STRIP, num[4], points_num[4]);
    gl.drawArrays(gl.TRIANGLE_STRIP, num[5], points_num[5]);

    //黄色嘴巴
    gl.uniform4fv(fcolor, flatten(vec4(255/255, 204/255, 0/255, 1)));
    gl.drawArrays(gl.TRIANGLE_STRIP, num[6], points_num[6]);
    
    //黑色身体
    gl.uniform4fv(fcolor,flatten(vec4(0, 0, 0, 1)));
    gl.drawArrays(gl.TRIANGLE_STRIP,num[7],points_num[7]);

    //灰色手
    gl.uniform4fv(fcolor, flatten(vec4(0, 0, 0, 0.3)));
    //gl.drawArrays(gl.TRIANGLE_STRIP,num[8],points_num[8]);
    //gl.drawArrays(gl.TRIANGLE_STRIP,num[9],points_num[9]);
    gl.drawArrays(gl.TRIANGLE_STRIP, num[16], points_num[16]);
    gl.drawArrays(gl.TRIANGLE_STRIP, num[17], points_num[17]);
    
    //白色肚子
    gl.uniform4fv(fcolor, flatten(vec4(1, 1, 1, 1)));
    gl.drawArrays(gl.TRIANGLE_STRIP,num[10],points_num[10]);

    //jiojio
    gl.uniform4fv(fcolor, flatten(vec4(247/255, 199/255, 9/255, 1)));
    //gl.drawArrays(gl.TRIANGLE_STRIP,num[11],points_num[11]);
    //gl.drawArrays(gl.TRIANGLE_STRIP,num[12],points_num[12]);
    gl.drawArrays(gl.TRIANGLE_STRIP, num[18], points_num[18]);
    gl.drawArrays(gl.TRIANGLE_STRIP, num[19], points_num[19]);

    //消除叠色
    gl.uniform4fv(fcolor, flatten(vec4(1, 1, 1, 1)));
    gl.drawArrays(gl.TRIANGLE_STRIP,num[13],points_num[13]);

    //手灰色
    gl.uniform4fv(fcolor, flatten(vec4(0, 0, 0, 0.4)));
    gl.drawArrays(gl.TRIANGLE_STRIP,num[14],points_num[14]);
    gl.drawArrays(gl.TRIANGLE_STRIP,num[15],points_num[15]);


    // //眨眼
    // if(eye)
    // {
    //     gl.uniform4fv(fcolor, flatten(vec4(255, 255, 255, 1)));
    //     gl.drawArrays(gl.TRIANGLE_STRIP,num[20],points_num[20]);
    //     gl.drawArrays(gl.TRIANGLE_STRIP,num[21],points_num[21]);
    // }
    

    //设置定时器
    setTimeout(function () { requestAnimFrame( render );}, 150); 

    
}