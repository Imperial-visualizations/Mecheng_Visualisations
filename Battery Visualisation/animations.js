let canvasWidth = 425;
let canvasHeight = 275;

let isRunning = false;
let timeScale = 0.015; //Arbitrary scaling on discharge speed

canvasWidth = canvasWidth * window.devicePixelRatio;
canvasHeight = canvasHeight * window.devicePixelRatio;

let posElec = {x: canvasWidth*0.15, y: canvasHeight*0.4, width: canvasWidth*0.1, height: canvasHeight*0.3};
let negElec = {x: canvasWidth*0.75, y: canvasHeight*0.4, width: canvasWidth*0.1, height: canvasHeight*0.3};

let p = new p5();

let currentTemp;
let soc;
let voltageData = {};

let ElectronSystem = new ParticleSystem("Electron");
let LithiumSystem = new ParticleSystem("Lithium");

function setup() {
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

    voltagePlot = document.getElementById("VoltagePlot");
    socPlot = [];
    for (var i = 0; i<1001; i++){socPlot.push(i/10);}

    for (currentTemp = -10; currentTemp<10.5; currentTemp += 0.5) {
        voltageData[currentTemp] = [];
        for (soc = 0; soc < 1001; soc++) {
            voltageData[currentTemp][soc] = -(0.05 * currentTemp) + 4.2 - (0.037 * (1000-soc)/25);
        }
    }
    Plotly.plot(voltagePlot, [{x : socPlot, y : voltageData[1]}], {
        margin: { t: 0, l: 50, r: 40, b: 40},
        xaxis: { title: "State of Charge (%)"},
        yaxis: { title: "Voltage (V)"}} );
}

function draw() {
    let SoC = document.getElementById("SoCslider").value;
    let current = document.getElementById("currentSlider").value;
    let voltage = -(0.05 * current) + 4.2 - (0.037 * (1000-soc)/50);
    if (typeof(voltage) === "undefined"){
        debugger;
    }
    // let voltage = document.getElementById("voltageSlider").value;
    let newSoC;

    stroke(0);
    strokeWeight(5);
    fill(100);

    drawElectrode(posElec.x,posElec.y,posElec.width,posElec.height,SoC*0.01);
    drawElectrode(negElec.x,negElec.y,negElec.width,negElec.height,1-SoC*0.01);
    drawLoad(current * voltage);

    let plot = {
        x : socPlot,
        y : voltageData[current],
        name: "Voltage Characteristic"};
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
        marker: {
            size: 10,
            line: {width: 0.5},
            color: "#000000"}};

    let layout = {margin: { t: 0, l: 50, r: 40, b: 40},
        xaxis: { dtick: 25, autorange: "reversed", range: [-10,100], title: "State of Charge (%)"},
        yaxis: { dtick: 0.5, range: [1.9,5.2], title: "Voltage (V)"}};
    Plotly.react(voltagePlot, [plot,OCV, currentStatus],layout);

    if (isRunning) {
        newSoC = (SoC - (timeScale * current));
        generateIons(current*2);
    } else {
        newSoC = SoC;
    }

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

function drawElectrode(x,y,width,height,SoC) {
    let fill = height * SoC;
    let empty = height - fill;
    strokeWeight(5);
    p.fill(255);
    rect(x,y,width,empty);
    p.fill(100);
    rect(x,y + empty,width,fill);

}
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

function generateIons(number) {
    for (i = 1; i <= number; i++) {
        //Generate an ion each time!
    }
}

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