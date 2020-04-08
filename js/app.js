



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
//   console.warn("App loaded!");
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

g = new GravParticle({mass: 50023599, position: [800, 600], radius: 50}); //SUN

function createParticleSet(_position, _spread, _count = 20) {
	for (let i = 0; i < _count; i++) {
		let radius = Math.random() * 3 + 2;
		let mass = 4/3 * Math.PI * Math.pow(radius, 3);
		new GravParticle({position: [
			_position.value[0] + 2 * _spread - _spread * Math.random(), 
			_position.value[1] + 2 * _spread - _spread * Math.random()
		], mass: mass, radius: radius});
	}
}



