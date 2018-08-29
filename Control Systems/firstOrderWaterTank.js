//var c = 20;
var fewpointless = 50;
var y = 0; // your y start from zero and move up to setpoint c*kH as you write in the equation in draw function
var kH = 2;
//var tauH = 1;
var t = 0;
var dt = 0.1;
var totalTime = 100;
var w = window.innerWidth;
var h = window.innerHeight;
var canvas_width = w * 0.2;//scale canvas width,heigth to 20% of window size
var canvas_height = h * 0.8;

//Tank Parameters
var yTankStart = canvas_height * 0.15;
var yTankEnd = canvas_height * 0.95;
var xTankStart = canvas_width * 0.1;
var xTankEnd = canvas_width * 0.9;
var xHoleStart = canvas_width * 0.48;
var xHoleEnd = canvas_width * 0.52;
var yHoleEnd = canvas_height - 10;
var beakeroffset = canvas_height - yTankEnd;
var kp = 5;
var kd = 1;
var ki = 1;
var kb = 1;
//constants for first order closed loop//
//var kg = kp * kH / (1 + kp * kH);
//var tauG = tauH / (1 + kp * kH);

// The statements in the setup() function 
// execute once when the program begins
var bg = [];
var imageindex = 0;
var noOfimage = 5;
var isRunning = false; //flag to check running or not
var isCompleted = false;
var canvas;

const MaxTimeAllow = 100;
creatEmptyChart();  //make empty chart right from the begining

function setup() {
    bg[0] = loadImage("WaterTap.png");
    bg[1] = loadImage("WaterTap1.png"); // change the image to look like water dripping
    bg[2] = loadImage("WaterTap2.png");
    bg[3] = loadImage("WaterTap.png");
    bg[4] = loadImage("WaterTap1.png");
    bg[5] = loadImage("WaterTap2.png");
    // createCanvas and assign the drawing to div id='canvasWrapper'
    canvas = createCanvas(canvas_width, canvas_height); // use variable here so that every thing can be scale as needed without rewriting this code again 
    canvas.parent('canvasWrapper');
    stroke(0);     // Set line drawing color to black
    strokeWeight(4);
    frameRate(20);
    enablesetting();

}


//r2c function convert real coordinate to canvas coordinate can be use for x,and y. but not necessary for x
//input r=real cordinate, macr=maximum real coordinate,cs=canvas size
function r2c(r, maxr, cs, inverted) {
    //procedure 1. normalise real coordinate by dividing it with maximum realcoordinate need to display
    //2. multiplier it with the canvas size. this will make sure the coordinate will map from 0..1 to 0..canvas sise
    //3. invert it by substracting with canvas size. this is because canvas coordinate are inverted
    var cc;
    if (inverted === true)
        cc = cs - (r / maxr) * cs;
    else
        cc = (r / maxr) * cs;
    return cc;
}


//setting variable to calculate max time needed for time axis on plotly
var maxY = 10, minY = 0, maxT = 10;
//console.log(minY);


