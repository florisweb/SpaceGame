



const App   = new _app();
const Game  = new _Game();


function _app() {
	this.setup = function() {
    	Game.setup();
  	}
}


App.setup();




const createMeshFactory = function({radius}) {
	return function (_parent) {
		return new CollisionCircle({radius: radius, lineCount: 3}, _parent);
	}
}

const createMeshFactory2 = function({size}) {
	return function (_parent) {
		return new CollisionBox({diagonal: size}, _parent);
	}
}


const calcPhysics = function() {
	this.physicsObj.Fres.add(this.getGravVector());
	
	let collisionData = this.getCollisionData(this.physicsObj.Fres);
	
	// console.log(collisionData.positionCorrection, this.id);


	this.physicsObj.positionCorrection.add(collisionData.positionCorrection);
	this.physicsObj.Fres.add(collisionData.vector);
	

	if (this.applyAngularVelocity) this.applyAngularVelocity();
	if (Game.updates % 10 == 0 && RenderEngine.settings.renderPositionTrace) this.addPositionDot();
}





let sunConfig = {mass: 10023590, position: [800, 1000], config: {startVelocity: [1, 0]}};
let sun = new GravParticle(sunConfig); //mercury
CollisionParticle.call(sun, sunConfig, createMeshFactory({radius: 40}));
SpinParticle.call(sun, sunConfig);
sun.calcPhysics = calcPhysics;
PhysicsEngine.addParticle(sun);



{
let sunConfig2 = {mass: 10023590, position: [400, 1000], config: {startVelocity: [4, 0]}};
let sun2 = new GravParticle(sunConfig2); //mercury
CollisionParticle.call(sun2, sunConfig2, createMeshFactory({radius: 30}));
SpinParticle.call(sun2, sunConfig2);
sun2.calcPhysics = calcPhysics;
PhysicsEngine.addParticle(sun2);
}




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

function createParticleSet(_position, _spread, _count = 20) {
	// let gg = new GravGroup();
	// gg.update = function() {
	// 	this.updateValues();

	// 	let Fres = this.getGravVector();
	// 	let acceleration = this.applyFres(Fres);

	// 	for (let i = 0; i < this.particles.length; i++) this.particles[i].velocity.add(acceleration);
	// }

	for (let i = 0; i < _count; i++) {
		let radius = 20;
		let mass = 4/3 * Math.PI * Math.pow(radius, 3) * .2;
		let config = {position: [
			_position.value[0] - _spread + 2 * _spread * Math.random(), 
			_position.value[1] - _spread + 2 * _spread * Math.random()
		], mass: mass, config: {}};
		g = new GravParticle(config);
		CollisionParticle.call(g, config, createMeshFactory({radius: radius}));

		g.calcPhysics = calcPhysics;

		// gg.addParticle(g);
		PhysicsEngine.addParticle(g);
	}
	// PhysicsEngine.addParticle(gg);
}





