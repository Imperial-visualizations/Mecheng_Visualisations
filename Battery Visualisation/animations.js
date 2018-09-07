"use strict";
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Global variables

let fr = 30;

let Electrons = new AnimationParticleSystem("Electron");
let StoredLithiums = new AnimationParticleSystem("Lithium");
let FreeLithiums = new AnimationParticleSystem("Lithium");
let Anions = new AnimationParticleSystem("Anion");

let isRunning = false;

let animationStep = 0;
let explanatoryText = document.getElementById("explanatoryText");
let finishingXPosition;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Top-level p5.js functions
//  setup() sets up the canvas and draws the background
//  draw() runs repeatedly to animate the canvas

function setup() {
    prepareBackground();

    frameRate(fr);

    initialiseParticles();

    explanatoryText.innerHTML = documentText[animationStep];

    if (documentText.length === 1) {
        $("#nextButton").val("Next Page");
    }
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
            window.location.href = nextPage;
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
