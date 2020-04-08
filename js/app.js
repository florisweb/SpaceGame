



const App   = new _app();
const Game  = new _Game();


function _app() {
	this.setup = function() {
    Game.setup();

  }
}






// document.body.onload = async function() {
//   console.warn("Start loading..."); 
//   await App.setup();
//   console.warn("App loaded!");
// }
App.setup();


// g = new GravParticle({position: [50, -20], mass: 50, radius: 10});
// g = new GravParticle({position: [100, 150], mass: 200, radius: 20});
// g = new GravParticle({position: [300, 150], mass: 50, radius: 10});
// g = new GravParticle({position: [500, 300], mass: 200, radius: 20});
for (let i = 0; i < 10; i++) {
	let radius = Math.random() * 10 + 5;
	let mass = 4/3 * Math.PI * Math.pow(radius, 3);
	g = new GravParticle({position: [Math.random() * 1600, Math.random() * 1200], mass: mass, radius: radius});
	console.log(g.position.value);
}

g = new GravParticle({mass: 523599, position: [800, 600], radius: 50}); //SUN
