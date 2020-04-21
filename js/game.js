
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
    RenderEngine.update();

    setTimeout(function () {
      RenderEngine.camera.zoomTo(4);
      RenderEngine.camera.follow(PhysicsEngine.particles[Math.floor(PhysicsEngine.particles.length * Math.random())]);
    }, 10);

    // Server.init();
  }

  this.maxFps = 0;
  this.update = function() {
    let start = new Date();
    this.updates++;
    
    PhysicsEngine.update();

    this.maxFps = Math.round(1 / (new Date() - start) * 1000);

    if (!this.running) return;
  	requestAnimationFrame(function () {Game.update()});
    // setTimeout(function () {Game.update()}, 1000 / 60);
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





