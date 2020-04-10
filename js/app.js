



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


// g = new GravParticle({position: [50, -20], mass: 50, radius: 10});
// g = new GravParticle({position: [100, 150], mass: 200, radius: 20});
// g = new GravParticle({position: [300, 150], mass: 50, radius: 10});
// g = new GravParticle({position: [500, 300], mass: 200, radius: 20});

PhysicsEngine.addParticle(new GravParticle({mass: 30023590, position: [1000, 1000], radius: 40})); //SUN
let mercury = new GravParticle({mass: 50235, position: [500, 1000], radius: 15, config: {startVelocity: [0, -2]}}); //mercury
PhysicsEngine.addParticle(mercury);


{
let earthGroup = new GravGroup();
let earth = new SpinParticle({mass: 500235, position: [200, 1000], radius: 20, config: {startVelocity: [0, 1.5]}}); //earth
GravParticle.call(earth, {mass: 500235, position: [200, 1000], radius: 20, config: {startVelocity: [0, 1.5]}});

earthGroup.addParticle(earth);


let moon = new SpinParticle({mass: 30002, position: [300, 1050], radius: 10, config: {startVelocity: [0, 2]}}); 
GravParticle.call(moon, {mass: 30002, position: [300, 1050], radius: 10, config: {startVelocity: [0, 2]}});
earthGroup.addParticle(moon);

PhysicsEngine.addParticle(earthGroup);
}

// gg.addParticle(new GravParticle({position: [100, 0], mass: 14000, radius: 15}));
// gg.addParticle(new GravParticle({position: [0, 100], mass: 14000, radius: 15}));







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






