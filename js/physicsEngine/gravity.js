function Particle({position, mass, config = {}}) {
	this.id = newId();
	this.mass = mass;
	this.position = new Vector(position);
	this.velocity = new Vector([0, 0]); // x-y-vector
	if (this.config)
	{
		this.config = {...this.config, ...config};
	} else this.config = config;


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


	this.applyFres = function(_Fres) {
		let a = _Fres.copy().scale(1 / this.mass);
		this.velocity.add(a);
		this.position.add(this.velocity);

		this.drawVectors(_Fres, a.copy());
		return a;
	}
}




function GravParticle({mass, position, radius, config = {}}) {
	if (config.exerciseGravity === undefined) config.exerciseGravity = true;
	Particle.call(this, {position: position, mass: mass, config: config});
	
	this.radius = radius;


	this.getGravVector = function() {
		return this.getFgrav();
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
	Particle.call(this, {position: position, mass: mass, radius: radius, config: config});
	this.angle 				= 0;
	this.angularVelocity 	= .01;

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
	}


	this.updateValues = function() {
		this.radius = 0;
		for (let i = 0; i < this.particles.length; i++) 
		{
			let distanceFromCenter = this.position.difference(this.particles[i].position).getLength();
			if (this.radius < distanceFromCenter) this.radius = distanceFromCenter;
		}
		this.position = PhysicsEngine.getCenterOfMass(this.particles);
	}
	function reCalculateMass() {
		This.mass = 0;
		for (let i = 0; i < This.particles.length; i++) This.mass += This.particles[i].mass;
	}
}