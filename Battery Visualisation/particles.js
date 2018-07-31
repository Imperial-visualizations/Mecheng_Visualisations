let canvasWidth = 640;
let canvasHeight = 420;

canvasWidth = canvasWidth * window.devicePixelRatio;
canvasHeight = canvasHeight * window.devicePixelRatio;

let posElec = {x: canvasWidth*0.15, y: canvasHeight*0.4, width: canvasWidth*0.1, height: canvasHeight*0.3};
let negElec = {x: canvasWidth*0.75, y: canvasHeight*0.4, width: canvasWidth*0.1, height: canvasHeight*0.3};

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
    fill(200);
    rect(canvasWidth*0.01,canvasHeight*0.25,canvasWidth*0.98,canvasHeight*0.7);

    strokeWeight(10);
    stroke(50);
    line(canvasWidth*0.5,canvasHeight*0.25,canvasWidth*0.5,canvasHeight*0.95);

    stroke(0);
    strokeWeight(5);
    fill(100);
    rect(posElec.x,posElec.y,posElec.width,posElec.height);
    rect(negElec.x,negElec.y,negElec.width,negElec.height);

    ellipse(canvasWidth*0.5,canvasHeight*0.1,canvasWidth*0.1,canvasWidth*0.1);

    strokeWeight(3);
    line(posElec.x + (posElec.width/2),posElec.y,posElec.x + (posElec.width/2),canvasHeight*0.1);
    line(posElec.x + (posElec.width/2),canvasHeight*0.1,canvasWidth*0.45,canvasHeight*0.1);

    line(canvasWidth*0.55,canvasHeight*0.1,negElec.x + (negElec.width/2),canvasHeight*0.1);
    line(negElec.x + (negElec.width/2),canvasHeight*0.1,negElec.x + (negElec.width/2),negElec.y);

}

function draw() {
    // if (mouseIsPressed) {
    //     fill(0);
    // } else {
    //     fill(255);
    // }
    // ellipse(mouseX, mouseY, 8, 8);

}

// ParticleSystem object to contain either Lithiums or Electrons
// Needed properties:
//      particles (array of Lithiums or Electrons)
//      particleType (either "Electron" or "Lithium", so we can tell the difference - might end up being unnecessary)
// Needed methods:
//      run()
//      addParticle()

function ParticleSystem(type) {
    this.particles = [];
    this.particleType = type;
    if (this.particleType !== ("Electron") && this.particleType !== ("Lithium")) {
        throw "Invalid input - class ParticleSystem requires can only be Lithium or Electron";
    }

    this.run = function(){
        for (var i=0; i<this.particles.length; i++) {
            //Do something to each particle
        }
    };

    this.addParticle = function (position) {
        if (this.particleType === "Electron"){
            this.particles.push(new Electron(position));
        } else if (this.particleType === "Lithium") {
            this.particles.push(new Lithium(position));
        }
    }
}

// Particle object to hold info on a particle
// Needed properties:
//      charge
//      mass
//      position
//      velocity
//      acceleration
// Needed methods:
//      run()

function Particle(x, y) {
    // Electron Object
    this.charge = 0;

    this.position = [x,y];
    this.velocity = 0;
    this.acceleration = 0;
}

Particle.prototype.run = function() {
    //TODO: Make particles do stuff!
};

function Electron(position) {
    Particle.call(this, position[0], position[1]);
    this.charge = -1;
}

function Lithium(position) {
    Particle.call(this, position[0], position[1]);
    this.charge = 0;
    this.isSplit = 0;
}

Lithium.prototype.split = function(Electrons) {
    if (this.isSplit === false) {
        Electrons.add(new Electron(this.position));
        this.isSplit = true;
        this.charge++;
    } else {
        throw "Lithium atom is already ionised - cannot generate another electron!"
    }
};