
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

    run(){
        for (var i=0; i<this.particles.length; i++) {
            //Do something to each particle
            let dead = this.particles[i].run();
            if (dead) {
                this.particles.splice(i,1);
            }
        }
    };

    addParticle(position) {
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

class Particle {
    constructor(x,y) {
        this.charge = 0;

        this.position = [x,y];
        this.velocity = 0;
        this.acceleration = 0;
    }
}

class Electron extends Particle {
    constructor(x,y) {
        super(x,y);
        this.charge = -1;
    }

    run() {
        //TODO: Implement this
        let isDead = 0;
        return isDead;
    }
}

class Lithium extends Particle {
    constructor(x,y, split) {
        super(x,y);
        if (split){
            this.charge = 1;
        } else {
            this.charge = 0;
        }
        this.isSplit = split;
    }

    run() {
        //TODO: Implement this
        let isDead = 0;
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
