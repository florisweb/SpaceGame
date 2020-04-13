
let PhysicsEngine;
let RenderEngine;
let InputHandler;
let Animator;

function _Game() {
  this.updates = 0;
  this.running = true;

  this.setup = function() {
    Animator = new _Animator();
    PhysicsEngine = new _PhysicsEngine();
    RenderEngine 	= new _RenderEngine();
    InputHandler 	= new _InputHandler();

    window.onresize();
    this.update();
  }

  this.maxFps = 0;
  this.update = function() {
    let start = new Date();
    this.updates++;
  	RenderEngine.update(PhysicsEngine.particles);
    PhysicsEngine.update();
    Animator.update();

    this.maxFps = Math.round(1 / (new Date() - start) * 1000);


    if (!this.running) return;
  	requestAnimationFrame(function () {Game.update()});
    // setTimeout(function () {Game.update()}, 50);
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





