
function Body({position, shapeFactory, config = {}}) {
	let body = this;
	this.config = config;

	this.angle 				= 0;
	this.angularVelocity 	= .0;

	this.position 			= new Vector(position);
	this.velocity 			= new Vector([0, 0]);

	this.positionTrace 		= [];

	this.tempValues = {
		force: new Vector([0, 0]),
		positionOffset: new Vector([0, 0]),
		torque: 0
	}


	this.shape = new Body_Shape(this, shapeFactory);
	this.material = {
		density: .1,
		restitution: .0, //.25
		staticFriction: .4,
		dynamicFriction: .25,
	}

	this.massData = new function() {
		this.mass = 100;
		this.invMass = .01;

		this.inertia = 1000000;
		this.invInertia = 1 / this.inertia;

		
		this.recalcMass = function() {
			this.mass = body.shape.calcMass();
			this.invMass = 1 / this.mass;
		}
		this.recalcInertia = function() {
			this.inertia = body.shape.calcInertia();
			this.invInertia = 1 / this.inertia;
		}
	}


	this.shape.updateCenterOfMass(this.shape.getCenterOfMass());
	this.shape.calcShapeRange();
	this.massData.recalcMass();
	this.massData.recalcInertia();
}



function Body_Shape(_parent, _shapeFactory) {
	this.parent = _parent;
	this.list = _shapeFactory(this);
	this.shapeRange = 0;

	let This = this;



	this.getPosition = function() {
		return this.parent.position.copy();
	}
	this.getAngle = function() {
		return this.parent.angle;
	}

	
	this.getCollisionData = function(_targetShape) {
		let collisions = [];

		let delta = this.getPosition().difference(_targetShape.getPosition());
		let squareDistance = Math.pow(delta.value[0], 2) + Math.pow(delta.value[1], 2) 
		if (squareDistance > Math.pow(this.shapeRange + _targetShape.shapeRange, 2)) return collisions;

		for (let s = 0; s < this.list.length; s++)
		{
			let self = this.list[s];
			for (let t = 0; t < _targetShape.list.length; t++)
			{
				let target = _targetShape.list[t];

				let collider = PhysicsEngine.collision.collides(self, target);
				if (!collider) continue;

				collisions.push(collider);
			}
		}

		return collisions;
	}



	this.draw = function() {
		// let position = this.getPosition();
		// let size = 3;
		// ctx.fillStyle = "#00f";
		// ctx.beginPath();
		// ctx.fillRect(position.value[0] - size, position.value[1] - size, size * 2, size * 2);
		// ctx.closePath();
		// ctx.fill();

		// ctx.circle({
		// 	radius: this.shapeRange,
		// 	getPosition: function () {return This.getPosition()}
		// });

		if (RenderEngine.settings.renderVectors) RenderEngine.drawVector(this.getPosition(), this.parent.velocity.copy().scale(15), "#f00");


		for (let i = 0; i < this.list.length; i++) this.list[i].draw();
	}


	this.calcInertia = function() {
		let inertia = 0;
		for (let i = 0; i < this.list.length; i++) 
		{
			inertia += this.list[i].getInertia(calcMassPerItem(this.list[i], this.parent.material.density));
		}

		return inertia;
	}


	this.calcMass = function() {
		let mass = 0;
		for (let i = 0; i < this.list.length; i++) mass += calcMassPerItem(this.list[i], this.parent.material.density);
		return mass;
	}


	let prevCenterOfMass = new Vector([0, 0]);
	this.updateCenterOfMass = function(_centerOfMass) {
		for (let i = 0; i < this.list.length; i++)
		{
			this.list[i].offset.add(prevCenterOfMass.difference(_centerOfMass).scale(-1));
		}

		prevCenterOfMass = _centerOfMass;
	}

	this.getCenterOfMass = function() {
		let offset = new Vector([0, 0]);
		let massTillNow = 0;

		for (let i = 0; i < this.list.length; i++)
		{
			let cMass = calcMassPerItem(this.list[i], this.parent.material.density);
			massTillNow += cMass;
			let perc = cMass / massTillNow;

			let delta = offset.difference(this.list[i].offset);
			offset.add(delta.scale(perc));
		}

		return offset;
	}

	this.calcShapeRange = function() {
		this.shapeRange = 0;
		for (let i = 0; i < this.list.length; i++)
		{
			let type = this.list[i].constructor.name;
			let range = this.list[i].offset.getLength();
			if (type == "Box") 
			{
				range += this.list[i].shape.getLength();
			} else {
				range += this.list[i].radius;
			}	
			
			if (range < this.shapeRange) continue;
			this.shapeRange = range;
		}
	}



	function calcMassPerItem(_item, _density) {
		return _item.getVolume() * _density;
	}
}



