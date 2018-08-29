var c = 20;
var fewpointless = 50;
var y = 0; // your y start from zero and move up to setpoint c*kH as you write in the equation in draw function
//var tauH = 1;
var t = 0;
var dt = 0.1;
var totalTime = 200;
var w = window.innerWidth;
var h = window.innerHeight;
var canvas_width = w * 0.2;//scale canvas width,heigth to 10% of window size
var canvas_height = h * 0.7;

var lift = {width: canvas_width / 4, level_height: 1, maxLevel: 10, xliftPos: 0, lift_height_canvasunit: 0};

const MaxTimeAllow = 50;
var maxY = 10, minY = 0, maxT = 10;
creatEmptyChart();  //make empty chart right from the begining

//
// The statements in the setup() function 
// execute once when the program begins

var isRunning = false; //flag to check running or not
var isCompleted = true;
function setup() {
    // createCanvas and assign the drawing to div id='canvasWrapper'
    var canvas = createCanvas(canvas_width, canvas_height); // use variable here so that every thing can be scale as needed without rewriting this code again 
    canvas.parent('canvasWrapper');
    stroke(0);     // Set line drawing color to white
    strokeWeight(4);
    frameRate(10);
    //initilized lift parameter to be use 
    lift.xliftPos = canvas_width / 2 - lift.width / 2;// put lift in the middle of canvas
    lift.lift_height_canvasunit = canvas_height / lift.maxLevel;// height of lift in canvas unit
    console.log(lift.lift_height_canvasunit, lift.maxLevel, canvas_height);
    enablesetting();
}
// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
var y0 = 0, y1 = 0, dydt = 0, olddydt = 0; // this variable needs to be global
function draw() {

    //////////draw tank////////
    background(240); //set background colour to light gray
    stroke(0); //set lines to black
    strokeWeight(1);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    document.getElementById("TimeUpdate").innerHTML = t.toFixed(2);
    strokeWeight(3);
    drawliftsection();
    if (isRunning === false)
        return; //not running if false
    strokeWeight(5);
    y0 = y1;
    olddydt = dydt;
    y1 = pid2cal(liftpid, t) + 1;
    var liftlevel = r2c(y1, lift.maxLevel, canvas_height, true);
    rect(lift.xliftPos + 3, liftlevel + 1, lift.width - 6, lift.lift_height_canvasunit - 2, 10, 10, 10, 10);
    people(lift.xliftPos * 1.4, y1 - 1, canvas_height, lift.maxLevel);
    people(lift.xliftPos * 1.2, y1 - 1, canvas_height, lift.maxLevel);
    dydt = (y1 - y0) / dt;
    var d2ydt2 = (dydt - olddydt) / dt;
    stroke(0); //set lines to black
    strokeWeight(1);
    textAlign(LEFT, CENTER);
    fill(0);
    const leftmargin = canvas_width * 0.02;
    var tline = 4;  // variable to identified text line position
    text("Going to level " + c, leftmargin, textSize() * tline);
    tline++;
    var err = y1 - c - 1;
    document.getElementById("ErrorUpdate").innerHTML = err.toFixed(2);
    if ((Math.abs(dydt) < 0.02) && (Math.abs(d2ydt2) < 0.02) && (t > 5) && (t < MaxTimeAllow)) {
        isCompleted = true;
        document.getElementById("StateUpdate").innerHTML = "Steady state achieved";
        enablesetting();
    }
    if ((isCompleted === false) && (t <= MaxTimeAllow))
        t = t + dt;

    if (t >= MaxTimeAllow) {
        isCompleted = true;
        document.getElementById("StateUpdate").innerHTML = "Steady state not achieved within " + MaxTimeAllow + "s and program is stopped.";
        enablesetting();
    }

    Plotly.extendTraces('chartarea', {x: [[t]], y: [[y1 - 1]]}, [0]);
}
function preAnimation() {
    var y1 = 0, y0 = 0;
    var dydt = 0;
    var t = 0;
    maxY = 0, minY = 1e10, maxT = 0;
    do {
        y0 = y1;
        var olddydt = dydt;
        y1 = pid2cal(liftpid, t) + 1;
        dydt = (y1 - y0) / dt;
        var d2ydt2 = (dydt - olddydt) / dt;
        var err = y1 - c - 1;
        if (maxY < y1) {
            maxY = y1;
        }
        if (minY > y1) {
            minY = y1;
        }
        if ((Math.abs(dydt) < 0.02) && (Math.abs(d2ydt2) < 0.02) && (t > 5)) {
            console.log(" t break out at" + t);
            break;
        }
        t = t + dt;
    } while (t < MaxTimeAllow);
    maxT = t * 1.05; //5% extra
    maxY = maxY * 1.05;
    if (minY > 0)
        minY = 0;   // start from 0
    console.log(" maxT,maxY,minY ", maxT, maxY, minY);
}

