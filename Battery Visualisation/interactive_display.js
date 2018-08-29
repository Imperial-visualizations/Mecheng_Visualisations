"use strict";

//TODO: Update design of diagram (colours, etc.)
//TODO: Add upper voltage cut-off
//TODO: Make separator visually porous
//TODO: Transient effects?
//TODO: Introductory animations
//TODO: Uniform distribution of ions

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Global variables

let canvasWidth = 425;
let canvasHeight = 275;

canvasWidth = canvasWidth * window.devicePixelRatio;
canvasHeight = canvasHeight * window.devicePixelRatio;

let isRunning = false;
const timeScale = 0.015; //Arbitrary scaling on discharge speed
const voltageCutoff = 2.45; //Arbitrary voltage cutoff
const voltageUpperCutoff = 4.90; //Arbitrary higher voltage cutoff

const box = { //dimensions for external battery box
    x: canvasWidth*0.01,
    y: canvasHeight*0.25,
    width: canvasWidth*0.98,
    height: canvasHeight*0.7
};

const negElec = { //Negative electrode dimensions
    x: box.x,
    y: box.y,
    width: 0.2*box.width,
    height: box.height
};

//TODO: Graphical error in this definition; it's not always the right width
const posElec = { //Positive electrode dimensions
    x: box.width + 10 - negElec.width,
    y: box.y,
    width: negElec.width,
    height: negElec.height
};

let wire = { //Current collector dimensions
    negX: negElec.x + 0.5*negElec.width, //x position of negative electrode connection
    negY: negElec.y + 0.1*negElec.height, //y position of electrode connections (same pos and neg)
    posX: posElec.x + 0.5*posElec.width //x position of positive electrode connection
};

wire.height = wire.negY - canvasHeight*0.1; //Distance between neg electrode y and horizontal part y
wire.pathLength = (2*wire.height) + (wire.posX-wire.negX);

let p = new p5(); //TODO: figure out if it's possible to remove this

let currentTemp;
let soc;
let voltageData = {};

let ElectronSystem = new ParticleSystem("Electron");
let LithiumSystem = new ParticleSystem("Lithium");

// TODO: Get extracting the data from a file to work!
// let json = $.getJSON("./exampleData.json");
// var coefficients = eval("(" +json.responseText + ")");
// let coefficients = JSON.parse(json);

const batteryCurve = new Polynomial([4.19330830928672,-0.0127201842105800,-0.000625938577852004,-0.000171517745926117,
    8.08129863878882e-05,-1.19718299176456e-05,9.68038403508205e-07,-4.93818733617536e-08,1.69682312038018e-09,
    -4.05858298573674e-11,6.84730179880260e-13,-8.12370593060948e-15,6.63471674421775e-17,-3.55205161076871e-19,
    1.12236392174576e-21,-1.58668725017118e-24]); //Data fitted from Matlab battery example (15th degree polynomial)
// Highest order term adjusted to give slightly more drop-off at low SoC

const n_Lithium = 80; //Number of Lithium ions in the electrolyte at any given time

let socPlot = [];

for (let i = 0; i<1001; i++){socPlot.push(i/10);}

let voltagePlot = document.getElementById("VoltagePlot");

const fr = 30; //Frame rate in fps

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Top-level p5.js functions
//  setup() sets up the canvas and draws the background
//  draw() runs repeatedly to animate the canvas in response to user input

function setup() {
    prepareBackground();

    frameRate(fr);

    for (currentTemp = -10; currentTemp<10.5; currentTemp += 0.5) {
        voltageData[currentTemp] = [];
        for (soc = 0; soc < 1001; soc++) {
            voltageData[currentTemp][soc] = batteryCurve.eval(100-soc/10) - 0.084 * currentTemp;
            //Delete anything below the arbitrary 2.45V cut-off
            if ((voltageData[currentTemp][soc] < voltageCutoff) ||
                (voltageData[currentTemp][soc] > voltageUpperCutoff)) {
                voltageData[currentTemp][soc] = undefined; //So that the curve under the cutoff isn't shown on the plot
            }
        }
    }

    initialiseParticles();

    Plotly.plot(voltagePlot,
        [
            {
                x : socPlot,
                y : voltageData[1]
            }
        ],
        {
            margin: {
                t: 0,
                l: 50,
                r: 40,
                b: 40
                },
            xAxis: { title: "State of Charge (%)" },
            yAxis: { title: "Voltage (V)" }
        },
        {displayModeBar: false} );
}

