const CollisionEngine = new _CollisionEngine();


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
			if (_particle.position.value[0] < -_particle.collisionMesh.meshRange || 
				_particle.position.value[1] < -_particle.collisionMesh.meshRange) return false;
			if (_particle.position.value[0] > this.size.value[0] + _particle.collisionMesh.meshRange || 
				_particle.position.value[1] > this.size.value[1] + _particle.collisionMesh.meshRange) return false;
			return true;
		}
	}





	this.update = function() {
		CollisionEngine.update();
		// Calculate Fres
		for (let p = this.particles.length - 1; p >= 0; p--)
		{
			if (!this.world.inWorld(this.particles[p])) 
			{
				this.particles[p].remove();
				continue;
			}
			
			this.particles[p].update();
		}

		// Apply Fres
		for (let p = this.particles.length - 1; p >= 0; p--)
		{	
			this.particles[p].applyFres();
		}
	}


	this.addParticle = function(_particle) {
		this.particles.push(_particle);
	}



	this.getTotalGravVector = function(_particle) {
		return getTotalGravVectorByList(_particle, this.particles, false);
	}

	function getTotalGravVectorByList(_particle, _particleList) {
		let curVector = new Vector([0, 0]);
		for (let i = 0; i < _particleList.length; i++) 
		{
			let curParticle = _particleList[i];
			if (!curParticle.config.exerciseGravity) continue;
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



