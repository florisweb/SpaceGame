



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


g = new GravParticle({position: [50, -20], mass: 50, radius: 10});
g = new GravParticle({position: [100, 150], mass: 200, radius: 20});
g = new GravParticle({position: [300, 150], mass: 50, radius: 10});
// g = new GravParticle({position: [500, 300], mass: 200, radius: 20});