var liftpid = new Object();
var liftxy = []; // plot data to be add in later
var layout = {//declare chart appearance here
    title: 'Step response of a second order system',
    xaxis: {
        title: 'Time /s',
        showgrid: true,
        zeroline: true
    },
    yaxis: {
        title: 'Output',
        showline: true,
        zeroline: true
    }
};
function doRun() {

    if ((isRunning === false) || (isCompleted === true)) {
        zeta = parseFloat(document.getElementById("zetaSlider").value);
        omega = parseFloat(document.getElementById("omegaSlider").value);
        c = parseFloat(document.getElementById("cSlider").value);
        kp = parseFloat(document.getElementById("KpSlider").value);
        ki = parseFloat(document.getElementById("KiSlider").value);
        kd = parseFloat(document.getElementById("KdSlider").value);
        t = 0;// reset the time get ready for next run
        var dt = 0.1;
        var totalTime = MaxTimeAllow;

        liftxy = [];
        if (document.getElementById("plotKp").checked === true)
        {
            pid2init(liftpid, zeta, omega, c, dt, totalTime, kp, 0.0000001, 0.0000001);
        }
        if (document.getElementById("plotKi").checked === true)
        {
            pid2init(liftpid, zeta, omega, c, dt, totalTime, 0.0000001, ki, 0.0000001);
        }
        if (document.getElementById("plotKd").checked === true)
        {
            pid2init(liftpid, zeta, omega, c, dt, totalTime, 0.0000001, 0.0000001, kd);
        }
        if (document.getElementById("plotKpKd").checked === true)
        {
            pid2init(liftpid, zeta, omega, c, dt, totalTime, kp, 0.0000001, kd);
        }
        if (document.getElementById("plotKpKi").checked === true)
        {
            pid2init(liftpid, zeta, omega, c, dt, totalTime, kp, ki, 0);
        }
        if (document.getElementById("plotKpKiKd").checked === true) {
            pid2init(liftpid, zeta, omega, c, dt, totalTime, kp, ki, kd);
        }
        isRunning = true;
        isCompleted = false;
        disableSetting();
        preAnimation();
        t = 0;
        creatEmptyChart();
        document.getElementById("StateUpdate").innerHTML = "Running";
    } else {
        window.alert("Still running. Click Stop to stop");
    }
}

function doStop() {
    isRunning = false;
    enablesetting();
    document.getElementById("StateUpdate").innerHTML = "Stop";
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
        yaxis: {range: [0, maxY]}
    };
    Plotly.react('chartarea', data, layout);

}

function drawliftsection() {
    stroke(0);
    noFill();
    for (var i = 1; i < lift.maxLevel; i++) {
        var level = r2c(i, lift.maxLevel, canvas_height, true);
        //   rect(lift.xliftPos, level, lift.width, lift.lift_height_canvasunit);
        line(0, level, lift.xliftPos, level);
        line(lift.xliftPos + lift.width, level, canvas_width, level); //bottom of tank
        // console.log("lift rect=", i, xliftStart, level, lift.width, lift.lift_height_canvasunit);
    }
    var maxf = r2c(0, lift.maxLevel, canvas_height, true);
    var minf = r2c(lift.maxLevel, lift.maxLevel, canvas_height, true);
    line(lift.xliftPos, minf, lift.xliftPos, maxf);
    line(lift.xliftPos + lift.width, minf, lift.xliftPos + lift.width, maxf);
    // console.log(lift.xliftPos, minf, lift.xliftPos, maxf);
    people(lift.xliftPos * 0.5, 2, canvas_height, lift.maxLevel);
    people(lift.xliftPos * 0.1, 2, canvas_height, lift.maxLevel);
    people(lift.xliftPos * 0.7, 2, canvas_height, lift.maxLevel);
    people(lift.xliftPos * 0.4, 5, canvas_height, lift.maxLevel);
    people(lift.xliftPos * 2.5, 4, canvas_height, lift.maxLevel);
    people2(lift.xliftPos * 0.85, 7, canvas_height, lift.maxLevel);
    people2(lift.xliftPos * 2, 6, canvas_height, lift.maxLevel);
}

