

function _Builder() {
  this.buildBody = false;
  this.building = false;

  this.startPosition  = false;
  this.stopPosition   = false;

  this.setBuildBody = function(_body) {
    if (!_body.config.buildable) return;
    this.buildBody = _body;
  }

  this.cancelBuild = function() {
    this.startPosition = false;
    this.stopPosition = false;
    this.building = false;
  }


  this.handleClick = function(_position) {
    if (!this.buildBody) return;

    if (!this.startPosition)
    {
      this.startPosition = this.buildBody.position.difference(_position);
      this.stopPosition = this.startPosition.copy();
      this.building = true;
      return;
    }

    buildBody();
    
    let stop = Builder.stopPosition.copy();
    this.cancelBuild();
    
    this.handleClick(stop.add(this.buildBody.position));
  }


  function buildBody() {
    let delta = Builder.startPosition.difference(Builder.stopPosition);

    let angle = delta.getAngle();
    let shape = new Vector([delta.getLength(), 5]);
    let offset = Builder.startPosition.add(delta.copy().scale(.5)).rotate(-Builder.buildBody.angle);

    let config = {
      position: offset.value,
      shapeFactory: function(_this) {
        return [
          new BuildLine({
            offset: [0, 0],
            length: shape.getLength(),
            angle: angle - Builder.buildBody.angle,
          }, _this)
        ]
      },
      config: {
        gravitySensitive: false,
        exerciseGravity: false,
        buildItem: {
          type: 0,

        }
      }
    };

    let lineBody = new Body(config);
    Builder.buildBody.addBody(lineBody);
  }


  this.handleMouseMove = function(_position) {
    if (!this.buildBody || !this.startPosition) return;
    this.stopPosition = this.buildBody.position.difference(_position);
  }
}





function BuildLine({offset, length, angle}, _parent) {
  this.length = length;
  Box.call(this, {
    offset: offset, 
    shape: [length / 2, 2], 
    angle: angle
  }, _parent);
}


