function _PhysicsEngine() {
	this.particles = [];

	this.constants = new function() {
		this.G = 6.674 * Math.pow(10, -11 + 6);
	}

	this.formulas = new function() {
		this.gravitation = function(_massA, _massB, _radius) {
			return PhysicsEngine.constants.G * (_massA * _massB) / (_radius * _radius);
		}
	}
	
	this.world = new function() {
		this.size = new Vector([2000, 2000]);

		this.inWorld = function(_particle) {
			if (_particle.position.value[0] < -_particle.radius || _particle.position.value[1] < -_particle.radius) return false;
			if (_particle.position.value[0] > this.size.value[0] + _particle.radius || _particle.position.value[1] > this.size.value[1] + _particle.radius) return false;
			return true;
		}
	}



	this.update = function() {
		for (let p = this.particles.length -1; p >= 0; p--)
		{
			if (!this.world.inWorld(this.particles[p])) 
			{
				this.particles.splice(p, 1);
				continue;
			}
			
			this.particles[p].applyGravitation();
		}
	}



	

	
	this.getTotalGravVector = function(_particle) {
		let curVector = new Vector([0, 0]);
		for (let i = 0; i < this.particles.length; i++) 
		{
			let curParticle = this.particles[i];
			if (!curParticle.config.exerciseGravity) continue;
			if (curParticle.id == _particle.id) continue;
			
			curVector.add(
				this.getGravitationVector(_particle, curParticle)
			);
		}
		return curVector;
	}


	this.getGravitationVector = function(_particleA, _particleB) {
		let dVector = _particleA.position.difference(_particleB.position);
		let gravitation = PhysicsEngine.formulas.gravitation(
			_particleA.mass, 
			_particleB.mass,
			dVector.getLength()
		);

		return new Vector([0, 0])
				.setAngle(dVector.getAngle())
				.setLength(gravitation);
	}


}




function Particle({position, mass, config = {}}) {
	this.id = newId();
	this.mass = mass;
	this.position = new Vector(position);
	this.velocity = new Vector([0, 0]); // x-y-vector
	this.config = config

	PhysicsEngine.particles.push(this);
}



function GravParticle({mass, position, radius, config = {}}) {
	if (config.exerciseGravity === undefined) config.exerciseGravity = true;
	Particle.call(this, {position: position, mass: mass, config: config});
	
	this.radius = radius;


	this.applyGravitation = function() {
		let Fgrav = PhysicsEngine.getTotalGravVector(this);
		let Fres = Fgrav.copy();

		let a = Fres.scale(1 / this.mass);
		this.velocity.add(a);

		this.position.add(this.velocity);

		if (!RenderEngine.settings.renderVectors) return;
		RenderEngine.drawVector(this.position.copy(), Fgrav.scale(30), "#00f");
		RenderEngine.drawVector(this.position.copy(), this.velocity.copy().scale(30), "#f00");
		RenderEngine.drawVector(this.position.copy(), a.scale(3000), "#fa0");
	}

}


