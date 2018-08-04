///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Global variables

let canvasWidth = 425;
let canvasHeight = 275;

let isRunning = false;
let timeScale = 0.015; //Arbitrary scaling on discharge speed

canvasWidth = canvasWidth * window.devicePixelRatio;
canvasHeight = canvasHeight * window.devicePixelRatio;

let posElec = {x: canvasWidth*0.15, y: canvasHeight*0.4, width: canvasWidth*0.1, height: canvasHeight*0.3};
let negElec = {x: canvasWidth*0.75, y: canvasHeight*0.4, width: canvasWidth*0.1, height: canvasHeight*0.3};

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

let batteryCurve = new Polynomial([4.19330830928672,-0.0127201842105800,-0.000625938577852004,-0.000171517745926117,
    8.08129863878882e-05,-1.19718299176456e-05,9.68038403508205e-07,-4.93818733617536e-08,1.69682312038018e-09,
    -4.05858298573674e-11,6.84730179880260e-13,-8.12370593060948e-15,6.63471674421775e-17,-3.55205161076871e-19,
    1.12236392174576e-21,-1.58668725017118e-24]); //Data fitted from Matlab battery example (15th degree polynomial)
// Highest order term adjusted to give slightly more drop-off at low SoC

let socPlot = [];

for (var i = 0; i<1001; i++){socPlot.push(i/10);}

let voltagePlot = document.getElementById("VoltagePlot");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Top-level p5.js functions
//  setup() sets up the canvas and draws the background
//  draw() runs repeatedly to animate the canvas in response to user input

function setup() {
    let myCanvas = prepareBackground(); //TODO: Consider removing returning myCanvas

    for (currentTemp = -10; currentTemp<10.5; currentTemp += 0.5) {
        voltageData[currentTemp] = [];
        for (soc = 0; soc < 1001; soc++) {
            voltageData[currentTemp][soc] = batteryCurve.eval(100-soc/10) - 0.084 * currentTemp;
            //Delete anything below the arbitrary 2.45V cut-off
            if (voltageData[currentTemp][soc] < 2.45) {
                voltageData[currentTemp][soc] = undefined;
            }
        }
    }

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
    if (voltage === undefined) {
        voltage = 0;
    }
    let newSoC;

    stroke(0);
    strokeWeight(5);
    fill(100);

    drawElectrode(posElec.x,posElec.y,posElec.width,posElec.height,SoC*0.01);
    drawElectrode(negElec.x,negElec.y,negElec.width,negElec.height,1-SoC*0.01);
    drawLoad(current * voltage);

    updateVoltagePlot(current, SoC, socPlot);

    if (isRunning) {
        newSoC = (SoC - (timeScale * current));
        generateIons(current*2);
    } else {
        newSoC = SoC;
    }

    //Update all of the slider displays each frame
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
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Functions for dynamic drawing of visualisation images

//Sets up the canvas
function prepareBackground() {
    // Have Canvas replace loading message
    let myCanvas = createCanvas(canvasWidth, canvasHeight);
    let loadMessage = document.getElementById("loadingMessage");
    loadMessage.parentNode.removeChild(loadMessage);
    myCanvas.parent('canvasWrapper');

    // Draw background schematic; visualisation will be with animation above this
    background(255);

    strokeWeight(5);
    stroke(0);
    fill('#00b2ff');
    rect(canvasWidth*0.01,canvasHeight*0.25,canvasWidth*0.98,canvasHeight*0.7);

    strokeWeight(10);
    stroke(50);
    line(canvasWidth*0.5,canvasHeight*0.25 + 5,canvasWidth*0.5,canvasHeight*0.95 - 5);

    p.noFill();
    stroke(0);
    rect(canvasWidth*0.01,canvasHeight*0.25,canvasWidth*0.98,canvasHeight*0.7);

    stroke(0);
    fill(100);
    strokeWeight(3);
    line(posElec.x + (posElec.width/2),posElec.y,posElec.x + (posElec.width/2),canvasHeight*0.1);
    line(posElec.x + (posElec.width/2),canvasHeight*0.1,canvasWidth*0.45,canvasHeight*0.1);

    line(canvasWidth*0.55,canvasHeight*0.1,negElec.x + (negElec.width/2),canvasHeight*0.1);
    line(negElec.x + (negElec.width/2),canvasHeight*0.1,negElec.x + (negElec.width/2),negElec.y);

    return myCanvas;
}

//Draws a single electrode based on location and current state of charge (effectively an extended rect() function)
function drawElectrode(x,y,width,height,SoC) {
    let fill = height * SoC;
    let empty = height - fill;
    strokeWeight(5);
    p.fill(255);
    rect(x,y,width,empty);
    p.fill(100);
    rect(x,y + empty,width,fill);
}

//Changes colour of battery load based on charge/discharge power from the battery
function drawLoad(power) {
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
    let currentStatus = {
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
            }
        ]
    };
    Plotly.react(voltagePlot, [plot,OCV, currentStatus],layout);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Particle functions

//Generates a number of Li+ ions at the negative electrode
function generateIons(number) {
    let x = negElec.x + negElec.width;
    let y = negElec.y;
    let range = negElec.height;
    let location;

    for (i = 1; i <= number; i++) {
        //Put each generated ion in a random vertical position on the negative electrode
        location = map(Math.random(),0,1,y,y+range);
        LithiumSystem.addParticle(x,y);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Button callbacks

//Run button toggling
$("#runButton").on('click', function () {
    if (!isRunning) {
        isRunning = true;
        $("#runButton").val("Stop");
    } else if (isRunning) {
        //Run reset code
        isRunning = false;
        $("#runButton").val("Run");
    }
    //console.log("Pre Collision KE:" + getLabKE().toString());
});

//Reset button callback
$("#resetButton").on('click', function () {
    isRunning = false;
    $("#SoCslider").val("75");
    $("#SoCDisplay").text("75%");

    $("#currentSlider").val("1");
    $("#currentDisplay").text("1C");

    $("#runButton").val("Run");
});