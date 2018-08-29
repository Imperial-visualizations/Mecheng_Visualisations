/* 
This file is written to compute values for PID second order systems.
laplaceHelper.js file is written to assist the calculation of this file.
 */

// declare object to pass to plotly here
var data = []; // plot data to be add in later
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
var pid2obj = new Object();
// this function catch illegal input, call proper function then plot the output
function do2ndOrder() {
    var kH, omegan, zeta, c, dt, totalTime, kp, ki, kd; // declare all variable needed
    var kb = 1;
    // polytest();
    /****** this block check input for error condition ******/
  //kH = parseFloat(document.getElementById("kH").value);
    omegan = parseFloat(document.getElementById("omegan").value);
  kH=omegan*omegan;
    if (omegan < 0) {
        omegan = 0.01;
        document.getElementById("omegan").value = omegan;
    }
    zeta = parseFloat(document.getElementById("zeta").value);
    if (zeta < 0) {
        zeta = 0.01;
        document.getElementById("zeta").value = zeta;
    }
    c = parseFloat(document.getElementById("c").value);
    dt = parseFloat(document.getElementById("dt").value);
    if (dt <= 0) {// must be greater than 0 to fulfill the conditions of the while loop
        dt = 0.1;
        document.getElementById("dt").value = dt;
    }
    totalTime = parseFloat(document.getElementById("totalTime").value);
    if (totalTime < 0) { // must be positive time to be meaningfull 
        totalTime = 0;
        document.getElementById("totalTime").value = totalTime;
    }

    kp = parseFloat(document.getElementById("kp").value);
    ki = parseFloat(document.getElementById("ki").value);
    kd = parseFloat(document.getElementById("kd").value);
    /**** end of input checking block ******** */

    console.log(kH, omegan, zeta, c, dt, totalTime, kp, ki, kd); //for debug
    data = []; // clear all old data if exist
    //********** choose the combination of line to plot here
    if (document.getElementById("plotStep").checked === true)
    {
        step2(c, dt, totalTime);
    }
    if (document.getElementById("plotOpen").checked === true)
    {
        open2(omegan * omegan, zeta, omegan, dt, totalTime);
    }
    if (document.getElementById("plotKp").checked === true)
    {
        pid2init(pid2obj, zeta, omegan, c, dt, totalTime, kp, 0.0000001, 0.0000001);
        pid2plot(pid2obj, data, "P Only");
    }
    if (document.getElementById("plotKi").checked === true)
    {
        pid2init(pid2obj, zeta, omegan, c, dt, totalTime, 0.0000001, ki, 0.0000001);
        pid2plot(pid2obj, data, "I Only");
    }
    if (document.getElementById("plotKd").checked === true)
    {
        pid2init(pid2obj, zeta, omegan, c, dt, totalTime, 0.0000001, 0.0000001, kd);
        pid2plot(pid2obj, data, "D Only");
    }
    if (document.getElementById("plotKpKd").checked === true)
    {
        pid2init(pid2obj, zeta, omegan, c, dt, totalTime, kp, 0.0000001, kd);
        pid2plot(pid2obj, data, "PD");
    }
    if (document.getElementById("plotKpKi").checked === true)
    {
        pid2init(pid2obj, zeta, omegan, c, dt, totalTime, kp, ki, 0);
        pid2plot(pid2obj, data, "PI");
    }
    if (document.getElementById("plotKpKiKd").checked === true)
    {
        pid2init(pid2obj, zeta, omegan, c, dt, totalTime, kp, ki, kd);
        pid2plot(pid2obj, data, "PID");
    }
    Plotly.react('chartDiv', data, layout); // plot all the data added in;
}

