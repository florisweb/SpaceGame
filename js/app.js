



const App   = new _app();
const Game  = new _Game();


function _app() {
	this.setup = function() {
    	Game.setup();
  	}
}


App.setup();





let sun = new Sun();
// let planet1 = new Planet(1);
// let planet2 = new Planet(2);
// let planet3 = new Planet(3);



PhysicsEngine.addBody(sun);
// PhysicsEngine.addBody(planet1);
// PhysicsEngine.addBody(planet2);
// PhysicsEngine.addBody(planet3);


let bodyG = new BuilderGroup({
	position: [7000, 7000],
	config: {
		gravitySensitive: true,
		exerciseGravity: true,
	}
});
bodyG.material.restitution = 1;

let planet = new Body({
	position: [0, 0],
	shapeFactory: function(_this) {
		return [
			new BuildCircle({offset: [0, 0], radius: 100}, _this),
		];
	},
	config: {
		gravitySensitive: false,
		exerciseGravity: true,
	}
});

let building = new Body({
	position: [115, 0],
	shapeFactory: function(_this) {
		return [
			new Box({offset: [15, 0], shape: [15, 30]}, _this),
			new Box({offset: [35, 10], shape: [5, 10]}, _this),
		];
	},
	config: {
		gravitySensitive: false,
		exerciseGravity: false,
	}
});


bodyG.addBody(planet);
bodyG.addBody(building);

PhysicsEngine.addBody(bodyG);

// for (let i = 0; i < 200; i++) {
// 	let position = [Math.random() * PhysicsEngine.world.size.value[0], Math.random() * PhysicsEngine.world.size.value[0]];

// 	let body = new Body({
// 		position: position,
// 		shapeFactory: function(_this) {
// 			return [
// 				new Box({offset: [0, 0], shape: [40 * Math.random() + 5, 40 * Math.random() + 5], angle: Math.random() * 2 * Math.PI}, _this)
// 			];
// 		},
// 		config: {
// 			gravitySensitive: true,
// 			exerciseGravity: true,
// 		}
// 	});
// 	if (Math.random() > .5) body = new Body({
// 		position: position,
// 		shapeFactory: function(_this) {
// 			return [
// 				new Circle({offset: [0, 0], radius: 30 * Math.random() + 5}, _this),
// 			];
// 		},
// 		config: {
// 			gravitySensitive: true,
// 			exerciseGravity: true,
// 		}
// 	});

// 	PhysicsEngine.addBody(body);
// }



// const createMeshFactory = function({radius}) {
// 	return function (_parent) {
// 		return new CollisionCircle({radius: radius, lineCount: 10}, _parent);
// 	}
// }

// const createMeshFactory3 = function() {
// 	return function (_parent) {
// 		return new CollisionBox({diagonal: [20, 3]}, _parent);
// 	}
// }

// const createMeshFactory2 = function() {
// 	return function (_parent) {
// 		return new function() {
// 			this.radius = 30;
// 			let lineCount = 5;

// 			function generateMesh() {
// 				let lines = [];


// 				const anglePerLine = (2 * Math.PI) / lineCount;
// 				const length = Math.sin(anglePerLine * .5) * this.radius * 2;

// 				lines.push(
// 					new CollisionLine({
// 						offset: [30, 0],
// 						shape: [20, 12],
// 					}, this)
// 				);
// 				lines.push(
// 					new CollisionLine({
// 						offset: [9, 28],
// 						shape: [21, 14],
// 					}, this)
// 				);
// 				lines.push(
// 					new CollisionLine({
// 						offset: [50, 12],
// 						shape: [-20, 30],
// 					}, this)
// 				);

				
// 				for (let a = anglePerLine; a < Math.PI * 2; a += anglePerLine) 
// 				{
// 					let deltaPos = new Vector([0, 0]).setAngle(a, this.radius);
// 					let newLine = new CollisionLine({
// 						offset: deltaPos.value, 
// 						shape: new Vector([0, 0]).setAngle(a + (anglePerLine + Math.PI) * .5, length).value
// 					}, this);
// 					lines.push(newLine);
// 				}


