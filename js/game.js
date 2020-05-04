
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
      // RenderEngine.camera.follow(PhysicsEngine.particles[Math.floor(PhysicsEngine.particles.length * Math.random())]);
      RenderEngine.camera.follow(PhysicsEngine.bodies[0]);
    }, 10);

    // Server.init();
  }

  this.maxFps = 0;
  let prevFrame = new Date();
  this.update = function() {
    this.updates++;

    let dt = new Date() - prevFrame;
    this.maxFps = Math.round(1000 / dt);

    let performance = dt / (1000 / fps);
    if (performance < 1 || performance > 50) performance = 1;
    window.performance = performance;
    
    PhysicsEngine.update(performance);

    if (!this.running) return;    

    let nextFrame = 1000 / fps - dt;
    window.nextFrame = nextFrame;
    setTimeout(function () {Game.update()}, nextFrame);
    prevFrame = new Date();
  }










  this.editBody = false;
  
  let startPosition;

  this.handleBuildClick = function(_position) {
    if (!this.editBody) {startPosition = false; return false;}
    if (this.editBody.constructor.name != "BodyGroup") {this.editBody = false; return false;}
    
    if (!startPosition)
    {
      startPosition = this.editBody.position.difference(_position);
      this.startPosition = startPosition;
      return;
    }

    
    let stopPosition = this.editBody.position.difference(_position);
    let delta = startPosition.difference(stopPosition);

    let angle = delta.getAngle();
    let shape = new Vector([delta.getLength(), 2]);
    let offset = startPosition.add(delta.copy().scale(.5)).rotate(this.editBody.angle);

  
    
    let lineBody = new Body({
      position: offset.value,
      shapeFactory: function(_this) {
        return [
          new Box({
            offset: [0, 0],
            shape: shape.scale(.5).value,
            angle: angle - Game.editBody.angle,
          }, _this)
        ]
      },
      config: {
        gravitySensitive: true,
        exerciseGravity: false,
      }
    });


    
    this.editBody.addBody(lineBody);
    startPosition = false;
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





