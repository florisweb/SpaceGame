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
			break;
		}
	}


	this.positionTrace = [];
	this.addPositionDot = function() {
		this.positionTrace.push(this.position.copy());
		if (this.positionTrace.length > 300) this.positionTrace.splice(0, this.positionTrace.length - 300);
	}

	
	this.physicsObj = {
		Fres: new Vector([0, 0]),
		positionCorrection: new Vector([0, 0])
	}

	this.applyPhysics = function(_physicsObj) {
		let a = _physicsObj.Fres.copy().scale(1 / this.mass);
		this.velocity.add(a);
		this.position.add(this.velocity);
		this.position.add(_physicsObj.positionCorrection);

		this.drawVectors(_physicsObj.Fres.copy(), a.copy());
		
		this.physicsObj = {
			Fres: new Vector([0, 0]),
			positionCorrection: new Vector([0, 0])
		}

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

	this.calcEGrav = function() {
		return PhysicsEngine.getTotalGravEnergy(this);
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










