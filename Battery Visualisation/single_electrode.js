"use strict";
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Global variables

let canvasWidth = 425;
let canvasHeight = 275;

canvasWidth = canvasWidth * window.devicePixelRatio;
canvasHeight = canvasHeight * window.devicePixelRatio;

let fr = 30;

let Electrons = new AnimationParticleSystem("AnimationElectron");
let Lithiums = new AnimationParticleSystem("AnimationLithium");

let isRunning = false;

const box = { //dimensions for external battery box
    x: canvasWidth*0.01,
    y: canvasHeight*0.01,
    width: canvasWidth*0.75,
    height: canvasHeight*0.9
};

const negElec = { //Negative electrode dimensions
    x: box.x,
    y: box.y,
    width: 0.4*box.width,
    height: box.height
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Class Declarations - extending base ones

class AnimationElectron extends AnimationParticle {
    constructor(x,y) {
        super(x,y);
    }

    update() {

    }
}

class AnimationLithium extends Lithium {
    constructor(x,y) {
        super(x,y);
        this.isSplit = 0;
    }

    split(electrons) {

    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Top-level p5.js functions
//  setup() sets up the canvas and draws the background
//  draw() runs repeatedly to animate the canvas

function setup() {
    prepareBackground();

    frameRate(fr);

    for (let i=1; i<6; i++) {
        for (let j=1; j<11; j++) {
            Lithiums.addParticle((i*box.width/7)+box.x,(j*box.height/12)+box.y,null)
            Lithiums.particles[Lithiums.particles.length-1].run();
        }
    }

}

function draw() {


}

//Sets up the canvas
function prepareBackground() {

    let myCanvas = canvasSetup();

    drawBackground();

    return myCanvas;
}

function canvasSetup() {
    // Have Canvas replace loading message
    let myCanvas = createCanvas(canvasWidth, canvasHeight);
    let loadMessage = document.getElementById("loadingMessage");
    loadMessage.parentNode.removeChild(loadMessage);
    myCanvas.parent('canvasWrapper');

    return myCanvas;
}

function drawBackground() {
    // Draw background schematic; visualisation will be with animation above this
    background(255);

    strokeWeight(5);
    stroke(0);
    fill('#00b2ff');
    rect(box.x,box.y,box.width,box.height);

    fill(100);
    rect(negElec.x,negElec.y,negElec.width,negElec.height);

    textAlign(CENTER, CENTER);
    textSize(16);
    fill(255);
    text("Electrode", negElec.x +(0.5*negElec.width), negElec.y + 20);

    text("Electrolyte", (negElec.x + negElec.width) + 0.5*(box.width - negElec.width), negElec.y + 20);
}

function startSecondStage() {
    document.getElementById("explanatoryText").innerHTML = "<p>This production of free electrons, and the loss of " +
        "the positive ions, causes the electrode to have a net positive charge.<\p>" +
        "<p>This positive charge causes an excess of lithium ions to congregate near the electrode surface, forming " +
        "a \"double layer\". Like a capacitor, this separation of charges causes an electrostatic potential " +
        "to emerge.</p>" +
        "<p>However, with only a single electrode, this electrical potential cannot be used as there is no path " +
        "available for the electrons and ions to move and provide a current.</p>";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Button callbacks

//Play/pause button toggling
$("#playButton").on('click', function playButtonCallback() {
    if (!isRunning) {
        isRunning = true;
        $("#playButton").val("Pause");
    } else if (isRunning) {
        isRunning = false;
        $("#playButton").val("Play");
    }
});
