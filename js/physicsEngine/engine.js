
const fps = 60;


function _PhysicsEngine() {
	this.world = {
		size: new Vector([20000, 20000])
	}
	this.constants = new function() {
		this.G = 6.674 * Math.pow(10, -11 + 7);
	}


	this.debugMomentum = 0;
	this.debugAngularMomentum = 0;


	this.bodies = [];
	this.addBody = function(_body) {
		this.bodies.push(_body);
	}

	this.collision 	= new _PhysicsEngine_collision();
	this.gravity 	= new _PhysicsEngine_gravity();


	const dt = 1000 / fps;
	let lastUpdate = new Date();
	let accumulator = 0;
	let maxAccumulator = dt * 5;

	this.update = function(_dt) {
		this.removeBodiesOutsideWorld();
		
		this.updateBodies(_dt);
		this.gravity.update();
		this.collision.update();

		this.applyCalculations(_dt);
	}

	this.applyCalculations = function(_dt, _list = this.bodies) {
		this.debugMomentum = 0;
		this.debugAngularMomentum = 0;
		for (let s = 0; s < _list.length; s++)
		{
			let cur = _list[s];

			let angle = 0;
			if (cur.parent) angle = cur.parent.getAngle();
			let force = cur.tempValues.force.rotate(-angle);
			let positionOffset = cur.tempValues.positionOffset.rotate(-angle);


			let a = force.scale(cur.massData.invMass * _dt);
			if (RenderEngine.settings.renderVectors) RenderEngine.drawVector(cur.position.copy(), a.copy().scale(1000), "#fa0");

			cur.velocity.add(a);
			cur.position.add(cur.velocity.copy().scale(_dt));
			cur.position.add(positionOffset.scale(-1));

			this.debugMomentum +=  cur.velocity.getLength() * cur.massData.mass;
			this.debugAngularMomentum += Math.abs(cur.angularVelocity) / cur.massData.invInertia;

			cur.angularVelocity += cur.tempValues.torque * cur.massData.invInertia * _dt;
			cur.angle 			+= cur.angularVelocity * _dt;


			cur.tempValues.positionOffset = new Vector([0, 0]);
			cur.tempValues.force = new Vector([0, 0]);
			cur.tempValues.torque = 0;

			
			if (Game.updates % 20 != 0) continue;
			cur.positionTrace.push(cur.position.copy());
			if (cur.positionTrace.length > 500) cur.positionTrace = cur.positionTrace.splice(1, 500);
		}
	}

	this.removeBodiesOutsideWorld = function() {
		for (let s = this.bodies.length - 1; s >= 0; s--)
		{
			let cur = this.bodies[s];
			if (
				cur.position.value[0] + cur.shape.shapeRange > 0 &&
				cur.position.value[0] - cur.shape.shapeRange < this.world.size.value[0] &&
				cur.position.value[1] + cur.shape.shapeRange > 0 &&
				cur.position.value[1] - cur.shape.shapeRange < this.world.size.value[1]
			) continue;
			let body = this.bodies.splice(s, 1)[0];
		}
	}

	this.updateBodies = function(_dt) {
		for (let i = 0; i < this.bodies.length; i++)
		{
			if (!this.bodies[i].update) continue;
			try {
				this.bodies[i].update(_dt);
			} catch(e) {}
		}
	}
}



