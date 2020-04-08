
let PhysicsEngine;
let RenderEngine;
let InputHandler;

function _Game() {
  this.setup = function() {
    PhysicsEngine = new _PhysicsEngine();
    RenderEngine 	= new _RenderEngine();
    InputHandler 	= new _InputHandler();

    this.update();
  }

  this.update = function() {
  	RenderEngine.update(PhysicsEngine.particles);
    PhysicsEngine.update();

  	requestAnimationFrame(function () {Game.update()});
  }
}
