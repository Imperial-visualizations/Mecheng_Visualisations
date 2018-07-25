/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// this function catch illegal input then only call proper function
function do1stOrder() {
    var kH, tauH, c, dt, totalTime, kp, ki;

    kH = parseFloat(document.getElementById("kH").value);
    tauH = parseFloat(document.getElementById("tauH").value);
    if (tauH < 0) {
        tauH = 0;
        document.getElementById("tauH").value = tauH;
    }
    c = parseFloat(document.getElementById("c").value);
    dt = parseFloat(document.getElementById("dt").value);
    if (dt <= 0) {
        dt = 0.1;
        document.getElementById("dt").value = dt;
    }
    totalTime = parseFloat(document.getElementById("totalTime").value);
    if (totalTime < 0) {
        totalTime = 0
        document.getElementById("totalTime").value = totalTime;
    }
    kp = parseFloat(document.getElementById("kp").value);
    ki = parseFloat(document.getElementById("ki").value);
    console.log(kH, tauH, c, dt, totalTime, kp, ki); //for debug
    //firstOrderHS(kH, tauH, c, dt, totalTime); //call the proper function
    // firstOrderKp(kH, tauH, c, dt, totalTime, kp);
    firstOrderkpki(kH, tauH, c, dt, totalTime, kp, ki);

}

//Open loop 1st order system only no feed back
function firstOrderHS(kH, tauH, c, dt, totalTime) {  //where H(s)-k/(1+Ts) ,U(s)=c/s, dt= time step to plot    

    /*******setup the object to pass to plotly here ******/
    var responce = {//1st chart line the responce line
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'responce'
    };
    var step = {//2nd chart line the step line
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: 'step value'
    };
    var layout = {
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
    var data = [responce, step]; //put xy lines data into data object to be pass to plotly

    /*******begin to calculate data ******/
    var t = 0;  // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0 difference matlab
    while (t <= totalTime) {
        step.x[i] = t; // fill in the step line x,y data
        step.y[i] = c;
        responce.x[i] = t; //fill in the responce line x,y data
        responce.y[i] = kH * c * (1 - Math.exp(-t / tauH));
        t = t + dt;
        i++;// this is same as  i=i+1;
        console.log(i, t);
    }
    Plotly.react('chartDiv', data, layout);
}

//poportional 1st order system kp only 
function firstOrderKp(kH, tauH, c, dt, totalTime, kp) {  //where H(s)-k/(1+Ts) ,U(s)=c/s, dt= time step to plot    

    /*******setup the object to pass to plotly here ******/
    var responce = {//1st chart line the responce line
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'open loop'
    };
    var step = {//2nd chart line the step line
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: 'step value'
    };
    var feedback = {//1st chart line the responce line
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'proportional control'
    };
    var layout = {
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
    var data = [responce, step, feedback]; //put xy lines data into data object to be pass to plotly

    /*******begin to calculate data ******/
    var t = 0;  // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0 difference matlab
    var kg = kp * kH / (1 + kp * kH);
    var tauG = tauH / (1 + kp * kH);
    while (t <= totalTime) {
        step.x[i] = t; // fill in the step line x,y data
        step.y[i] = c;
        responce.x[i] = t; //fill in the responce line x,y data
        responce.y[i] = kH * c * (1 - Math.exp(-t / tauH));
        feedback.x[i] = t; //fill in the responce line x,y data
        feedback.y[i] = kg * c * (1 - Math.exp(-t / tauG));
        t = t + dt;
        i++;// this is same as  i=i+1;
        //console.log(i, t);
    }
    Plotly.react('chartDiv', data, layout);
}
//poportional 1st order system kp only 
function firstOrderkpki(kH, tauH, c, dt, totalTime, kp, ki) {  //where H(s)-k/(1+Ts) ,U(s)=c/s, dt= time step to plot    

    /*******setup the object to pass to plotly here ******/
    var responce = {//1st chart line the responce line
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'open loop'
    };
    var step = {//2nd chart line the step line
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        name: 'Setting (c)'
    };
    var kponly = {//1st chart line the responce line
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'proportional control only'
    };
    var kionly = {//1st chart line the responce line
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'integral control only'
    };
    var layout = {
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
    var data = [responce, step, kponly, kionly]; //put xy lines data into data object to be pass to plotly

    /*******begin to calculate data ******/
    var t = 0;  // time start from 0 s
    var i = 0; //i use as array index,javascript array start from 0 difference matlab
    var kg = kp * kH / (1 + kp * kH);
    var tauG = tauH / (1 + kp * kH);
    //implement equation 36 page 29
    var kGi = 1;
    var wGi = Math.sqrt(kH * ki / tauH);
    var zetaGi = 1 / (2 * Math.sqrt(ki * kH * tauH));

    while (t <= totalTime) {
        step.x[i] = t; // fill in the step line x,y data
        step.y[i] = c;
        responce.x[i] = t; //fill in the responce line x,y data
        //  responce.y[i] = kH * c * (1 - Math.exp(-t / tauH));
        responce.y[i] = firstOrder(kH * c, tauH, t);
        kponly.x[i] = t; //fill in the responce line x,y data
        //kponly.y[i] = kg * c * (1 - Math.exp(-t / tauG));
        kponly.y[i] = firstOrder(kg * c, tauG, t);
        kionly.x[i] = t; //fill in the responce line x,y data
        kionly.y[i] = secondOrder(kGi*c, wGi, zetaGi, t);
        t = t + dt;
        i++;// this is same as  i=i+1;
        //console.log(i, t);
    }
    Plotly.react('chartDiv', data, layout);
}


