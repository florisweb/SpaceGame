function _PhysicsEngine() {
	this.world = {
		size: new Vector([2000, 2000])
	}
	this.constants = new function() {
		this.G = 6.674 * Math.pow(10, -11 + 6 + 1.5);
	}


	this.bodies = [];
	this.addBody = function(_body) {
		this.bodies.push(_body);
	}

	this.collision 	= new _PhysicsEngine_collision();
	this.gravity 	= new _PhysicsEngine_gravity();




	this.update = function() {
		this.removeBodiesOutsideWorld();

		this.gravity.update();
		this.collision.update();


		this.applyCalculations();
	}


	this.applyCalculations = function() {
		for (let s = 0; s < this.bodies.length; s++)
		{
			let cur = this.bodies[s];
			let a = cur.tempValues.force.scale(cur.massData.invMass);
			RenderEngine.drawVector(cur.position.copy(), a.copy().scale(1000), "#fa0");

			if (cur == sun) window.a = a.getLength();

			cur.velocity.add(a);
			if (cur == sun) window.v = cur.velocity.getLength();
			cur.position.add(cur.velocity);
			cur.position.add(cur.tempValues.positionOffset.scale(-1));

			cur.angularVelocity += cur.tempValues.torque * cur.massData.invInertia;
			cur.angle 			+= cur.angularVelocity;


			cur.tempValues.positionOffset = new Vector([0, 0]);
			cur.tempValues.force = new Vector([0, 0]);
			cur.tempValues.torque = 0;

			
			if (Game.updates % 20 != 0) continue;
			cur.positionTrace.push(cur.position.copy());
			if (cur.positionTrace.length > 200) cur.positionTrace = cur.positionTrace.splice(1, 200);
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
}