function Body_Shape_item({offset}, _parent) {
	this.parent = _parent;
	this.offset = new Vector(offset);
	
	this.getPosition = function() {
		let angle = this.parent.getAngle();
		return this.parent.getPosition().add(this.offset.copy().rotate(angle));
	}
}

function Circle({radius, offset}, _parent) {
	Body_Shape_item.call(this, {offset: offset}, _parent);

	this.radius = radius;
	this.meshRange = this.radius;

	this.getProjectionDomain = function(_axis) {
		let projPos = this.getPosition().dotProduct(_axis);

		return [
			projPos - this.radius,
			projPos + this.radius
		];
	}
	this.draw = function() {
		RenderEngine.drawCircle(this);
	}
	
	this.getVolume = function() {
		// return Math.PI * Math.pow(this.radius, 2);
		return 4 / 3 * Math.PI * Math.pow(this.radius, 3);
	}

	this.getInertia = function(_mass) {
		let ownInertia = _mass * Math.pow(this.radius, 2);
		return ownInertia + _mass * this.offset.getLength();
	}
}





function Box({offset, shape, angle = 0}, _parent) {
	Body_Shape_item.call(this, {offset: offset}, _parent);

	this.shape = new Vector(shape);
	this.meshRange = this.shape.getLength();
	this.angle = angle;

	this.getAngle = function() {
		return this.parent.getAngle() + this.angle;
	}


	this.getPoints = function() {
		let position 	= this.getPosition();
		let angle 		= this.getAngle();

		let topLeft 	= position.copy().add(this.shape.copy().scale(-1).rotate(angle));
		let bottomRight = position.copy().add(this.shape.copy().rotate(angle));

		let dTR = new Vector([this.shape.value[0], 0]).scale(2).rotate(angle);
		let topRight = topLeft.copy().add(dTR);
		let bottomLeft = bottomRight.copy().add(dTR.scale(-1));
		return [topLeft, topRight, bottomRight, bottomLeft];
	}

	this.getProjectedPoints = function(_projector) {
		let ownPoints = this.getPoints();
		let min = {value: Infinity, point: false};
		let max = {value: -Infinity, point: false};

		for (let i = 0; i < ownPoints.length; i++)
		{
			let value = _projector.dotProduct(ownPoints[i]);
			if (value > max.value) {max.value = value; max.point = ownPoints[i];}
			if (value < min.value) {min.value = value; min.point = ownPoints[i];}
		}
		
		return {
			min: min,
			max: max
		};
	}

	this.draw = function() {
		RenderEngine.drawBox(this);
	}

	this.getVolume = function() {
		return this.shape.value[0] * this.shape.value[1] * this.shape.value[1] * 8;
	}

	this.getInertia = function(_mass) {
		let w = this.shape.value[0] * 2;
		let h = this.shape.value[1] * 2;
		
		let ownInertia = 1 / 12 * _mass * (w * w + h * h);
		return ownInertia + _mass * Math.pow(this.offset.getLength(), 2);
	}
}

