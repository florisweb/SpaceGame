
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
    // if (!this.editBody) {startPosition = false; return false;}
    // if (!startPosition)
    // {
    //   startPosition = this.editBody.position.difference(_position);
    //   return;
    // }

    
    // let stopPosition = this.editBody.position.difference(_position);
    // let start = new Vector([
    //   Math.min(stopPosition.value[0], startPosition.value[0]),
    //   Math.min(stopPosition.value[1], startPosition.value[1])
    // ]);
    // let stop = new Vector([
    //   Math.max(stopPosition.value[0], startPosition.value[0]),
    //   Math.max(stopPosition.value[1], startPosition.value[1])
    // ]);
    

    // let delta = start.difference(stop);
    // console.log(delta.value);

    // let angle = delta.getAngle();
    // let shape = new Vector([delta.getLength(), 2]);
    // let offset = startPosition.add(shape.scale(.5)).rotate(this.editBody.angle);

    // let box = new Box({
    //   offset: offset.value,
    //   shape: shape.value,
    //   angle: angle - this.editBody.angle,
    // }, this.editBody.shape);
    
    // this.editBody.shape.addShape(box);
    // startPosition = false;
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





