
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Global variables

let canvasWidth = 425;
let canvasHeight = 275;

canvasWidth = canvasWidth * window.devicePixelRatio;
canvasHeight = canvasHeight * window.devicePixelRatio;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Top-level p5.js functions
//  setup() sets up the canvas and draws the background
//  draw() runs repeatedly to animate the canvas

function setup() {
    prepareBackground();

    frameRate(fr);

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

    strokeWeight(5);
    stroke(50);
    //TODO: make separator size automatic
    line(canvasWidth*0.5,canvasHeight*0.25 + 5,canvasWidth*0.5,canvasHeight*0.95 - 5);

    p.noFill();
    stroke(0);
    rect(canvasWidth*0.01,canvasHeight*0.25,canvasWidth*0.98,canvasHeight*0.7);
}

function startSecondStage() {
    document.getElementById("explanatoryText").innerHTML = "<p>This production of free electrons, and the loss of " +
        "the positive ions, causes the electrode to have a net positive charge.<\p>" +
        "<p>This positive charge causes an excess of lithium ions to congregate near the electrode surface, forming" +
        "a \"double layer\". Like a capacitor, this separation of charges causes an electrostatic potential" +
        "to emerge.</p>" +
        "<p>However, with only a single electrode, this electrical potential cannot be used as there is no path" +
        "available for the </p>";
}