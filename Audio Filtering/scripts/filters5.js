var context = new AudioContext();
var currentTime = context.currentTime;
var source = context.createBufferSource();
var globalFilter = context.createBiquadFilter();
globalFilter.type = "lowpass";
var r = document.getElementById("resistorvalue");
var c = document.getElementById("capacitorvalue");
var fc = 1/(2*PI*r*c);
globalFilter.frequency.setTargetAtTime(fc, currentTime, 2);
globalFilter.connect(context.destination);


function playSound(buffer, outputNode, time) {
   source.buffer = context.createBufferSource(buffer);
   source.connect(outputNode);
   source.start(time);
}

var globalFilter;  // one global filter
function getData(filename) {
  source = context.createBufferSource();
  var request = new XMLHttpRequest();

  request.open('GET', filename + ".mp3");

  request.responseType = 'arraybuffer';


  request.onload = function() {
    var audioData = request.response;

    context.decodeAudioData(audioData, function(buffer) {
        myBuffer = audioData;
        source.buffer = myBuffer;
        source.connect(context.destination);
        source.loop = true;
      },

      function(e){"Error with decoding audio data" + e.err});
  }
  request.send();

}


function play() {
  const twofifty = new Audio("250.mp3");
  const onek = new Audio("1000.mp3");
   getData("250");
   getData("1000");
};

function setup(){
  var cnv = createCanvas(900,300);
  cnv.parent('sketch');
  fft = new p5.FFT();
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


                function main(){
                }
