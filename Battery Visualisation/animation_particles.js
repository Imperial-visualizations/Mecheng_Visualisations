
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ParticleSystem object to contain either StoredLithiums or Electrons
// Needed properties:
//      particles (array of StoredLithiums or Electrons)
//      particleType (either "Electron" or "Lithium", so we can tell the difference - might end up being unnecessary)
// Needed methods:
//      run()
//      addParticle()

class AnimationParticleSystem {
    constructor(type){
        this.particles = [];
        this.particleType = type;
        if (this.particleType !== ("Electron") && this.particleType !== ("Lithium")
            && this.particleType !== ("Anion")) {
            throw "Invalid input - class ParticleSystem requires can only be Lithium or Electron";
        }
    }

    run(){
        for (let i=0; i<this.particles.length; i++) {
            //Do something to each particle
            this.particles[i].render();
        }
    };

    addParticle(x,y) {
        if (this.particleType === "Electron"){
            this.particles.push(new AnimationElectron(x,y));
        } else if (this.particleType === "Lithium") {
            this.particles.push(new AnimationLithium(x,y));
        } else if (this.particleType === "Anion") {
            this.particles.push(new AnimationAnion(x,y));
        }
    }

    clear() {
        this.particles.splice(0,this.particles.length)
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AnimationParticle object to hold info on a particle
// Needed properties:
//      charge
//      mass
//      position
//      velocity
//      acceleration
// Needed methods:
//      run()

class AnimationParticle {
    constructor(x,y) {
        this.position = {x: x, y: y};
        this.size = 2;
        this.colour = ('#000000');
    }

    render() {
        fill(this.colour);
        strokeWeight(1);
        ellipse(this.position.x, this.position.y,this.size);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class AnimationElectron extends AnimationParticle {
    constructor(x,y) {
        super(x,y);
        this.colour = '#ffff00';
        this.size = 7;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class AnimationLithium extends AnimationParticle {
    constructor(x,y) {
        super(x,y);
        this.colour = '#adaaad';
        this.size = 12;
    }

    split(ElectronSystem) {
        if (!this.isSplit) {
            this.colour = '#ff0100';
            ElectronSystem.addParticle(this.position.x,this.position.y);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class AnimationAnion extends AnimationParticle {
    constructor(x,y) {
        super(x,y);
        this.colour = '#0000ff';
        this.size = 7;
    }
}
