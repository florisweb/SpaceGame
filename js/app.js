



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
// for (let i = 0; i < 10; i++) {
// 	let radius = Math.random() * 10 + 5;
// 	let mass = 4/3 * Math.PI * Math.pow(radius, 3);
// 	g = new GravParticle({position: [Math.random() * 1600, Math.random() * 1200], mass: mass, radius: radius});
// }

new GravParticle({mass: 30023590, position: [1000, 1000], radius: 40}); //SUN
new GravParticle({mass: 500235, position: [200, 1000], radius: 20, config: {startVelocity: [0, 1.5]}}); //earth
new GravParticle({mass: 50235, position: [500, 1000], radius: 15, config: {startVelocity: [0, -2]}}); //mercury
// new GravParticle({mass: 5035, position: [300, 1120], radius: 5, config: {startVelocity: [.6, 2.45]}}); //moon kinda
// createParticleSet(new Vector([300, 1000]), 5);

function createParticleSet(_position, _spread, _count = 20) {
	for (let i = 0; i < _count; i++) {
		let radius = 5;
		let mass = 5000; //4/3 * Math.PI * Math.pow(radius, 3);
		new GravParticle({position: [
			_position.value[0] - _spread + 2 * _spread * Math.random(), 
			_position.value[1] - _spread + 2 * _spread * Math.random()
		], mass: mass, radius: radius, config: {
			exerciseGravity: false
		}});
	}
}