// 				return lines;
// 			}

// 			MeshObject.call(this, {meshFactory: generateMesh, offset: [0, 0]}, _parent);
// 		}
// 	}
// }


// const calcPhysics = function() {
// 	let collisionData = this.getCollisionData(this.physicsObj.Fres);

// 	this.physicsObj.positionCorrection.add(collisionData.positionCorrection);
// 	this.physicsObj.Fres.add(collisionData.vector);	

// 	if (this.applyAngularVelocity) this.applyAngularVelocity();

// 	if (Game.updates % 10 == 0)
// 	{
// 		if (this.positionTrace.length > 100) this.positionTrace.splice(0, 1);
// 		this.positionTrace.push(this.position.copy());
// 	} 
// }




// let sun = new Sun();

// let planet1 = new Planet(1);
// let planet2 = new Planet(2);
// let planet3 = new Planet(3);
// let planet4 = new Planet(4);
// let planet5 = new Planet(5);






// let homePlanetConfig = {mass: 113097.33552923254, position: [1500, 2000], config: {startVelocity: [0, -2.5]}};
// let homePlanetConfig = {mass: 113097.33552923254, position: [1000, 1000], config: {startVelocity: [0, 0]}};
// let homePlanet = new GravParticle(homePlanetConfig); //mercury
// CollisionParticle.call(homePlanet, homePlanetConfig, createMeshFactory({radius: 50}));
// SpinParticle.call(homePlanet, homePlanetConfig);
// homePlanet.calcPhysics = calcPhysics;
// PhysicsEngine.addParticle(homePlanet);




// let sunConfig = {mass: 4188790.2047863905, position: [1000, 1000], config: {startVelocity: [0, 0]}};
// let sun = new GravParticle(sunConfig); //mercury
// CollisionParticle.call(sun, sunConfig, createMeshFactory({radius: 100}));
// SpinParticle.call(sun, sunConfig);
// sun.calcPhysics = calcPhysics;
// PhysicsEngine.addParticle(sun);



// {


// let planetConfig = {mass: 33510.32163829113, position: [700, 1000], config: {startVelocity: [1, 3]}};
// let planet = new GravParticle(planetConfig); //mercury
// CollisionParticle.call(planet, planetConfig, createMeshFactory({radius: 20}));
// SpinParticle.call(planet, planetConfig);
// planet.calcPhysics = calcPhysics;
// PhysicsEngine.addParticle(planet);


// }

// {
// let planetConfig = {mass: 268082.573106329, position: [100, 1000], config: {startVelocity: [0, 1.5]}};
// let planet = new GravParticle(planetConfig); //mercury
// CollisionParticle.call(planet, planetConfig, createMeshFactory({radius: 40}));
// SpinParticle.call(planet, planetConfig);
// planet.calcPhysics = calcPhysics;
// PhysicsEngine.addParticle(planet);
// }






// createParticleSet(new Vector([1000, 1000]), 1000, 500);



// function createBullet(_position, _velocity) {
// 	const explosionPower = Math.pow(10, 4);
// 	let bulletConfig = {mass: 100, position: _position, config: {
// 		startVelocity: _velocity,
// 		exerciseCollisions: false,
// 		exerciseGravity: false,
// 		onCollision: function(_targets) {
// 			for (let i = 0; i < _targets.length; i++)
// 			{
// 				let deltaSpeed = _targets[i].vector.getProjection(this.velocity).difference(_targets[i].vector.getProjection(_targets[i].target.parent.velocity))
// 				_targets[i].target.parent.physicsObj.Fres.add(deltaSpeed.scale(-explosionPower));
// 			}
// 			this.remove();
// 			return true;
// 		}
// 	}};
// 	let bullet = new GravParticle(bulletConfig); //mercury
// 	CollisionParticle.call(bullet, bulletConfig, createMeshFactory3());
// 	SpinParticle.call(bullet, bulletConfig);
// 	bullet.calcPhysics = function() {
// 		this.physicsObj.Fres.add(this.getGravVector());
// 		let collisionData = this.getCollisionData(this.physicsObj.Fres);