function draw() {
    let SoC = document.getElementById("SoCslider").value;
    let current = document.getElementById("currentSlider").value;
    let voltage = voltageData[current][Math.round(SoC*10)];
    if (voltage === undefined) { //undefined if voltage would be under cut-off; for display use 0
        voltage = 0;
    }

    let newSoC;

    drawBackground();

    drawElectrode(negElec.x,negElec.y,negElec.width,negElec.height,SoC*0.01);
    drawElectrode(posElec.x,posElec.y,posElec.width,posElec.height,1-SoC*0.01);

    drawWire();

    if (isRunning) {
        newSoC = (SoC - (timeScale * current));
        if (current !== 0) {
            while (LithiumSystem.particles.length < n_Lithium) {
                generateIon(current);
            }
        }
    } else {
        newSoC = SoC;
    }

    LithiumSystem.run(current,isRunning);
    ElectronSystem.run(current,isRunning);
    drawLoad(current * voltage);
    updateVoltagePlot(current, SoC, socPlot);

    if (voltage === 0) {
        if (isRunning) {
            isRunning = false;
            $("#runButton").val("Run");
            newSoC = parseFloat(SoC);
            while (voltageData[current][Math.round(newSoC*10)] === undefined) {
                if (current > 0) {
                    newSoC += 0.01;
                } else {
                    newSoC -= 0.01;
                }

            }
        }
    }

    //Update all of the slider displays each frame
    //TODO: Is there a better way of doing this?
    $("#voltageDisplay").text(Math.round(voltage*100)/100 +"V");
    if (newSoC < 0){
        document.getElementById("SoCslider").value = 0;
        $("#SoCDisplay").text("0%");
        $("#currentSlider").val("0");
        $("#currentDisplay").text("0C");
    } else if (newSoC > 100) {
        document.getElementById("SoCslider").value = 100;
        $("#SoCDisplay").text("100%");
        $("#currentSlider").val("0");
        $("#currentDisplay").text("0C");
    } else {
        document.getElementById("SoCslider").value = newSoC;
        $("#SoCDisplay").text(Math.round(newSoC*10)/10 + "%");
        $("#currentDisplay").text(current + "C");
        // $("#currentSlider").val(current);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Functions for initial setup (and/or reset) of canvas

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

function drawWire() {
    stroke(0);
    fill(100);
    strokeWeight(3);

    line(wire.negX,wire.negY,wire.negX,wire.negY-wire.height);
    line(wire.negX,wire.negY-wire.height,canvasWidth*0.45,wire.negY-wire.height);

    line(canvasWidth*0.55,wire.negY-wire.height,wire.posX,wire.negY-wire.height);
    line(wire.posX,wire.negY-wire.height,wire.posX,wire.negY);
}

// Places 100 lithium ions randomly in the space between the electrodes
function initialiseParticles() {
    let x_range = [negElec.x + negElec.width, posElec.x];
    let y_range = [negElec.y, negElec.y + negElec.height];

    let lithiumXLocation;
    let lithiumYLocation;
    let electronPositionOnPath;
    let sharedXLocation; //One random coordinate is shared so the electrons are absorbed at the same time as the lithiums
    for (let i = 1; i<=n_Lithium; i++) {
        sharedXLocation = (i/n_Lithium) * (x_range[1]-x_range[0]) + x_range[0]; //uniform distribution

        lithiumXLocation = sharedXLocation;
        lithiumYLocation = map(Math.random(),0,1,y_range[0],y_range[1]);
        LithiumSystem.addParticle(lithiumXLocation,lithiumYLocation);

        electronPositionOnPath = map(sharedXLocation,x_range[0],x_range[1],0,wire.pathLength);
        ElectronSystem.addParticle(null,null,electronPositionOnPath);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Functions for dynamic drawing of visualisation images

//Draws a single electrode based on location and current state of charge (effectively an extended rect() function)
function drawElectrode(x,y,width,height,SoC) {
    let fill = height * SoC;
    let empty = height - fill;

    stroke(0);
    strokeWeight(5);
    p.fill(100);
    strokeWeight(5);
    p.fill(255);
    rect(x,y,width,empty);
    p.fill(100);
    rect(x,y + empty,width,fill);
}

//Changes colour of battery load based on charge/discharge power from the battery
function drawLoad(power) {
    //TODO: Make display more effective - currently almost always dark, would like it to have a cut-off
    p.stroke(100);
    p.strokeWeight(5);
    if (isRunning) {
        if (power > 0) {
            p.fill((power) * 255 / 42, (power) * 255 / 42, 0);
        } else {
            p.fill((-power) * 255 / 42, 0, 0);
        }
    } else {
        p.fill(0);
    }
    p.ellipse(canvasWidth * 0.5, canvasHeight * 0.1, canvasWidth * 0.1, canvasWidth * 0.1);
}

//Updates the Plotly voltage plot
function updateVoltagePlot(current, SoC, socPlot) {
    let plot = {
        x : socPlot,
        y : voltageData[current],
        name: "Voltage"};
    let OCV = {
        x : socPlot,
        y : voltageData[0],
        name: "Open Circuit Voltage",
        marker: {color: "#5f5c5b"},
        line: {dash: "dot"}};
    let operatingPoint = {
        x: [SoC],
        y: [voltageData[current][Math.round(SoC*10)]],
        name: "Current Operating Point",
        type: "scatter",
        mode: "markers",
        showlegend: false,
        marker: {
            size: 10,
            line: {width: 0.5},
            color: "#000000"}};

    let layout = {margin: { t: 0, l: 50, r: 40, b: 40},
        xaxis: {
            dtick: 25,
            autorange: "reversed",
            range: [-10,100],
            title: "State of Charge (%)"},
        yaxis: {
            dtick: 0.5,
            range: [1.9,5.2],
            title: "Voltage (V)"},
        shapes: [
            {
                name: "Voltage Cut-off",
                type: "line",
                x0: 0,
                y0: 2.45,
                x1: 100,
                y1: 2.45,
                line: {
                    color: '#bb0000',
                    width: 2,
                    dash: 'dashdot'
                }
            },
            {
                name: "Voltage Upper Cut-off",
                type: "line",
                x0: 0,
                y0: 4.90,
                x1: 100,
                y1: 4.90,
                line: {
                    color: '#bb0000',
                    width: 2,
                    dash: 'dashdot'
                }
            }
        ]
    };
    Plotly.react(voltagePlot, [plot,OCV, operatingPoint],layout);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Particle functions

//Generates a number of Li+ ions at the negative electrode
function generateIon(current) {
    let xLithium;
    if (current >= 0) {
        xLithium = negElec.x + negElec.width + 5;
        ElectronSystem.addParticle(null,null,5);
    } else {
        xLithium = posElec.x - 5;
        ElectronSystem.addParticle(null,null,wire.pathLength - 5);
    }

    let yLithium = negElec.y;
    let range = negElec.height;
    let location;

    //Put generated ion in a random vertical position on the negative electrode
    location = map(Math.random(),0,1,yLithium,yLithium+range);
    LithiumSystem.addParticle(xLithium,location);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Button callbacks

//Run button toggling
$("#runButton").on('click', function runButtonCallback() {
    if (!isRunning) {
        isRunning = true;
        $("#runButton").val("Stop");
    } else if (isRunning) {
        isRunning = false;
        $("#runButton").val("Run");
    }
});

//Reset button callback
$("#resetButton").on('click', function () {
    isRunning = false;

    ElectronSystem.clear();
    LithiumSystem.clear();
    initialiseParticles();

    $("#SoCslider").val("75");
    $("#SoCDisplay").text("75%");

    $("#currentSlider").val("1");
    $("#currentDisplay").text("1C");

    $("#runButton").val("Run");
});