// The statements in draw() are executed until the program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first line is executed again. 
var y0 = 0, y1 = 0, dydt = 0, olddydt = 0; // these variables need to be global
function draw() {
    //////////draw tank////////
    background(255); //set background colour to white
    stroke(0); //set lines to black
    strokeWeight(1);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(15);
    text("q in", canvas_width * 0.5, canvas_height * 0.1);
    text("q out", canvas_width * 0.7, canvas_height * 0.98);
    text("volume", canvas_width * 0.5, canvas_height * 0.7);
    textSize(20);
    document.getElementById("TimeUpdate").innerHTML = t.toFixed(2);
    // text("Time=" + t.toFixed(2) + "s", canvas_width / 2, canvas_height / 2);
    const leftmargin = canvas_width * 0.02;

    strokeWeight(3);
    line(xTankStart, yTankEnd, xHoleStart, yTankEnd);  //bottom of tank
    line(xHoleEnd, yTankEnd, xTankEnd, yTankEnd);
    line(xHoleStart, yTankEnd, xHoleStart, yHoleEnd);
    line(xHoleEnd, yTankEnd, xHoleEnd, yHoleEnd);
    line(xTankStart, yTankStart, xTankStart, yTankEnd);  //left of tank
    line(xTankEnd, yTankStart, xTankEnd, yTankEnd);  //right of tank  
    ///load image of tap////
    // image(bg[imageindex], 0, 0, canvas_width * 0.4, canvas_height * 0.2);
    if ((isRunning === false) || (isCompleted === true)) //check logic wether run is clicked or not, else display without water
        image(bg[0], 0, 0, canvas_width * 0.4, canvas_height * 0.2);
    else {
        image(bg[imageindex], 0, 0, canvas_width * 0.4, canvas_height * 0.2);
        imageindex++;
        // colour of small hole
        stroke(0, 255, 255, 100); //aqua
        fill(0, 255, 255, 100);
        rect(xHoleStart, yTankEnd, xHoleEnd - xHoleStart, yHoleEnd - yTankEnd); //rect(x coord, y coord, x width, y width)
    }
    imageindex++;
    if (imageindex >= noOfimage)
        imageindex = 0;
    if (isRunning === false)
        return; //not running if false
    strokeWeight(6);
    var kg = kp * kH / (1 + kp * kH); // variable for kp 
    var tauG = tauH / (1 + kp * kH);
    maxY = 10; // will not rescale here since animate with picture of fit size this value will need to change as needed      
    var canvas_c = r2c(c, maxY, canvas_height, true) - beakeroffset;
    stroke(255, 50, 200, 100);
    line(xTankStart, canvas_c, xTankEnd, canvas_c);

    // old y must be place before new y is calculated
    y0 = y1;
    olddydt = dydt;
    if (document.getElementById("plotOpen").checked === true) {
        y1 = firstOrder(kH * c, tauH, t);
        drawTank(y1, maxY, canvas_height, xTankStart, yTankStart, xTankEnd);
    }
    if (document.getElementById("plotKp").checked === true) {
        y1 = firstOrder(kg * c, tauG, t);
        drawTank(y1, maxY, canvas_height, xTankStart, yTankStart, xTankEnd);
    }
    if (document.getElementById("plotKi").checked === true) {
        var kGi = 1;
        var wGi = Math.sqrt(kH * ki / tauH);
        var zetaGi = 1 / (2 * Math.sqrt(ki * kH * tauH));
        y1 = secondOrder(kGi * c, wGi, zetaGi, t);
        drawTank(y1, maxY, canvas_height, xTankStart, yTankStart, xTankEnd);
    }
    if (document.getElementById("plotKd").checked === true) {
        var k = kd * kH * c;
        var tauD = tauH + kd * kH;
        y1 = invlap1(k, tauD, t);
        drawTank(y1, maxY, canvas_height, xTankStart, yTankStart, xTankEnd);
    }
    if (document.getElementById("plotKpKd").checked === true) {
        y1 = animatePD(kH, tauH, c, kp, t);
    }
    if (document.getElementById("plotKpKi").checked === true) {
        y1 = animatePI(kH, tauH, c, ki, kp, t);
    }
    if (document.getElementById("plotKpKiKd").checked === true) {
        y1 = animatePID(kH, tauH, c, ki, kp, kd, kb, t);
    }
    var leftMargin = canvas_width * 0.15;
    
    
    //Check if steady state is achieved//
    dydt = (y1 - y0) / dt;
    var d2ydt2 = (dydt - olddydt) / dt;
    var err = y1 - c;
    document.getElementById("ErrorUpdate").innerHTML = err.toFixed(2);
    if ((Math.abs(dydt) < 0.005) && (Math.abs(d2ydt2) < 0.005) && (t > 5)) {
        isCompleted = true;
        document.getElementById("StateUpdate").innerHTML = "Steady state achieved";
        enablesetting();
    }
    if ((isCompleted === false) && (t <= MaxTimeAllow))
        t = t + dt;

    if (t >= MaxTimeAllow) {
        isCompleted = true;
        document.getElementById("StateUpdate").innerHTML = "Steady state not achieved within 100s and program is stopped.";
        enablesetting();
    }
    Plotly.extendTraces('chartarea', {x: [[t]], y: [[y1]]}, [0]);
}

