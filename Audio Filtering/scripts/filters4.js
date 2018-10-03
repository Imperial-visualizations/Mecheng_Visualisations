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

// Update the current slider value when drag the slider handle)
    function sliderChange(cutoff) {

        let slider = document.getElementById("myRange").value;
        document.getElementById("sliderValue").innerHTML = slider;
        filter = new p5.HighPass(slider);
        }
    // Update the current slider value when drag the slider handle)

    function sliderChange2(cutoff2) {

        let slider = document.getElementById("myRange2").value;
        document.getElementById("sliderValue2").innerHTML = slider;
        filter = new p5.LowPass(slider);
        }

        function BodePlot() {
          var select = document.getElementById('selectpassive');
          var cutoff = document.getElementById("sliderValue").innerHTML;
          var cutoff2 = document.getElementById("sliderValue2").innerHTML;
            /*******setup the object to pass to plotly here ******/
            var response = {//1st cshart line the responce line
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
             //put xy lines data into data object to be pass to plotlZS
            /*******begin to calculate data ******/
            var mid = (cutoff + cutoff2)/2;
            var r,c = cutoff^(-1/2)
            const totalTime = cutoff2*10;
            var t = 0;  // time start from 0 s
            var i = 0;
            while (t < mid) {
                var omega = t;
                var y = t;  // fill in the step line x,y data
                var gain = t;
                var shift = t;
                response.omega[i] = t; //fill in the responce line x,y data
                phase.omega[i] = t
                gain[i] = Math.sqrt(((omega*r*c)*(omega*r*c))/(1 + ((omega*r*c)*(omega*r*c))));
                response.y[i] = 20*log(gain);
                phase.y[i] = 90 -atan(omega*r*c);
                t = t + 100;
                i = i + 100;
}
            while (mid < totalTime){
              var omega = t;
              var y = t;  // fill in the step line x,y data
              var gain = t;
              var shift = t;
              response.omega[i] = t; //fill in the responce line x,y data
              phase.omega[i] = t
              gain[i] = Math.sqrt(1/(1 + ((omega*r*c)*(omega*r*c))));
              response.y[i] = 20*log(gain);
              phase.y[i] = -atan(omega*r*c);
              t = t + 100;
              mid = mid + 100;
              i = i + 100;
            }
            var data = [response];
            Plotly.react('chartBode', data, layout);
            data = [phase];
            Plotly.react('chartPhase', data, layoutPhase);
}


                function main(){
                }
