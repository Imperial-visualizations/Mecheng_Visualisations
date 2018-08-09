
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ParticleSystem object to contain either Lithiums or Electrons
// Needed properties:
//      particles (array of Lithiums or Electrons)
//      particleType (either "Electron" or "Lithium", so we can tell the difference - might end up being unnecessary)
// Needed methods:
//      run()
//      addParticle()

class ParticleSystem {
    constructor(type){
        this.particles = [];
        this.particleType = type;
        if (this.particleType !== ("Electron") && this.particleType !== ("Lithium")) {
            throw "Invalid input - class ParticleSystem requires can only be Lithium or Electron";
        }
    }

    run(current,isRunning){
        for (let i=0; i<this.particles.length; i++) {
            //Do something to each particle
            let dead = this.particles[i].run(current,isRunning);
            if (dead) {
                this.particles.splice(i,1);
            }
        }
    };

    addParticle(x,y) {
        if (this.particleType === "Electron"){
            this.particles.push(new Electron(x,y));
        } else if (this.particleType === "Lithium") {
            this.particles.push(new Lithium(x,y));
        }
    }

    clear() {
        this.particles.splice(0,this.particles.length)
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Particle object to hold info on a particle
// Needed properties:
//      charge
//      mass
//      position
//      velocity
//      acceleration
// Needed methods:
//      run()

class Particle {
    constructor(x,y) {
        this.position = {x: x, y: y};
        this.size = 2;
        this.colour = ('#000000');
        this.pathLength = undefined;
    }

    run(current,isRunning) {
        let isDead = 0;
        if (isRunning) {
            isDead = this.update(current);
        }
        if (!isDead) {
            this.render();
        }
        return isDead;
    }

    update() {
        // Empty function; overwritten in subclasses
        return undefined
    }

    render() {
        fill(this.colour);
        strokeWeight(1);
        ellipse(this.position.x, this.position.y,this.size);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Electron extends Particle {
    constructor(x,y,parent) {
        super(x,y,parent);
        this.pathLength = (2*wire.height) + (wire.posX-wire.negX);
        this.positionOnPath = 0;
        this.color = '#fffc00';
        this.size = 2;
    }

    update(current) {
        //TODO: Implement this
        let isDead = false;
        if (this.positionOnPath >= this.pathLength) {
            isDead = true
        }
        this.positionOnPath += parseFloat(current/5)*this.pathLength/200;
        this.position = this.pathToAbsolutePosition();
        return isDead;
    }

    // Method to convert location from pathLength space to absolute space
    pathToAbsolutePosition() {

    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Lithium extends Particle {
    constructor(x,y,split,parent) {
        super(x,y,parent);
        if (split){
            this.charge = 1;
        } else {
            this.charge = 0;
        }
        this.isSplit = split;
        this.pathLength = posElec.x -(negElec.x+negElec.width);
        this.colour = '#ff0100';
        this.size = 10;
    }

    update(current) {
        let isDead = false;
        this.position.x += parseFloat(current/5)*this.pathLength/200; //+ (Math.random() - 0.5);
        debugger;
        this.position.y += (Math.random() - 0.5); //add some wobble!
        if (this.position.x >= posElec.x - this.size || this.position.x <= negElec.x + negElec.width + this.size) {
            isDead = true;
        }
        //Make sure they don't wobble outside the battery casing...
        if (this.position.y < canvasHeight*0.3) { //TODO: Remove magic numbers
            this.position.y += 2;
        } else if (this.position.y > canvasHeight*0.9) {
            this.position.y -= 2;
        }
        return isDead;
    }

    split(Electrons) {
        if (this.isSplit === false) {
            Electrons.add(new Electron(this.position));
            this.isSplit = true;
            this.charge++;
        } else {
            console.log("Lithium atom is already ionised - cannot generate another electron!");
        }
    }
}
