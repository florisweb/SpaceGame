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
		for (let p = this.particles.length - 1; p >= 0; p--)
		{
			if (!this.world.inWorld(this.particles[p]) || (this.particles[p].config.isGravGroup && this.particles[p].particles.length == 0)) 
			{
				this.particles[p].remove();
				continue;
			}
			
			this.particles[p].update();
		}
	}


	this.addParticle = function(_particle) {
		this.particles.push(_particle);
	}



	this.getTotalGravVector = function(_particle) {
		return getTotalGravVectorByList(_particle, this.particles, false);
	}
	this.getTotalGravVectorByGravGroup = function(_particle, _gravGroup) {
		return getTotalGravVectorByList(_particle, _gravGroup.particles, true);
	}

	function getTotalGravVectorByList(_particle, _particleList, _inGravGroup = false) {
		let curVector = new Vector([0, 0]);
		for (let i = 0; i < _particleList.length; i++) 
		{
			let curParticle = _particleList[i];
			if (!curParticle.config.exerciseGravity) continue;
			if (curParticle.config.isGravGroupParticle && !_inGravGroup) continue;
			if (curParticle.id == _particle.id) continue;
			
			curVector.add(
				PhysicsEngine.getGravitationVector(_particle, curParticle)
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



	this.getCenterOfMass = function(_particles) {
		let curVector = new Vector([0, 0]); 
		let massTillNow = 0;
		for (let i = 0; i < _particles.length; i++)
		{
			massTillNow += _particles[i].mass;
			let perc = _particles[i].mass / massTillNow;
			let delta = curVector.difference(_particles[i].position);
			curVector.add(delta.scale(perc));
		}
		return curVector
	}
}





function Particle({position, mass, config = {}}) {
	this.id = newId();
	this.mass = mass;
	this.position = new Vector(position);
	this.velocity = new Vector([0, 0]); // x-y-vector
	this.config = config

	if (this.config.startVelocity) this.velocity = new Vector(this.config.startVelocity);
	this.remove = function() {
		for (let i = PhysicsEngine.particles.length - 1; i >= 0; i--)
		{
			if (PhysicsEngine.particles[i].id != this.id) continue;
			PhysicsEngine.particles.splice(i, 1);
			if (this.gravGroup) this.gravGroup.removeParticle(this.id);
			break;
		}
	}


	this.positionTrace = [];
	this.addPositionDot = function() {
		this.positionTrace.push(this.position.copy());
		if (this.positionTrace.length > 300) this.positionTrace.splice(0, this.positionTrace.length - 300);
	}
}






function GravParticle({mass, position, radius, config = {}}) {
	if (config.exerciseGravity === undefined) config.exerciseGravity = true;
	Particle.call(this, {position: position, mass: mass, config: config});
	
	this.radius = radius;

	this.update = function() {
		this.applyGravitation();
		if (Game.updates % 10 == 0 && RenderEngine.settings.renderPositionTrace) this.addPositionDot();
	}


	this.applyGravitation = function() {
		let Fgrav = this.getFgrav();
		let Fres = Fgrav.copy();

		let a = Fres.scale(1 / this.mass);
		this.velocity.add(a);
		this.position.add(this.velocity);

		this.drawVectors(Fgrav, a.copy());
		return a;
	}

	this.getFgrav = function() {
		return PhysicsEngine.getTotalGravVector(this);
	}

	this.drawVectors = function(_Fgrav, _a) {
		if (!RenderEngine.settings.renderVectors) return;
		RenderEngine.drawVector(this.position.copy(), _Fgrav.scale(3), "#00f");
		RenderEngine.drawVector(this.position.copy(), this.velocity.copy().scale(30), "#f00");
		RenderEngine.drawVector(this.position.copy(), _a.scale(5000), "#fa0");
	}
}





function SpinParticle({mass, position, radius, config = {}}) {
	GravParticle.call(this, {position: position, mass: mass, radius: radius, config: config});
	this.angle 				= 0;
	this.angularVelocity 	= .01;

	this.update = function() {
		this.applyGravitation();
		this.applyAngularVelocity();
		if (Game.updates % 10 == 0 && RenderEngine.settings.renderPositionTrace) this.addPositionDot();
	}

	this.applyAngularVelocity = function() {
		this.angle += this.angularVelocity;
		while (this.angle > Math.PI) this.angle -= Math.PI * 2;
		while (this.angle < -Math.PI) this.angle += Math.PI * 2;


		RenderEngine.drawVector(this.position.copy(), new Vector([0, 0]).setAngle(-this.angle, 30), "#fff");
	}
}

















function GravGroup() {
	GravParticle.call(this, {
		mass: 1, 
		position: [0, 0], 
		radius: 0, 
		config: {
			isGravGroup: true,
		}
	});
	let This = this;
	this.particles = [];

	this.addParticle = function(particle) {
		particle.config.isGravGroupParticle = true;
		particle.gravGroup = this;
		particle.getFgrav = function() {
			return PhysicsEngine.getTotalGravVectorByGravGroup(this, this.gravGroup);
		}

		this.particles.push(particle);
		PhysicsEngine.addParticle(particle);

		reCalculateMass();

		return particle;
	}

	this.removeParticle = function(_id) {
		for (let i = this.particles.length - 1; i >= 0; i--)
		{
			if (this.particles[i].id != _id) continue;
			this.particles.splice(i, 1)[0].remove();
			break;
		}
	}


	this.update = function() {
		this.updateValues();

		let acceleration = this.applyGravitation();
		for (let i = 0; i < this.particles.length; i++) this.particles[i].velocity.add(acceleration);

		this.position = PhysicsEngine.getCenterOfMass(this.particles);
	}


	this.updateValues = function() {
		this.radius = 0;
		for (let i = 0; i < this.particles.length; i++) 
		{
			let distanceFromCenter = this.position.difference(this.particles[i].position).getLength();
			if (this.radius < distanceFromCenter) this.radius = distanceFromCenter;
		}
	}
	function reCalculateMass() {
		This.mass = 0;
		for (let i = 0; i < This.particles.length; i++) This.mass += This.particles[i].mass;
	}
}