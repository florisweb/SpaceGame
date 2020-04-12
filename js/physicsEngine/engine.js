const CollisionEngine = new _CollisionEngine();


function _PhysicsEngine() {
	this.particles = [];


	this.constants = new function() {
		this.G = 6.674 * Math.pow(10, -11 + 6);
	}

	this.settings = new function() {
		this.roundError = Math.pow(10, 4);
	}

	this.formulas = new function() {
		this.gravitation = function(_massA, _massB, _radius) {
			return PhysicsEngine.constants.G * (_massA * _massB) / (_radius * _radius);
		}
		this.calcMassInfluence = function(_massA, _massB) {
			return _massA / (_massA + _massB);
		}
		this.Egrav = function(_massA, _massB, _radius) {
			return -PhysicsEngine.constants.G * (_massA * _massB) / _radius;
		}
	}

	
	this.world = new function() {
		this.size = new Vector([2000, 2000]);

		this.inWorld = function(_particle) {
			if (_particle.position.value[0] < -_particle.mesh.meshRange || 
				_particle.position.value[1] < -_particle.mesh.meshRange) return false;
			if (_particle.position.value[0] > this.size.value[0] + _particle.mesh.meshRange || 
				_particle.position.value[1] > this.size.value[1] + _particle.mesh.meshRange) return false;
			return true;
		}
	}



	this.Etotal = 0;

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
			
			this.particles[p].calcPhysics();
		}

		// let prevEtotal = this.Etotal;
		// this.Etotal = 0;
		// Apply Fres
		for (let p = this.particles.length - 1; p >= 0; p--)
		{	
			this.particles[p].applyPhysics(this.particles[p].physicsObj);

			// let Ekin = .5 * this.particles[p].mass * Math.pow(this.particles[p].velocity.getLength(), 2);;
			// let Egrav = this.particles[p].calcEGrav().getLength();
			// this.Etotal += Ekin + Egrav;
		}
				
		// let energyChange = Math.round(
		// 		(this.Etotal - prevEtotal) * this.settings.roundError
		// 	) / this.settings.roundError;
		// if (energyChange != 0) console.warn("An energy change accured in the system:", energyChange);
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





	this.getGravEnergy = function(_particleA, _particleB) {
		let dVector = _particleA.position.difference(_particleB.position);
		let gravitation = PhysicsEngine.formulas.Egrav(
			_particleA.mass, 
			_particleB.mass,
			dVector.getLength()
		);

		return new Vector([0, 0])
				.setAngle(dVector.getAngle())
				.setLength(gravitation);
	}

	this.getTotalGravEnergy = function(_particle) {
		let curVector = new Vector([0, 0]);
		for (let i = 0; i < this.particles.length; i++) 
		{
			let curParticle = this.particles[i];
			if (!curParticle.config.exerciseGravity) continue;
			if (curParticle.id == _particle.id) continue;
			
			curVector.add(
				this.getGravEnergy(_particle, curParticle)
			);
		}
		return curVector;
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



