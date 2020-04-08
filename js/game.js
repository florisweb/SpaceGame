
let PhysicsEngine;
let RenderEngine;
let InputHandler;

function _Game() {
  this.setup = function() {
    PhysicsEngine 	= new _PhysicsEngine();
    RenderEngine 	= new _RenderEngine();
    InputHandler 	= new _InputHandler();

    RenderEngine.update();
  }
	
}