//to get scale of graph axis before plotting 
function preAnimation() { // this function collect minY,maxY and maxT info

    var kg = kp * kH / (1 + kp * kH); // variable for kp 
    var tauG = tauH / (1 + kp * kH);
    maxY = 0, minY = 1e10, maxT = 0;
    y1=0;
    dydt=0;
    t = 0;
    do {
        y0 = y1;
        olddydt = dydt;
        if (document.getElementById("plotOpen").checked === true) {
            y1 = firstOrder(kH * c, tauH, t);
        }
        if (document.getElementById("plotKp").checked === true) {
            y1 = firstOrder(kg * c, tauG, t);
        }
        if (document.getElementById("plotKi").checked === true) {
            var kGi = 1;
            var wGi = Math.sqrt(kH * ki / tauH);
            var zetaGi = 1 / (2 * Math.sqrt(ki * kH * tauH));
            y1 = secondOrder(kGi * c, wGi, zetaGi, t);
        }
        if (document.getElementById("plotKd").checked === true) {
            var k = kd * kH * c;
            var tauD = tauH + kd * kH;
            y1 = invlap1(k, tauD, t);
        }
        if (document.getElementById("plotKpKd").checked === true) {
            y1 = animatePD(kH, tauH, c, kp, t);
        }
        if (document.getElementById("plotKpKi").checked === true) {
            y1 = animatePI(kH, tauH, c, ki, kp, t);
        }
        if (document.getElementById("plotKpKiKd").checked === true) {
            y1 = animatePID(kH, tauH, c, ki, kp, kd, kb, t);
        }
        if (minY > y1) {
            minY = y1;
        }
        if (maxY < y1) {
            maxY = y1;
        }
        dydt = (y1 - y0) / dt;
        var d2ydt2 = (dydt - olddydt) / dt;
        var err = y1 - c;
        if ((Math.abs(dydt) < 0.005) && (Math.abs(d2ydt2) < 0.005) && (t > 5)) {
            console.log(" t break out at" + t);
            break;
        }
        t = t + dt; // increment t  if still not yet brek out of the loop
    } while (t < MaxTimeAllow);
    maxT = t*1.05; //5% extra
    maxY = maxY*1.05;
    if (minY > 0)
        minY = 0;   // start from 0
    console.log(" maxt,maxY ", maxT, maxY);
}


function animatePD(kH, tauH, c, kp, t) {
    var alpha = kp / kd;
    var a = (1 + kH * kp) / (tauH + kH * kd);
    var b = 0;
    var k = (kd * kH * c);
    var tauD = tauH + kd * kH;
    var y = invlapKpKd(alpha, a, b, k, tauD, t);
    drawTank(y, maxY, canvas_height, xTankStart, yTankStart, xTankEnd);
    return y;
}

function animatePI(kH, tauH, c, ki, kp, t) {
    if (kp === 0)
        kp = 1e-20; // this is to avoid alpha goto infinity
    var alpha = ki / kp;
    var w = Math.sqrt(ki * kH / tauH);
    var z = (kp * kH + 1) / (2 * Math.sqrt(ki * kH * tauH));
    var mag = c * kp * kH / tauH;
    var y;
    if (z < 1) {
        y = mag * invlap28a(alpha, w, z, t);
    } else {
        var m = ki * kH / tauH;
        var n = (kp * kH + 1) / tauH;
        var rootpart = Math.sqrt(n * n - 4 * m);
        var a2 = (n - rootpart) / 2;
        var b2 = m / a2;
        y = mag * invlap11(a2, b2, alpha, t);
    }
    drawTank(y, maxY, canvas_height, xTankStart, yTankStart, xTankEnd);
    return y;
}

function animatePID(kH, tauH, c, ki, kp, kd, kb, t) {
    if (kd === 0)
        kd = 1e-20; //  this is to avoid mag=0, alpha1,alpha0 goto infinity
    if (kH === 0)
        kH = 1e-20;
    var mag = c * kd / (kb * kd + tauH / kH);
    var alpha0 = ki / kd;
    var alpha1 = kp / kd;
    var w = Math.sqrt(ki * kb / (kb * kd + tauH / kH));
    var z = (kb * kp + 1 / kH) / (2 * w * (kb * kd + tauH / kH));
    var y;
    if (z < 1) {
        y = mag * invlap36a(alpha0, alpha1, z, w, t);
    } else {
        var m = ki * kb / (kb * kd + tauH / kH);
        var n = (kb * kp + 1 / kH) / (kb * kd + tauH / kH);
        var r = Math.sqrt(n * n - 4 * m);
        var a1 = (n + r) / 2;
        var b1 = m / a1;
        y = mag * invlap35(alpha0, alpha1, a1, b1, t);
    }
    drawTank(y, maxY, canvas_height, xTankStart, yTankStart, xTankEnd);
    return y;
}