function step2(c, dt, totalTime) {
    var step = {
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: 'Setting (c)'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i is used as the array index, javascript array start from 0   
    while (t <= totalTime) {
        step.x[i] = t; // fill in the step line x,y data
        step.y[i] = c;
        t = t + dt;
        i++; // this is same as  i=i+1;
        //console.log(i, t);
    }
    data.push(step); // add step point to the data array to be plotted later
}

function open2(kH, zeta, omegan, dt, totalTime) {
    var openloop = {
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: 'open loop'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0 difference matlab   
    while (t <= totalTime) {
        openloop.x[i] = t; // fill in the step line x,y data
        openloop.y[i] = secondOrder(kH, omegan, zeta, t);
        t = t + dt;
        // console.log(i, t, openloop.y[i]);
        i++; // this is same as  i=i+1;
    }
    data.push(openloop); // add openloop point to the data array to be plot later
    return openloop;
}
function ponly2(kH, zeta, omegan, c, dt, totalTime) {
    var kponly = {
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: 'proportional control only'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i is used as the array index,javascript array start from 0

    while (t <= totalTime) {
        kponly.x[i] = t; //fill in the response line x,y data
        kponly.y[i] = 0; //not yet implement
        t = t + dt;
        i++; // this is same as  i=i+1;
        //console.log(i, t);
    }
    data.push(kponly); // add kponly point to the data array to be plot later
}

function pid2init(pid2obj, zeta, omegan, p, dt, totalTime, kp, ki, kd) {
    obj = pid2obj;
    obj.p = p;
    obj.kp = kp;
    obj.ki = ki;
    obj.kd = kd;
    obj.totalTime = totalTime;
    obj.dt = dt;
    obj.wsq = omegan * omegan;
    obj.alpha = ki / kp;
    var d0 = 1;
    var d1 = 2 * zeta * omegan + kd * obj.wsq;
    var d2 = obj.wsq * (1 + kp);
    var d3 = ki * obj.wsq;
    poly = new Polynomial(d0, d1, d2, d3);
    console.log(poly.toString());
    obj.root = poly.getCubicRoots();
    console.log("number of root=" + obj.root.length, "r0=" + obj.root[0], "r1=" + obj.root[1], "r2=" + obj.root[2]);
    if (obj.root.length === 1) {
        obj.a = (d1 + obj.root[0]) / 2;
        obj.bsq = -(d3 / obj.root[0] + obj.a * obj.a);
        obj.b = Math.sqrt(obj.bsq);
        console.log("(x-" + obj.root[0] + ")( (x+" + obj.a + ")^2)+(" + obj.bsq + ")", "b=" + obj.b);
        obj.B1 = 1 / (2 * obj.a + (obj.a * obj.a + obj.bsq) / obj.root[0] + obj.root[0]);
        obj.B2 = -obj.B1;
        obj.B3 = obj.B1 * (obj.a * obj.a + obj.bsq) / obj.root[0];
        console.log("B1,B2,B3", obj.B1, obj.B2, obj.B3);
    } else {//  implement over dampd part
        var s = 0;
        obj.A1 = (kp * s + ki + kd * s * s) * p * obj.wsq / ((s - obj.root[0]) * (s - obj.root[1]) * (s - obj.root[2]));
        s = obj.root[0];
        obj.A2 = (kp * s + ki + kd * s * s) * p * obj.wsq / ((s - 0) * (s - obj.root[1]) * (s - obj.root[2]));
        s = obj.root[1];
        obj.A3 = (kp * s + ki + kd * s * s) * p * obj.wsq / ((s - 0) * (s - obj.root[0]) * (s - obj.root[2]));
        s = obj.root[2];
        obj.A4 = (kp * s + ki + kd * s * s) * p * obj.wsq / ((s - 0) * (s - obj.root[0]) * (s - obj.root[1]));
    }
}

function pid2plot(pid2obj, plotdata, plotname) {
    var obj = pid2obj;
    pid = {
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: plotname
    };
    var t = 0; // time start from 0 s
    var i = 0; //i is used as the array index,javascript array start from 0  
    while (t <= obj.totalTime) {
        pid.x[i] = t; //fill in the response line x,y data
        pid.y[i] = pid2cal(pid2obj, t);
        if (isNaN(pid.y[i]) === true) {
            console.log("encounter nan in pid2cal()");
            break;
        }
        t = t + obj.dt;
        i++;
    }
    plotdata.push(pid);
}

function pid2cal(pid2obj, t) {
   var obj = pid2obj;
    if (obj.root.length === 1) {
        return obj.kd * obj.p * obj.wsq * (obj.B1 * Math.exp(obj.root[0] * t)
                + obj.B2 * invlap26(obj.B3 / obj.B2, obj.a, obj.b, t))
                + obj.kp * obj.p * obj.wsq * invlap31(obj.alpha, obj.a, obj.b, -obj.root[0], t);
    } else {
        return obj.A1 + obj.A2 * Math.exp(obj.root[0] * t)
                + obj.A3 * Math.exp(obj.root[1] * t)
                + obj.A4 * Math.exp(obj.root[2] * t);
    }
}
