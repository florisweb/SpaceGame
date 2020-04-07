
let PhysicsEngine;
let RenderEngine;

function _Game() {
  this.setup = function() {
    PhysicsEngine = new _PhysicsEngine();
    RenderEngine = new _RenderEngine();
  }
	
}