function people(x, real_y, ch, ymax) {
    var y = real_y * ch / ymax;
    var e = 0.2 * ch / ymax;
    var d = 0.5 * e;
    var f = e;
    var r = 0.5 * e;
    var A = {}, B = {}, C = {}, D = {}, E = {}, F = {}, G = {};
    A.x = x - d;
    A.y = y;
    C.x = x + d;
    C.y = y;
    B.x = x;
    B.y = y + e;
    G.x = x;
    G.y = y + e + f;
    E.x = x - d;
    E.y = y + e + f * 2 / 3;
    F.x = x + d;
    F.y = y + e + f * 2 / 3;
    D.x = x + r / 2;
    D.y = y + e + f + r / 2;
    line(A.x, ch - A.y, B.x, ch - B.y);
    line(B.x, ch - B.y, C.x, ch - C.y);
    line(B.x, ch - B.y, G.x, ch - G.y);
    line(E.x, ch - E.y, F.x, ch - F.y);
    ellipse(D.x, ch - D.y, r, r);
}

function people2(x, real_y, ch, ymax) {
    var y = real_y * ch / ymax;
    var e = 0.2 * ch / ymax;
    var d = 0.3 * e;
    var f = e;
    var r = 0.4 * e;
    var A = {}, B = {}, C = {}, D = {}, E = {}, F = {}, G = {};
    A.x = x - d;
    A.y = y;
    C.x = x + d;
    C.y = y;
    B.x = x;
    B.y = y + e;
    G.x = x;
    G.y = y + e + f;
    E.x = x - d;
    E.y = y + e + f * 2 / 3;
    F.x = x + d;
    F.y = y + e + f * 2 / 3;
    D.x = x + r / 2;
    D.y = y + e + f + r / 2;
    line(A.x, ch - A.y, B.x, ch - B.y);
    line(B.x, ch - B.y, C.x, ch - C.y);
    line(B.x, ch - B.y, G.x, ch - G.y);
    line(E.x, ch - E.y, F.x, ch - F.y);
    ellipse(D.x, ch - D.y, r, r);
}
function disableSetting() {
    document.getElementById("plotKp").disabled = true;
    document.getElementById("plotKi").disabled = true;
    document.getElementById("plotKd").disabled = true;
    document.getElementById("plotKpKi").disabled = true;
    document.getElementById("plotKpKd").disabled = true;
    document.getElementById("plotKpKiKd").disabled = true;
    document.getElementById("zetaSlider").disabled = true;
    document.getElementById("omegaSlider").disabled = true;
    document.getElementById("cSlider").disabled = true;
    document.getElementById("KpSlider").disabled = true;
    document.getElementById("KiSlider").disabled = true;
    document.getElementById("KdSlider").disabled = true;
    document.getElementById("KiSlider").disabled = true;
    document.getElementById("runbutton").disabled = true;
    document.getElementById("stopbutton").disabled = false;
    //  console.log("disableSetting");
}
function enablesetting() {
    document.getElementById("plotKp").disabled = false;
    document.getElementById("plotKi").disabled = false;
    document.getElementById("plotKd").disabled = false;
    document.getElementById("plotKpKi").disabled = false;
    document.getElementById("plotKpKd").disabled = false;
    document.getElementById("plotKpKiKd").disabled = false;
    document.getElementById("zetaSlider").disabled = false;
    document.getElementById("omegaSlider").disabled = false;
    document.getElementById("cSlider").disabled = false;
    document.getElementById("KpSlider").disabled = false;
    document.getElementById("KiSlider").disabled = false;
    document.getElementById("KdSlider").disabled = false;
    document.getElementById("KiSlider").disabled = false;
    document.getElementById("runbutton").disabled = false;
    document.getElementById("stopbutton").disabled = true;
    //  console.log("enablesetting");
}