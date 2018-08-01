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


function setup() {
    // Have Canvas replace loading message
    let myCanvas = createCanvas(canvasWidth, canvasHeight);
    let loadMessage = document.getElementById("loadingMessage");
    loadMessage.parentNode.removeChild(loadMessage);
    myCanvas.parent('canvasWrapper');
    let voltageData = {};

    for (currentTemp = -10; currentTemp<10.5; currentTemp += 0.5) {
        voltageData[currentTemp] = {};
        for (soc = 0; soc < 100.1; soc += 0.1) {
            voltageData[currentTemp][soc] = -0.05 * currentTemp + 4.2 - 0.037 * soc;
        }
    }

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

    let voltagePlot = document.getElementById("VoltagePlot");
    let socPlot = [];
    for (var i = 0; i<1001; i++){socPlot.push(i/10);}
    Plotly.plot(voltagePlot, [{x : socPlot, y : voltageData[1][75]}], {
            margin: { t: 0 } } );
    // Plotly.plot(voltagePlot, [{x: [1, 2, 3, 4, 5],
    //     y: [1, 2, 4, 8, 16] }], {
    //     margin: { t: 0 } } );
}

function draw() {
    let SoC = document.getElementById("SoCslider").value;
    let current = document.getElementById("currentSlider").value;
    let voltage = 4.2;
    // let voltage = document.getElementById("voltageSlider").value;
    let newSoC;

    stroke(0);
    strokeWeight(5);
    fill(100);

    drawElectrode(posElec.x,posElec.y,posElec.width,posElec.height,SoC*0.01);
    drawElectrode(negElec.x,negElec.y,negElec.width,negElec.height,1-SoC*0.01);
    drawLoad(current * voltage);

    if (isRunning) {
        newSoC = (SoC - (timeScale * current));
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