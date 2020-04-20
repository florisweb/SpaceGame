
function CelestialBody(_config) {
	GravParticle.call(this, _config);
	CollisionParticle.call(this, _config, createMeshFactory({radius: _config.radius}));
	SpinParticle.call(this, _config);
	
	this.calcPhysics = calcPhysics;
	PhysicsEngine.addParticle(this);
}



function Sun() {
	let config = {
		mass: 4188790.2047863905, 
		position: [
			PhysicsEngine.world.size.value[0] / 2,
			PhysicsEngine.world.size.value[1] / 2
		], 
		radius: 100,
		config: {
			collisionSensitive: false,
			gravitySensitive: false,
		}
	};
	CelestialBody.call(this, config);
	
}



function Planet(_ring) {
	let ring = _ring; 

	let distance = Math.pow(ring, 1.3) * 400;
	let radius = Math.random() * 30 + 10;

	let startVelocity = PhysicsEngine.formulas.calcEscapeVelocity(sun.mass, distance) * .7;

	let config = {
		mass: 4 / 3 * Math.PI * Math.pow(radius, 3),
		position: [PhysicsEngine.world.size.value[0] / 2 - distance, 2500], 
		radius: radius,
		config: {
			startVelocity: [0, startVelocity * (1 - 2 * Math.round(Math.random()))],
			exerciseCollisions: true,
			exerciseGravity: true,
		}
	};
	console.log(ring, config, config.config.startVelocity);
	CelestialBody.call(this, config);
}