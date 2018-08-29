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
        showline: true,
        zeroline: true
    }
};
// this function catch illegal input, call proper function then plot the output
function do1stOrder() {
    var kH, tauH, c, dt, totalTime, kp, ki, kd; // declare all variable needed
    var kb = 1;

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
    if (totalTime < 0) { // must be positive time to be meaningful
        totalTime = 0;
        document.getElementById("totalTime").value = totalTime;
    }

    kp = parseFloat(document.getElementById("kp").value);
    ki = parseFloat(document.getElementById("ki").value);
    kd = parseFloat(document.getElementById("kd").value);
    /**** end of input checking block ******** */


    //console.log(kH, tauH, c, dt, totalTime, kp, ki, kd); //for debug
    data = []; // clear all old data if exist
    //********** choose the combination of line to plot here
    if (document.getElementById("plotStep").checked === true)
        firstOrderStep(kH, tauH, c, dt, totalTime, kd); //add step function
    if (document.getElementById("plotOpen").checked === true)
        firstOrderOpenLoop(kH, tauH, c, dt, totalTime); //add open loop
    if (document.getElementById("plotKp").checked === true)
        firstOrderkp(kH, tauH, c, dt, totalTime, kp); //add proportional
    if (document.getElementById("plotKi").checked === true)
        firstOrderki(kH, tauH, c, dt, totalTime, ki); // add integral
    if (document.getElementById("plotKd").checked === true)
        firstOrderkd(kH, tauH, c, dt, totalTime, kd); // add differential
    if (document.getElementById("plotKpKd").checked === true)
        firstOrderKpKd(kH, tauH, dt, totalTime, kd, kp, c); // add proportional and differential
    if (document.getElementById("plotKpKi").checked === true)
        firstOrderKpKi(kH, tauH, c, dt, totalTime, ki, kp); // add proportional and integral
    if (document.getElementById("plotKpKiKd").checked === true)
        firstOrderPID(kH, tauH, c, dt, totalTime, ki, kp, kd, kb); // add proportional and integral
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
        mode: 'lines',
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
        mode: 'lines',
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
    data.push(kponly); // add kponly point to the data array to be plot later
}

function firstOrderki(kH, tauH, c, dt, totalTime, ki) {
    var kionly = {
        x: [],
        y: [],
        mode: 'lines',
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
        mode: 'lines',
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
        mode: 'lines',
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
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: 'Proportional and Integral control'
    };
    var t = 0; // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0
    if (kp === 0)
        kp = 1e-20; // this is to avoid alpha goto infinity
    var alpha = ki / kp;
    var w = Math.sqrt(ki * kH / tauH);
    var z = (kp * kH + 1) / (2 * Math.sqrt(ki * kH * tauH));
    var mag = c * kp * kH / tauH;
    console.log("v3", alpha, w, z, mag);
    if (z < 1) {
        KpKi.name = "PI under damp"
        while (t <= totalTime) {
            KpKi.x[i] = t; //fill in the responce line x,y data
            KpKi.y[i] = mag * invlap28a(alpha, w, z, t);
            t = t + dt;
            i++; // this is same as  i=i+1;           
        }
        data.push(KpKi);
    } else {
        KpKi.name = "PI over damp"
        var m = ki * kH / tauH;
        var n = (kp * kH + 1) / tauH;
        var rootpart = math.sqrt(n * n - 4 * m);
        var a2 = (n - rootpart) / 2;
        var b2 = m / a2;
        //   var a1 = (n + rootpart) / 2;
        //   var b1 = m / a2;        
        while (t <= totalTime) {
            // KpKi.x[i] = t; //fill in the responce line x,y data
            //  KpKi.y[i] = mag * invlap11(a1, b1, alpha, t);
            KpKi.x[i] = t; //fill in the responce line x,y data
            KpKi.y[i] = mag * invlap11(a2, b2, alpha, t);
            t = t + dt;
            i++; // this is same as  i=i+1;
            //console.log(i, t);
        }
        data.push(KpKi);
    }
}

function firstOrderPID(kH, tauH, c, dt, totalTime, ki, kp, kd, kb) {
    var Kpid = {
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: " "
    };
    var t = 0; // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0      
    if (kd === 0)
        kd = 1e-20; //  this is to avoid mag=0, alpha1,alpha0 goto infinity
    if (kH === 0)
        kH = 1e-20;
    var mag = c * kd / (kb * kd + tauH / kH);
    var alpha0 = ki / kd;
    var alpha1 = kp / kd;
    var w = Math.sqrt(ki * kb / (kb * kd + tauH / kH));
    var z = (kb * kp + 1 / kH) / (2 * w * (kb * kd + tauH / kH));
    console.log("w=" + w, "z=" + z);
    if (z < 1) {
        Kpid.name = "PID under damp";
        while (t <= totalTime) {
            Kpid.x[i] = t; //fill in the responce line x,y data
            Kpid.y[i] = mag * invlap36a(alpha0, alpha1, z, w, t);
            t = t + dt;
            i++;
        }
        data.push(Kpid);
    } else {
        Kpid.name = "PID over damp 1 ";
        var m = ki * kb / (kb * kd + tauH / kH);
        var n = (kb * kp + 1 / kH) / (kb * kd + tauH / kH);
        var r = Math.sqrt(n * n - 4 * m);
        var a1 = (n + r) / 2;
        //  var a2=(n-r)/2;
        var b1 = m / a1;
        //  var b2=m/a2;
        console.log("a=" + a1, "b=" + b1);
        while (t <= totalTime) {
            Kpid.x[i] = t; //fill in the responce line x,y data
            Kpid.y[i] = mag * invlap35(alpha0, alpha1, a1, b1, t);
            //    Kpid2.x[i] = t; //fill in the responce line x,y data
            //   Kpid2.y[i] = mag * invlap35(alpha0, alpha1, a2, -b2, t);
            t = t + dt;
            i++; // this is same as  i=i+1;
            //console.log(i, t);
        }
        data.push(Kpid);
    }
}
