



const App   = new _app();
const Game  = new _Game();


function _app() {
	this.setup = function() {
    	Game.setup();
  	}
}






// document.body.onload = async function() {
//   console.warn("Start loading...s"); 
//   await App.setup();
//   console.warn("App loaded!"	);
// }
App.setup();

const circleShapeFunction = function(_position) {
	return this.position.difference(_position).getLength() < this.radius; 
}
const update = function() {
	let Fres = this.getGravVector();
	Fres.add(this.getCollisionVector(Fres));	
	this.applyFres(Fres);
	
	this.applyAngularVelocity();
	if (Game.updates % 10 == 0 && RenderEngine.settings.renderPositionTrace) this.addPositionDot();
}





let sunConfig = {mass: 30023590, position: [1000, 1000], radius: 40, config: {isSun: true}};
let sun = new GravParticle(sunConfig); //mercury
CollisionParticle.call(sun, sunConfig, circleShapeFunction);
SpinParticle.call(sun, sunConfig);
sun.update = update;
PhysicsEngine.addParticle(sun);








let mercuryConfig = {mass: 50235, position: [500, 1000], radius: 20, config: {startVelocity: [0, 2.1]}};
let mercury = new GravParticle(mercuryConfig); //mercury
CollisionParticle.call(mercury, mercuryConfig, circleShapeFunction);
SpinParticle.call(mercury, mercuryConfig);
mercury.update = update;
PhysicsEngine.addParticle(mercury);






let earthGroup = new GravGroup();
earthGroup.update = function() {
	this.updateValues();

	let Fres = this.getGravVector();
	let acceleration = this.applyFres(Fres);

	for (let i = 0; i < this.particles.length; i++) this.particles[i].velocity.add(acceleration);
}


let earthConfig = {mass: 500235, position: [200, 1000], radius: 20, config: {startVelocity: [0, 1.5]}};
let earth = new GravParticle(earthConfig); 
CollisionParticle.call(earth, earthConfig, circleShapeFunction);
SpinParticle.call(earth, earthConfig);
earth.update = update;
earthGroup.addParticle(earth);


let moonConfig = {mass: 30002, position: [300, 1050], radius: 10, config: {startVelocity: [0, 2]}};
let moon = new GravParticle(moonConfig); 
CollisionParticle.call(moon, moonConfig, circleShapeFunction);
SpinParticle.call(moon, moonConfig);
moon.update = update;
earthGroup.addParticle(moon);


PhysicsEngine.addParticle(earthGroup);








// new GravParticle({mass: 5035, position: [300, 1120], radius: 5, config: {startVelocity: [.6, 2.45]}}); //moon kinda
// createParticleSet(new Vector([300, 1000]), 5);

// function createParticleSet(_position, _spread, _count = 20) {
// 	let gg = new GravGroup();
// 	for (let i = 0; i < _count; i++) {
// 		let radius = 5;
// 		let mass = 5000; //4/3 * Math.PI * Math.pow(radius, 3);
// 		g = new GravParticle({position: [
// 			_position.value[0] - _spread + 2 * _spread * Math.random(), 
// 			_position.value[1] - _spread + 2 * _spread * Math.random()
// 		], mass: mass, radius: radius, config: {
// 			exerciseGravity: true
// 		}});
// 		gg.addParticle(g);
// 	}
// 	PhysicsEngine.addParticle(gg);
// }