function drawTank(y, maxY, canvas_height, xTankStart, yTankStart, xTankEnd) {
    stroke(0, 255, 255, 100); //aqua
    fill(0, 255, 255, 100);
    var waterDept = r2c(y, maxY, canvas_height, false);
    var waterHeight = r2c(y, maxY, canvas_height, true) - beakeroffset;//need to offset it higher              
    if (waterHeight > yTankStart) {
        rect(xTankStart, waterHeight, xTankEnd - xTankStart, waterDept);
    } else {
        rect(xTankStart, yTankStart, xTankEnd - xTankStart, waterDept);
    }
}

//when run button is clicked
function doRun() {
    if ((isRunning === false) || (isCompleted === true)) {
        kh = parseFloat(document.getElementById("KhSlider").value);
        tauH = parseFloat(document.getElementById("tauHSlider").value);
        c = parseFloat(document.getElementById("cSlider").value);
        kp = parseFloat(document.getElementById("KpSlider").value);
        ki = parseFloat(document.getElementById("KiSlider").value);
        kd = parseFloat(document.getElementById("KdSlider").value);
        isRunning = true;
        isCompleted = false;
        disableSetting();
        preAnimation();
        t = 0;// reset the time get ready for next run
        creatEmptyChart();
        document.getElementById("StateUpdate").innerHTML = "Running";
    } else {
        window.alert("Still running. Click Stop to stop");
    }
}

//when stop button is clicked
function doStop() {
    isRunning = false;
    enablesetting();
    document.getElementById("StateUpdate").innerHTML = "Stop";
}

//info for plotly
function creatEmptyChart()
{
    data = []; // clear all chart data before start
    var point = {
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: 'Setting (c)'
    };
    data[0] = point;

    var layout = {
        xaxis: {range: [0, maxT]}, //let x auto update instead of fixing the axis because some cases takes longer time while some takes only a while
        yaxis: {range: [minY, maxY]}
    };
    Plotly.react('chartarea', data, layout);
}

//disable all input except stop button when run is clicked
function disableSetting() {
    // document.getElementById("KhSlider").diabled = true;
    document.getElementById("KhSlider").disabled = true;
    //console.log("disableSetting kh " + document.getElementById("KhSlider").disabled); 
    document.getElementById("tauHSlider").disabled = true;
    document.getElementById("plotOpen").disabled = true;
    document.getElementById("plotKp").disabled = true;
    document.getElementById("plotKi").disabled = true;
    document.getElementById("plotKd").disabled = true;
    document.getElementById("plotKpKi").disabled = true;
    document.getElementById("plotKpKd").disabled = true;
    document.getElementById("plotKpKiKd").disabled = true;
    document.getElementById("cSlider").disabled = true;
    document.getElementById("KpSlider").disabled = true;
    document.getElementById("KiSlider").disabled = true;
    document.getElementById("KdSlider").disabled = true;
    document.getElementById("runbutton").disabled = true;
    document.getElementById("stopbutton").disabled = false;
}
function enablesetting() {
    document.getElementById("KhSlider").disabled = false;
    document.getElementById("tauHSlider").disabled = false;
    document.getElementById("plotOpen").disabled = false;
    document.getElementById("plotKp").disabled = false;
    document.getElementById("plotKi").disabled = false;
    document.getElementById("plotKd").disabled = false;
    document.getElementById("plotKpKi").disabled = false;
    document.getElementById("plotKpKd").disabled = false;
    document.getElementById("plotKpKiKd").disabled = false;
    document.getElementById("cSlider").disabled = false;
    document.getElementById("KpSlider").disabled = false;
    document.getElementById("KiSlider").disabled = false;
    document.getElementById("KdSlider").disabled = false;
    document.getElementById("runbutton").disabled = false;
    document.getElementById("stopbutton").disabled = true;
}