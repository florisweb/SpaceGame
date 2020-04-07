



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


g = new GravParticle({position: [1, 0], mass: 100, radius: 10});
g = new GravParticle({position: [0, 1], mass: 100, radius: 10});