

function _Builder() {
  this.settings = {
    maxLineLength: 100,
    maxBuildPointHoverDistance: Math.pow(10, 2) // squared
  }



  this.buildBody = false;
  this.building = false;

  this.startPosition  = false;
  this.startBody      = false;
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


  this.handleClick = function(_position, _body) {
    if (!this.buildBody) return;

    let closest = this.getClosestBuildPoint(_position);
    if (!this.startPosition)
    {
      if (!closest) return;

      this.startPosition = this.buildBody.getPosition().difference(closest.point);
      this.stopPosition = this.startPosition.copy();
      this.startBody = _body;
      this.building = true;
      return;
    }
    console.log(this.buildBody.getPosition(), closest);
    if (closest.point) this.stopPosition = this.buildBody.getPosition().difference(closest.point);
    buildBody(closest.target);
    
    let stop = Builder.stopPosition.copy();
    this.cancelBuild();
    
    this.handleClick(stop.add(this.buildBody.getPosition()));
  }


  function buildBody(_target) {
    let delta = Builder.startPosition.difference(Builder.stopPosition);
    console.log(_target);
    // Max the length
    let length = delta.getLength();
    if (length > Builder.settings.maxLineLength) 
    {
      length = Builder.settings.maxLineLength;
      delta.setLength(length);
    }


    let shape = new Vector([length, 5]);

    let angle = delta.getAngle();
    let offset = Builder.startPosition.add(delta.copy().scale(.5)).rotate(-Builder.buildBody.angle);


    let configShape = {
                        offset: [0, 0],
                        length: shape.getLength(),
                        angle: angle - Builder.buildBody.angle,
                      };


    let config = {
      position: offset.value,
      shapeFactory: function(_this) {
        return [new BuildLine(configShape, _this)];
      },
      config: {
        gravitySensitive: false,
        exerciseGravity: false,
        buildItem: {
          type: 0,
        },
      }
    };

    let lineBody = new Body(config);
    lineBody.material.restitution = 0;
    if (_target)
    {
      _target.parent.addShape(
        new BuildLine(configShape, _target.parent)
      );
      console.log("Add shape");
      return;
    }
    
    console.log("Add bodygroup");
    
    let bodyGroup = new BodyGroup(config);
    bodyGroup.addBody(lineBody);
    Builder.buildBody.addBody(bodyGroup);
  }


  this.mousePos = new Vector([0, 0]);

  this.handleMouseMove = function(_position) {
    this.mousePos = _position.copy();
    if (!this.buildBody) return;

    if (!this.startPosition) return;
    let pos = this.buildBody.getPosition().difference(_position);
    let delta = this.startPosition.difference(pos);
    
    if (delta.getLength() > this.settings.maxLineLength) delta.setLength(this.settings.maxLineLength);
    this.stopPosition = this.startPosition.copy().add(delta);
  }


  this.getClosestBuildPoint = function(_position) {
    let minDistance = this.settings.maxBuildPointHoverDistance;
    let points = this.getBuildPoints();
    let closestPoint = false;
    let target = false;
    if (!points) return false;

    for (let i = 0; i < points.length; i++)
    {
      let delta = _position.difference(points[i]);
      let distance = Math.pow(delta.value[0], 2) + Math.pow(delta.value[1], 2);
      if (distance > minDistance) continue;
      distance = minDistance;
      closestPoint = points[i];
      target = points[i].target;
    }

    if (!closestPoint) return;
    return {point: closestPoint, target: target};
  }

  this.getBuildPoints = function() {
    if (!this.buildBody) return;
    let points = [];
    let items = this.buildBody.shape.getList();
    for (let i = 0; i < items.length; i++)
    {
      if (!items[i].getBuildPoints) continue;
      let newPoints = items[i].getBuildPoints();
      for (let p = 0; p < newPoints.length; p++) newPoints[p].target = items[i];
      points = points.concat(newPoints);
    }
    return points;
  }
}





function BuildLine({offset, length, angle}, _parent) {
  this.length = length;
  this.width = 2;
 
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


function BuildCircle({radius, offset}, _parent) {
  Circle.call(this, {radius: radius, offset: offset}, _parent);

  this.getBuildPoints = function() {
    if (!Builder.buildBody) return;
    let points = [];

    for (let a = -Math.PI; a < Math.PI; a += .1) 
    {
      let point = this.getPosition().add(new Vector([0, 1]).setAngle(a + Builder.buildBody.angle, this.radius));
      points.push(point);
    }
    return points;
  }
} 

