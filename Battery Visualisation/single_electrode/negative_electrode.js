let canvasWidth = 425;
let canvasHeight = 275;

canvasWidth = canvasWidth * window.devicePixelRatio;
canvasHeight = canvasHeight * window.devicePixelRatio;

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

const documentText = [

    "<p>The diagram to the left represents a single negative electrode surrounded by an electrolyte. The electrode " +
    "contains a number of lithium atoms which are contained inside (or \"intercalated\" into) the structure of the " +
    "electrode material. At this stage, the electrode is in a fully-lithiated state; all the available spaces are " +
    "filled by Li atoms. ",

    "<p>When the negative electrode is immersed in an electrolyte, it becomes energetically favourable for " +
    "the lithium in the electrode material to de-intercalate and enter solution in the " +
    "electrolyte, releasing an electron which is released into the current collector.</p>",

    "<p>This production of free electrons, and the loss of " +
    "the positive ions, causes the electrode to have a net positive charge.<\p>" +
    "<p>This positive charge causes an excess of lithium ions to congregate near the electrode surface, forming " +
    "a \"double layer\". Like a capacitor, this separation of charges causes an electrostatic potential " +
    "to emerge.</p>" +
    "<p>However, with only a single electrode, this electrical potential cannot be used as there is no path " +
    "available for the electrons and ions to move and provide a current.</p>",

    "<p>The loss of lithium atoms into solution creates a concentration gradient inside the electrode; in the current " +
    "state the electrochemical reaction cannot take place as there is no lithium at the surface. The concentration " +
    "gradient causes the lithium atoms to rearrange and diffuse into a more evenly-distributed state. <p/>" +
    "<p>This diffusion is very slow compared to the reaction rates possible with electrochemistry, which means " +
    "that the maximum steady-state current draw achievable is dominated by the availability of lithium at the " +
    "electrode surface. </p>"];

const nextPage = "positive_electrode.html";
let lithiumNumberX = 7;
let lithiumNumberY = 11; //TODO: These numbers are interpreted wrong
let finishingXPosition;

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

function runAnimation(step) {
    switch (step) {
        case 1:
            if (FreeLithiums.particles[FreeLithiums.particles.length - 1].position.x < finishingXPosition) {
                for (let i = 0; i < FreeLithiums.particles.length; i++) {
                    FreeLithiums.particles[i].position.x += 1;
                }
            } else {
                isRunning = false;
            }
            break;

        case 2:
            if (Electrons.particles[0].position.x < negElec.x + negElec.width - Electrons.particles[0].size) {
                for (let i = 0; i < Electrons.particles.length; i++) {
                    Electrons.particles[i].position.x += 1
                }
            } else {
                isRunning = false;
            }
            break;

        case 3:
            if (StoredLithiums.particles[StoredLithiums.particles.length-1].position.x < finishingXPosition) {
                for (let i=0; i<lithiumNumberX; i++) {
                    for (let j=0; j<lithiumNumberY; j++) {
                        try {
                            StoredLithiums.particles[i * lithiumNumberY + j].position.x += diffusionXDelta[i] / 125;
                        } catch {
                            debugger;
                        }
                    }
                }
            } else {
                isRunning = false
            }
            break;

        default:
            isRunning = false;
            break;
    }
}


function initialiseParticles() {
    for (let i=1; i<lithiumNumberX+1; i++) {
        for (let j=1; j<lithiumNumberY+1; j++) {
            StoredLithiums.addParticle((i*negElec.width/(lithiumNumberX+1))+box.x,
                (j*box.height/(lithiumNumberY+1))+box.y + 10,null);
            StoredLithiums.particles[StoredLithiums.particles.length-1].render();
        }
    }
}

let diffusionXDelta = [];
function setupAnimation(step) {
    switch (step) {
        case 1:
            FreeLithiums.particles = StoredLithiums.particles.splice(StoredLithiums.particles.length - lithiumNumberY,
                lithiumNumberY);
            for (let i = 0; i < FreeLithiums.particles.length; i++) {
                FreeLithiums.particles[i].split(Electrons);
            }
            lithiumNumberX--;
            FreeLithiums.run();

            finishingXPosition = negElec.x + negElec.width + FreeLithiums.particles[0].size;
            break;

        case 2:
            finishingXPosition = negElec.x + negElec.width - Electrons.particles[0].size;
            break;

        case 3:
            let originalXPosition;
            let newXPosition;
            for (let i=0; i<lithiumNumberX; i++) {
                originalXPosition = (i*negElec.width/(lithiumNumberX+1))+box.x;
                newXPosition = (i*negElec.width/lithiumNumberX)+box.x;
                diffusionXDelta[i] = newXPosition - originalXPosition;
            }
            finishingXPosition = StoredLithiums.particles[StoredLithiums.particles.length-1].position.x
                + diffusionXDelta[lithiumNumberX-1];
            break;

    }

}

