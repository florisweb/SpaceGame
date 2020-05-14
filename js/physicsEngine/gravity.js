function _PhysicsEngine_gravity() {
	this.formulas = new function() {
		this.gravitation = function(_massA, _massB, _radius) {
			return PhysicsEngine.constants.G * (_massA * _massB) / (_radius * _radius);
		}

		this.calcEscapeVelocity = function(_sunMass, _sunDistance) {
			return Math.sqrt(2 * PhysicsEngine.constants.G * _sunMass / _sunDistance);
		}
		this.calcMassInfluence = function(_massA, _massB) {
			return _massA / (_massA + _massB);
		}
	}



	this.update = function(_list = PhysicsEngine.bodies) {
		for (let p = 0; p < _list.length; p++) 
		{
			let self = _list[p];
			for (let t = p + 1; t < _list.length; t++) 
			{
				let target = _list[t];
				if (
					!(self.config.gravitySensitive && target.config.exerciseGravity) && 
					!(target.config.gravitySensitive && self.config.exerciseGravity)
				) continue;

				let gravVector = this.getGravitationVector(self, target);
				if (self.config.gravitySensitive && target.config.exerciseGravity) 
				{
					self.tempValues.force.add(gravVector);
					if (RenderEngine.settings.renderVectors) RenderEngine.drawVector(self.getPosition().copy(), gravVector.copy().scale(10), "#00f");
				}

				if (target.config.gravitySensitive && self.config.exerciseGravity) 
				{
					target.tempValues.force.add(gravVector.scale(-1));
					if (RenderEngine.settings.renderVectors) RenderEngine.drawVector(target.getPosition().copy(), gravVector.copy().scale(10), "#00f");
				}
			}
		}
	}

	this.getGravitationVector = function(_bodyA, _bodyB) {
		let dVector = _bodyA.position.difference(_bodyB.position);
		let gravitation = this.formulas.gravitation(
			_bodyA.massData.mass, 
			_bodyB.massData.mass,
			dVector.getLength()
		);

		return dVector.setLength(gravitation);
		  // new Vector([0, 0])
				// .setAngle(dVector.getAngle())
				// .setLength(gravitation);
	}


}


// function Particle({position, mass, config = {}}) {
// 	this.id = newId();
// 	this.mass = mass;
// 	this.position = new Vector(position);
// 	this.angle = 0;
	
// 	this.velocity = new Vector([0, 0]); // x-y-vector
// 	if (this.config)
// 	{
// 		this.config = {...this.config, ...config};
// 	} else this.config = config;


// 	if (this.config.startVelocity) this.velocity = new Vector(this.config.startVelocity);
// 	this.remove = function() {
// 		for (let i = PhysicsEngine.particles.length - 1; i >= 0; i--)
// 		{
// 			if (PhysicsEngine.particles[i].id != this.id) continue;
// 			PhysicsEngine.particles.splice(i, 1);
// 			break;
// 		}
// 	}

// 	this.positionTrace = [];
// 	this.addPositionDot = function() {
// 		this.positionTrace.push(this.position.copy());
// 		if (this.positionTrace.length > 300) this.positionTrace.splice(0, this.positionTrace.length - 300);
// 	}

	
// 	this.physicsObj = {
// 		Fres: new Vector([0, 0]),
// 		positionCorrection: new Vector([0, 0])
// 	}

// 	this.applyPhysics = function(_physicsObj) {
// 		let a = _physicsObj.Fres.scale(1 / this.mass);
// 		this.velocity.add(a);
// 		this.position.add(this.velocity);
// 		this.position.add(_physicsObj.positionCorrection);

// 		// this.drawVectors(_physicsObj.Fres.copy(), a.copy());
		
// 		this.physicsObj = {
// 			Fres: new Vector([0, 0]),
// 			positionCorrection: new Vector([0, 0])
// 		}

// 		return a;
// 	}
// }




// function GravParticle({mass, position, radius, config = {}}) {
// 	if (config.exerciseGravity === undefined) config.exerciseGravity = true;
// 	if (config.gravitySensitive === undefined) config.gravitySensitive = true;
// 	Particle.call(this, {position: position, mass: mass, config: config});
	
// 	this.radius = radius;

// 	this.drawVectors = function(_Fgrav, _a) {
// 		if (!RenderEngine.settings.renderVectors) return;
// 		RenderEngine.drawVector(this.position.copy(), _Fgrav.scale(3), "#00f");
// 		RenderEngine.drawVector(this.position.copy(), this.velocity.copy().scale(30), "#f00");
// 		RenderEngine.drawVector(this.position.copy(), _a.scale(5000), "#fa0");
// 	}
// }





// function SpinParticle({mass, position, radius, config = {}}) {
// 	Particle.call(this, {position: position, mass: mass, radius: radius, config: config});
// 	this.angularVelocity 	= 0.01 - Math.random() * .02;

// 	this.applyAngularVelocity = function() {
// 		this.angle += this.angularVelocity;
// 		while (this.angle > Math.PI) this.angle -= Math.PI * 2;
// 		while (this.angle < -Math.PI) this.angle += Math.PI * 2;
// 	}
// }










