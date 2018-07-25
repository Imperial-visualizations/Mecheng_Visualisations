// declare object to pass to plotly here
var data = []; // plot data to be add in later
var layout = {//declare chart appearance here
    title: 'Step response of a first order system',
    xaxis: {
        title: 'Time /s',
        showgrid: true,
        zeroline: true
    },
    yaxis: {
        title: 'Output',
        showline: true
    }
};

// this function catch illegal input, call proper function then plot the output
function do1stOrder() {
    var kH, tauH, c, dt, totalTime, kp, ki, kd; // declare all variable needed


    /****** this block check input for error condition ******/
    kH = parseFloat(document.getElementById("kH").value);
    tauH = parseFloat(document.getElementById("tauH").value);
    if (tauH < 0) { // tauH<0 will cause the H(s) exponential function to infinity
        tauH = 0;
        document.getElementById("tauH").value = tauH;
    }

    c = parseFloat(document.getElementById("c").value);
    dt = parseFloat(document.getElementById("dt").value);
    if (dt <= 0) {// must be greater than 0 to fulfill the conditions of the while loop
        dt = 0.1;
        document.getElementById("dt").value = dt;
    }

    totalTime = parseFloat(document.getElementById("totalTime").value);
    if (totalTime < 0) { // must be positive time to be meaningfull 
        totalTime = 0
        document.getElementById("totalTime").value = totalTime;
    }

    kp = parseFloat(document.getElementById("kp").value);
    ki = parseFloat(document.getElementById("ki").value);
    kd = parseFloat(document.getElementById("kd").value);
    /**** end of input checking block ******** */


    console.log(kH, tauH, c, dt, totalTime, kp, ki, kd); //for debug
    data = []; // clear all old data if exist
    //********** choose the combination of line to plot here
    if (document.getElementById("plotStep").checked == true)
        firstOrderStep(kH, tauH, c, dt, totalTime, kd); //add step function
    if (document.getElementById("plotOpen").checked == true)
        firstOrderOpenLoop(kH, tauH, c, dt, totalTime); //add open loop
    if (document.getElementById("plotKp").checked == true)
        firstOrderkp(kH, tauH, c, dt, totalTime, kp); //add proportional
    if (document.getElementById("plotKi").checked == true)
        firstOrderki(kH, tauH, c, dt, totalTime, ki); // add integral
    if (document.getElementById("plotKd").checked == true)
        firstOrderkd(kH, tauH, c, dt, totalTime, kd); // add differential
    if (document.getElementById("plotKpKd").checked == true)
        firstOrderKpKd(kH, tauH, dt, totalTime, kd, kp, c); // add proportional and differential
    if (document.getElementById("plotKpKi").checked == true)
        firstOrderKpKi(kH, tauH, c, dt, totalTime, ki, kp); // add proportional and integral

    Plotly.react('chartDiv', data, layout); // plot all the data added in;
}


function firstOrderStep(kH, tauH, c, dt, totalTime, kd) {
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

function firstOrderOpenLoop(kH, tauH, c, dt, totalTime) {
    var openloop = {
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'open loop'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0 difference matlab   
    while (t <= totalTime) {
        openloop.x[i] = t; // fill in the step line x,y data
        openloop.y[i] = firstOrder(kH * c, tauH, t);
        t = t + dt;
        i++; // this is same as  i=i+1;
        //console.log(i, t);
    }
    data.push(openloop); // add openloop point to the data array to be plot later
}

function firstOrderkp(kH, tauH, c, dt, totalTime, kp) {
    var kponly = {
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'proportional control only'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i is used as the array index,javascript array start from 0
    var kg = kp * kH / (1 + kp * kH);
    var tauG = tauH / (1 + kp * kH);
    while (t <= totalTime) {
        kponly.x[i] = t; //fill in the response line x,y data
        kponly.y[i] = firstOrder(kg * c, tauG, t);
        t = t + dt;
        i++; // this is same as  i=i+1;
        //console.log(i, t);
    }
    data.push(kponly);// add kponly point to the data array to be plot later
}

function firstOrderki(kH, tauH, c, dt, totalTime, ki) {
    var kionly = {
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'integral control only'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i is used as the array index, javascript array start from 0 
    //implement equation 36 page 29
    var kGi = 1;
    var wGi = Math.sqrt(kH * ki / tauH);
    var zetaGi = 1 / (2 * Math.sqrt(ki * kH * tauH));
    while (t <= totalTime) {
        kionly.x[i] = t; //fill in the responce line x,y data
        kionly.y[i] = secondOrder(kGi * c, wGi, zetaGi, t);
        t = t + dt;
        i++; // this is same as  i=i+1;
        //console.log(i, t);
    }
    data.push(kionly);
}

function firstOrderkd(kH, tauH, c, dt, totalTime, kd) {
    var kdonly = {
        // inverse this kd*kH/(1+s(tauH+kd*kH))
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'differential control only'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0 difference matlab
    var k = kd * kH * c;
    var tauD = tauH + kd * kH;
    while (t <= totalTime) {
        kdonly.x[i] = t; //fill in the responce line x,y data
        kdonly.y[i] = invlap1(k, tauD, t);
        t = t + dt;
        i++; // this is same as  i=i+1;
        //console.log(i, t);
    }
    data.push(kdonly);
}

function firstOrderKpKd(kH, tauH, dt, totalTime, kd, kp, c) {
    var KpKd = {
        //inverse KhKd(s+Kp/Kd) / [(t+BKhKd)s^2 +(1+BKhKp)s]
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'proportional and differential control'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0 
    var alpha = kp / kd;
    var a = (1 + kH * kp) / (tauH + kH * kd);
    var b = 0;
    var k = (kd * kH * c);
    var tauD = tauH + kd * kH;
    while (t <= totalTime) {
        KpKd.x[i] = t; //fill in the responce line x,y data
        KpKd.y[i] = invlapKpKd(alpha, a, b, k, tauD, t);
        t = t + dt;
        i++; // this is same as  i=i+1;
        //console.log(i, t);
    }
    data.push(KpKd);
}

function firstOrderKpKi(kH, tauH, c, dt, totalTime, ki, kp) {
    var KpKi = {
        // inverse this [cKhKp/t][(s+Ki/Kp)/s(s^2+(1+BKpKh)s/t+BKhKi/t]
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Proportional and integral control'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0
    var alpha = ki / kp;
    var k = c * kH * kp / tauH;
    var a = (1 + kp * kH) / (2 * tauH);
    var b = Math.sqrt((kH * ki / tauH) - a * a); //error in b as value in sqrt is imaginary
    console.log(alpha, k, a, b); //for debug
    while (t <= totalTime) {
        KpKi.x[i] = t; //fill in the responce line x,y data
        KpKi.y[i] = invlapKpKi(k, t, alpha, a, b);
        t = t + dt;
        i++; // this is same as  i=i+1;
        //console.log(i, t);
    }
    data.push(KpKi);
}