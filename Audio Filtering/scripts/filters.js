var wave = new p5.Oscillator;
var audioCtx = new AudioContext();
var audio = document.getElementById("audio");
var gainNode = new GainNode(audioCtx);
gainNode.connect(audioCtx.destination);
var filter;
var filterhigh;
var slider;
var slider2;
var cutoff;
var cutoff2;

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
  filter = new p5.LowPass();
  filterhigh = new p5.HighPass();
  fft = new p5.FFT();
  var high = document.getElementById("myRange").value;
  var low = document.getElementById("myRange2").value;

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
  wave.setType('sine');
  wave.amp(0.5);
  wave.freq(i);
  wave.start();
}
function setup2() {
  wave.setType('triangle');
  wave.amp(0.5);
  wave.freq();
  wave.start();
    }

function setup3() {
  wave.setType('square');
  wave.amp(0.5);
  wave.freq(5000);
  wave.start();
}
  function draw() {
        background(255);
        var high = document.getElementById("myRange").value;
        var low = document.getElementById("myRange2").value;
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

    function sliderChange() {

        let slider = document.getElementById("myRange").value;
        document.getElementById("sliderValue").innerHTML = slider;
        }
    // Update the current slider value when slider dragged)

    function sliderChange2() {

        let slider2 = document.getElementById("myRange2").value;
        document.getElementById("sliderValue2").innerHTML = slider2;
        }

        function BodePlot() {
          var select = document.getElementById('selectpassive');
          var cutoff = document.getElementById("myRange").value;
          var cutoffr2 = document.getElementById("myRange2").value;

            var response = {
                omega: [],
                y: [],
                mode: 'lines+markers',
                type: 'scatter',
                name: 'Magnitude/dB'
            };
            var phase = {
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
                    autorange: true

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
                    autorange: true
                },
                yaxis: {
                    title: 'Phase/degrees',
                    showline: true,
                    zeroline: true
                }
            };

            var mid = (cutoff + cutoff2)/2;
            var r,c = cutoff^(-1/2)
            const totalTime = cutoff2*10;
            var t = 0;
            var i = 0;
            while (t < mid) {
                var omega = t;
                var y = t;
                var gain = t;
                var shift = t;
                response.omega[i] = t;
                phase.omega[i] = t
                response.y[i] = 20*log(Math.sqrt(((omega*r*c)*(omega*r*c))/(1 + ((omega*r*c)*(omega*r*c)))));
                phase.y[i] = 90 -atan(omega*r*c);
                console.log(response.omega[i], response.y[i]);
                t = t + 1;
                i = i + 1;
}
            while (mid < totalTime){
              var omega = t;
              var y = t;
              var gain = t;
              var shift = t;
              response.omega[i] = t;
              phase.omega[i] = t
              response.y[i] = 20*log(Math.sqrt(1/(1 + ((omega*r*c)*(omega*r*c)))));
              phase.y[i] = -atan(omega*r*c);
              console.log(response.omega[i], response.y[i]);
              t = t + 1;
              mid = mid + 1;
              i = i + 1;
            }
            var data = [response];
            Plotly.react('chartBode', data, layout);
            data = [phase];
            Plotly.react('chartPhase', data, layoutPhase);
}


                function main(){
                }
