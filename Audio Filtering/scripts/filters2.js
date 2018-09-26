var wave = new p5.Oscillator;
var audioCtx = new AudioContext();
var audio = document.getElementById("audio");
var gainNode = new GainNode(audioCtx);
gainNode.connect(audioCtx.destination);

var i;
var a = 200;
const a1 = 200;
var b = 5000;
const b1 = 5000;
var c = 10000;
const c1 = 10000;

function setup(){
  var cnv = createCanvas(900,300);
  cnv.parent('sketch');
  fft = new p5.FFT();
}

function mute() {
    if (window.mute) {
    window.mute = false;
}
else {
        window.mute = true;
    }
}

function waveoff(){
    wave.stop();

}
function setup1(i) {
  var wave;
  wave = new p5.Oscillator;
  wave.setType('sine');
  wave.amp(0.5);
  wave.freq(i);
  wave.start();
}
function setup2() {
      for (i = 100; i = 200; 100) {
        var wave;
        wave = new p5.Oscillator;
        wave.setType('triangle');
        wave.amp(0.5);
        wave.freq(i);
        wave.start();
    }
}

function setup3() {
  var wave;
  wave = new p5.Oscillator;
  wave.setType('square');
  wave.amp(0.5);
  wave.freq();
  wave.start();
}

function draw() {
        background(255);
        var spectrum = fft.analyze();
        noStroke();
        fill(255, 0, 0); // spectrum is red
        for (var i = 0; i < spectrum.length; i++) {
            var x = map(i, 0, spectrum.length, 0, width);
            var h = -height + map(spectrum[i], 0, 255, height, 0);
            rect(x, height, width / spectrum.length, h)
        }

        var waveform = fft.waveform();
        noFill();
        beginShape();
        stroke(0, 0, 255); // waveform is blue
        strokeWeight(2);
        for (var i = 0; i < waveform.length; i++) {
            var x = map(i, 0, waveform.length, 0, width);
            var y = map(waveform[i], -1, 1, 0, height);
            vertex(x, y);
        }
        endShape();

}

    function spoiler() {
        var text = this.hasClass("expanded") ? "Show" : "Hide";
        $(this).html(text+$(this).attr("data-graph-name"));
        $($(this).attr("for")).slideToggle(200);
        $($(this).attr("for")).toggleClass("expanded");
    }

    function changeimage() {
      var select = document.getElementById('selectpassive');
      if (select.value == "Low Pass") {
       document.getElementById('diagram').src = "passl.png"
      }
      else if (select.value == "High Pass") {
       document.getElementById('diagram').src = "passh.png"
      }
    }
    var form = document.getElementById('formIdentifier');
var resval = document.getElementById("resistorvalue");
var capval = document.getElementById('capacitorvalue');

document.getElementById('text1').style.display= "none";
document.getElementById('text2').style.display= "none";


showform = function () {
  var select = document.getElementById('selectpassive');
  if (select.value == 'none'){
  document.getElementById('text1').style.display= "none";
  document.getElementById('text2').style.display= "none";
}
  else {
  document.getElementById('text1').style.display= "";
  document.getElementById('text2').style.display= "";
}}

function BodePlot() {
  var r = parseFloat(document.getElementById("resistorvalue").value);
  var c = parseFloat(document.getElementById("capacitorvalue").value);
  var select = document.getElementById('selectpassive');
    /*******setup the object to pass to plotly here ******/
    var response = {//1st chart line the responce line
        omega: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Magnitude/dB'
    };
    var phase = {//1st chart line the responce line
        omega: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Phase/degrees'
    };
    var layout = {
        title: 'Bode plot of passive filter',
        xaxis: {
            title: 'Frequency/ω',
            showgrid: true,
            autorange: true,
            type: "log"
        },
        yaxis: {
            title: 'Magnitude/dB',
            showline: true,
            zeroline: true
        }
    };
    var layoutPhase = {
        title: 'Phase plot of passive filter',
        xaxis: {
            title: 'Frequency/ω',
            showgrid: true,
            autorange: true,
            type: "log"
        },
        yaxis: {
            title: 'Phase/degrees',
            showline: true,
            zeroline: true
        }
    };
     //put xy lines data into data object to be pass to plotlZS
    /*******begin to calculate data ******/
    var cutoff = 1/r*c;
    const totalTime = cutoff*1000;
    var t = 0;  // time start from 0 s
    var i = 0;
    while (t < totalTime) {
        var omega = t;
        var y = t;  // fill in the step line x,y data
        var gain = t;
        var shift = t;
        response.omega[i] = t; //fill in the responce line x,y data
        phase.omega[i] = t
        if (select.value == "Low Pass") {
          response.y[i] = 20*log(Math.sqrt(1/(1 + ((omega*r*c)^2))));
          phase.y[i] = ((atan(omega*r*c))*(180 / Math.PI));
          filter = new p5.LowPass(cutoff);
        }
        else if (select.value == "High Pass") {
          response.y[i] = 20*log(Math.sqrt(((omega*r*c)^2/(1 + ((omega*r*c)^2)))));
          phase.y[i] = ((atan(1/(omega*r*c)))*(180 / Math.PI));
          filter = new p5.HighPass(cutoff);
        }

        t = t + 10;
        i = i + 10;
    }
    var data = [response];
    Plotly.react('chartBode', data, layout);
    data = [phase];
    Plotly.react('chartPhase', data, layoutPhase);
}


function main(){
}
