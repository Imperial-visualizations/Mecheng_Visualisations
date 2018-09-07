"use strict";
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Global variables

let canvasWidth = 425;
let canvasHeight = 275;

canvasWidth = canvasWidth * window.devicePixelRatio;
canvasHeight = canvasHeight * window.devicePixelRatio;

let fr = 30;

let Electrons = new AnimationParticleSystem("Electron");
let StoredLithiums = new AnimationParticleSystem("Lithium");
let FreeLithiums = new AnimationParticleSystem("Lithium");

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

let animationStep = 0;
let explanatoryText = document.getElementById("explanatoryText");
let finishingXPosition;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Top-level p5.js functions
//  setup() sets up the canvas and draws the background
//  draw() runs repeatedly to animate the canvas

//TODO: Consider re-writing all these functions to work for different pages; should be able to send the needed functions
function setup() {
    prepareBackground();

    frameRate(fr);

    initialiseParticles();

    explanatoryText.innerHTML = documentText[animationStep];

}

function draw() {
    //Need a different animation depending on the step...
    if (isRunning){
        runAnimation(animationStep);

        drawBackground();
        StoredLithiums.run();
        FreeLithiums.run();
        Electrons.run();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

function initialiseParticles() {
    for (let i=1; i<6; i++) {
        for (let j=1; j<11; j++) {
            StoredLithiums.addParticle((i*negElec.width/6)+box.x,(j*box.height/11)+box.y + 10,null);
            StoredLithiums.particles[StoredLithiums.particles.length-1].run();
        }
    }
}

function sleep(milliseconds) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Button callbacks

//Play/pause button toggling
$("#nextButton").on('click', function nextButtonCallback() {
    if (!isRunning) {
        isRunning = true;
        animationStep++;

        if (documentText[animationStep] !== undefined) {
            explanatoryText.innerHTML = documentText[animationStep];
            if (documentText[animationStep+1] === undefined) {
                $("#nextButton").val("Next Page");
            }
        } else {
            //TODO: Make next page
            window.location.href = "positive_electrode.html";
        }
        setupAnimation(animationStep);
    }
});

$("#resetButton").on('click', function resetButtonCallback() {
    isRunning = false;
    FreeLithiums.clear();
    Electrons.clear();
    StoredLithiums.clear();
    drawBackground();
    initialiseParticles();
    animationStep = 0;
    explanatoryText.innerHTML = documentText[animationStep];
    $("#nextButton").val("Next");
});