// 		this.physicsObj.positionCorrection.add(collisionData.positionCorrection);
// 		this.physicsObj.Fres.add(collisionData.vector);	

// 		this.angle = this.velocity.getAngle();
// 	}


// 	PhysicsEngine.addParticle(bullet);
// }






// let mercuryConfig = {mass: 50235, position: [500, 1000], radius: 20, config: {startVelocity: [0, .8]}};
// // let mercuryConfig = {mass: 50235, position: [500, 1000], radius: 20, config: {startVelocity: [0, 2.1]}};
// let mercury = new GravParticle(mercuryConfig); //mercury
// CollisionParticle.call(mercury, mercuryConfig, circleShapeFunction);
// SpinParticle.call(mercury, mercuryConfig);
// mercury.update = update;
// PhysicsEngine.addParticle(mercury);






// let earthGroup = new GravGroup();
// earthGroup.update = function() {
// 	this.updateValues();

// 	let Fres = this.getGravVector();
// 	let acceleration = this.applyFres(Fres);

// 	for (let i = 0; i < this.particles.length; i++) this.particles[i].velocity.add(acceleration);
// }


// let earthConfig = {mass: 500235, position: [200, 1000], radius: 20, config: {startVelocity: [0, 1.5]}};
// let earthConfig = {mass: 500235, position: [200, 1000], radius: 20, config: {startVelocity: [0, .5]}};
// let earth = new GravParticle(earthConfig); 
// CollisionParticle.call(earth, earthConfig, circleShapeFunction);
// SpinParticle.call(earth, earthConfig);
// earth.update = update;
// // earthGroup.addParticle(earth);
// PhysicsEngine.addParticle(earth);


// // let moonConfig = {mass: 30002, position: [300, 1050], radius: 10, config: {startVelocity: [0, 2]}};
// let moonConfig = {mass: 30002, position: [300, 1050], radius: 10, config: {startVelocity: [0, -.5]}};
// let moon = new GravParticle(moonConfig); 
// CollisionParticle.call(moon, moonConfig, circleShapeFunction);
// SpinParticle.call(moon, moonConfig);
// moon.update = update;
// // earthGroup.addParticle(moon);
// PhysicsEngine.addParticle(moon);


// PhysicsEngine.addParticle(earthGroup);








// new GravParticle({mass: 5035, position: [300, 1120], radius: 5, config: {startVelocity: [.6, 2.45]}}); //moon kinda
// createParticleSet(new Vector([300, 1000]), 5);

// function createParticleSet(_position, _spread, _count = 20) {
// 	// let gg = new GravGroup();
// 	// gg.update = function() {
// 	// 	this.updateValues();

// 	// 	let Fres = this.getGravVector();
// 	// 	let acceleration = this.applyFres(Fres);

// 	// 	for (let i = 0; i < this.particles.length; i++) this.particles[i].velocity.add(acceleration);
// 	// }

// 	for (let i = 0; i < _count; i++) {
// 		let radius = 5;
// 		let mass = 4/3 * Math.PI * Math.pow(radius, 3);
// 		let config = {position: [
// 			_position.value[0] - _spread + 2 * _spread * Math.random(), 
// 			_position.value[1] - _spread + 2 * _spread * Math.random()
// 		], mass: mass, config: {
// 			exerciseGravity: true,
// 			gravitySensitive: true,
// 			exerciseCollisions: true,
// 			collisionSensitive: true,
// 			// onCollision: function() {
// 			// 	this.remove();
// 			// },
// 		}};
// 		g = new GravParticle(config);
// 		CollisionParticle.call(g, config, createMeshFactory({radius: radius}));

// 		g.calcPhysics = calcPhysics;

// 		// gg.addParticle(g);
// 		PhysicsEngine.addParticle(g);
// 	}
// 	// PhysicsEngine.addParticle(gg);
// }





