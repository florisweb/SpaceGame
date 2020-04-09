
let PhysicsEngine;
let RenderEngine;
let InputHandler;
let Animator;

function _Game() {
  this.setup = function() {
    Animator = new _Animator();
    PhysicsEngine = new _PhysicsEngine();
    RenderEngine 	= new _RenderEngine();
    InputHandler 	= new _InputHandler();

    window.onresize();
    this.update();
  }

  this.update = function() {
  	RenderEngine.update(PhysicsEngine.particles);
    PhysicsEngine.update();
    Animator.update();

  	requestAnimationFrame(function () {Game.update()});
    // setTimeout(function () {Game.update()}, 1000);
  }
}



window.onresize = function() {
  gameCanvas.width = gameCanvas.offsetWidth;
  gameCanvas.height = gameCanvas.offsetHeight;
  RenderEngine.camera.size = new Vector([
    gameCanvas.width,
    gameCanvas.height
  ]);


}