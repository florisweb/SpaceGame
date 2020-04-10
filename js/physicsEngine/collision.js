


function CollisionParticle({mass, position, config = {}}, _shapeFunction) {
	if (config.exerciseCollisions === undefined) config.exerciseCollisions = true;
	Particle.call(this, {position: position, mass: mass, config: config});
	let This = this;
	
	
	this.shapeFunction = _shapeFunction;
	this.minRadius = 0;
	this.maxRadius = this.radius;

	this.getCollisionVector = function(_Fres) {
		let vector = getCollisionVector();
		if (vector.getLength() == 0) return vector;

		let Fcollision = vector.getProjection(_Fres);
		let FantiSpeed = 
				.5 * 
				this.mass * 
				Math.pow(vector.getProjection(this.velocity).getLength(), 2) * 
				PhysicsEngine.collision.settings.antiSpeedConstant;
		
		Fcollision.setLength(Fcollision.getLength() + FantiSpeed)

		return Fcollision.scale(-1);
	}


	
	const angleSteps = (2 * Math.PI) / PhysicsEngine.collision.settings.rays;
	function getCollisionVector() {
		let totalVector = new Vector([0, 0]);
		let activeRays = 0;
		for (let p = 0; p < PhysicsEngine.particles.length; p++)
		{
			let curParticle = PhysicsEngine.particles[p];
			if (!curParticle.config.exerciseCollisions) continue;
			if (This.position.difference(curParticle.position).getLength() > This.maxRadius + curParticle.maxRadius) continue;
			if (curParticle.id == This.id) continue;

			for (let a = -Math.PI; a < Math.PI; a += angleSteps)
			{
				for (let d = This.minRadius; d < This.maxRadius; d += PhysicsEngine.collision.settings.rayStepSize)
				{
					let relativeAngle = new Vector([0, 0]).setAngle(a, d);
					let position = This.position.copy().add(relativeAngle);
					if (!curParticle.shapeFunction(position)) continue;
					totalVector.add(relativeAngle);
					activeRays++;
					break;
				}
			}
		}
		
		if (activeRays == 0) return new Vector([0, 0]);
		return totalVector.scale(1 / activeRays);
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

