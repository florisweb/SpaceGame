

function _Builder() {
  this.settings = {
    maxLineLength: 100,
  }



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


  this.curHoverPoint;
  this.handleMouseMove = function(_position) {
    if (!this.buildBody) return;
    this.curHoverPoint = this.getClosestBuildPoint(_position);

    if (!this.startPosition) return;
    let pos = this.buildBody.position.difference(_position);
    let delta = this.startPosition.difference(pos);
    
    if (delta.getLength() > this.settings.maxLineLength) delta.setLength(this.settings.maxLineLength);
    this.stopPosition = this.startPosition.copy().add(delta);
  }


  this.getClosestBuildPoint = function(_position) {
    let minDistance = Infinity;
    let points = this.getBuildPoints();
    let closestPoint = false;
    if (!points) return false;

    for (let i = 0; i < points.length; i++)
    {
      let delta = _position.difference(points[i]);
      let distance = Math.pow(_position.value[0], 2) + Math.pow(_position.value[1], 2);
      if (distance > minDistance) continue;
      distance = minDistance;
      closestPoint = points[i];
    }
    
    return closestPoint;
  }

  this.getBuildPoints = function() {
    if (!this.buildBody) return;
    let points = [];
    let items = this.buildBody.shape.getList();
    for (let i = 0; i < items.length; i++)
    {
      if (!items[i].getBuildPoints) continue;
      let newPoints = items[i].getBuildPoints();
      points = points.concat(newPoints);
    }
    return points;
  }
}





function BuildLine({offset, length, angle}, _parent) {
  this.length = length;
  this.width = 4;
 
  Box.call(this, {
    offset: offset, 
    shape: [length / 2, this.width / 2], 
    angle: angle
  }, _parent);


  this.draw = function() {
    RenderEngine.drawBox(this);
  }

  this.getBuildPoints = function() {
    let points = this.getPoints();
    return [
      points[0],
      points[2]
    ];
  }
}


