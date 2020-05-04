
function _PhysicsEngine_collision() {
	this.update = function(_list = PhysicsEngine.bodies) {
		for (let s = 0; s < _list.length; s++)
		{
			let self = _list[s].shape;
			for (let t = s + 1; t < _list.length; t++)
			{
				let target = _list[t].shape;
				let collisions = self.getCollisionData(target);
		
				for (let c = 0; c < collisions.length; c++) 
				{
					let resolveCollision = true;
					try {
						if (
							self.onCollision(collisions[c], collisions[c].self) || 
							target.onCollision(collisions[c], collisions[c].target)
						) resolveCollision = false;
					} catch (e) {};

					if (!resolveCollision) continue;

					this.resolveCollision(
						collisions[c],
						collisions[c].self.parent.parent,
						collisions[c].target.parent.parent
					);
				}
			}
		}
	}

	this.resolveCollision = function(collider, self, target) {
		// PositionOffset
		let massPerc = self.massData.mass / (self.massData.mass + target.massData.mass);
		let normal = collider.normal.copy().setLength(collider.depth);

		self.tempValues.positionOffset.add(normal.copy().scale(1 - massPerc));
		target.tempValues.positionOffset.add(normal.copy().scale(-massPerc));




		// Resolve collision - translation
		let deltaVelocity = self.velocity.difference(target.velocity);
		let relativeVelocity = -deltaVelocity.dotProduct(collider.normal);
		if (relativeVelocity < 0) return;

		let contactSelf = self.position.difference(collider.contactPoint);
		let contactTarget = target.position.difference(collider.contactPoint);


		let e = Math.min(self.material.restitution, target.material.restitution);	
		let j = -(1 + e) * relativeVelocity;

		j /= 
			self.massData.invMass + 
			target.massData.invMass + 
			self.massData.invInertia * Math.pow(collider.normal.dotProduct(contactSelf), 2) + 
			target.massData.invInertia * Math.pow(collider.normal.dotProduct(contactTarget), 2);
		

		let impulse = collider.normal.copy().scale(-j);

		let Fself = impulse.copy().scale(-1 + massPerc);
		let Ftarget = impulse.copy().scale(massPerc);

		self.tempValues.force.add(Fself);
		target.tempValues.force.add(Ftarget);

		self.tempValues.torque += -contactSelf.crossProduct(impulse);
		target.tempValues.torque += contactTarget.crossProduct(impulse);





		// Friction
		let tempSelfVelocity = self.velocity.copy().add(Fself.copy().scale(self.massData.invMass));					
		let tempTargetVelocity = target.velocity.copy().add(Ftarget.copy().scale(target.massData.invMass));

		let newRV = tempSelfVelocity.difference(tempTargetVelocity);

		let perpendicular = collider.normal.getPerpendicular();
		let tangent = perpendicular.scale(perpendicular.dotProduct(newRV));
		tangent.setLength(1);


		let jt = -newRV.dotProduct(tangent);
		jt /= self.massData.invMass + target.massData.invMass;


		let mu = (self.material.staticFriction + target.material.staticFriction) * .5;
		let frictionImpulse;
		if (Math.abs(jt) < -j * mu)
		{
			frictionImpulse = tangent.copy().scale(jt);
		} else {
			let dynamicFriction = (self.material.dynamicFriction + target.material.dynamicFriction) * .5;
			frictionImpulse = tangent.copy().scale(j * dynamicFriction);
		}
		

		self.tempValues.force.add(frictionImpulse.copy().scale(-1 + massPerc));
		target.tempValues.force.add(frictionImpulse.copy().scale(massPerc));
	}






	const jumpTable = {
		Box: {
			Box: boxBox,
			Circle: boxCircle 
		},
		Circle: {
			Box: circleBox,
			Circle: circleCircle
		}
	}


	this.collides = function(a, b) {
		let aPosition = a.getPosition();
		let bPosition = b.getPosition();

		let delta = aPosition.difference(bPosition);
		let squareDistance = Math.pow(delta.value[0], 2) + Math.pow(delta.value[1], 2);
		if (squareDistance > Math.pow(a.meshRange + b.meshRange, 2)) return;

		return jumpTable[a.constructor.name][b.constructor.name](a, b);
	}




	function boxBox(box1, box2) {
		let axisA = new Vector([0, 1]).setAngle(box1.getAngle()).setLength(1);
		let axisC = new Vector([0, 1]).setAngle(box2.getAngle()).setLength(1);
		let axis = [
			axisA,
			axisA.getPerpendicular(),
			axisC,
			axisC.getPerpendicular(),
		];

		let distance = box1.getPosition().difference(box2.getPosition()).getLength();

		let minDepth = -Infinity;
		let normalAxis = false;
		let direction = 1;
		let lastA = 0;
		let lastOwnDomain;
		let lastOtherDomain;
		for (let a = 0; a < 4; a++) 
		{
			let ownDomain = box1.getProjectedPoints(axis[a]);
			let otherDomain = box2.getProjectedPoints(axis[a]);

			let distanceA = ownDomain.min.value - otherDomain.max.value;
			let distanceB = otherDomain.min.value - ownDomain.max.value;
			let distance = Math.max(distanceA, distanceB);

			if (distance >= 0) return false;
				
			if (distance < minDepth) continue; 
			minDepth = distance;
			normalAxis = axis[a];
			lastA = a;
			lastOwnDomain = ownDomain;
			lastOtherDomain = otherDomain;

			if (distance == distanceA) {
				direction = -1;
			} else direction = 1;
		}
		
		let ownPoint = lastA > 1;
		let domain = lastOtherDomain;
		if (ownPoint) domain = lastOwnDomain;
	
		let contactPoint;
		if (direction == 1 - 2 * ownPoint) {
			contactPoint = domain.min.point;
		} else contactPoint = domain.max.point;
		
		return {
			normal: normalAxis.scale(direction),
			depth: -minDepth + .1,
			contactPoint: contactPoint,
			self: box1,
			target: box2
		};
	}

	function circleCircle(circle1, circle2) {
		let delta = circle1.getPosition().difference(circle2.getPosition());
		let distance = delta.getLength();
		if (distance > circle1.radius + circle2.radius) return false;
		let depth = circle1.radius + circle2.radius - distance;

		return {
			normal: delta.setLength(1),
			depth: depth,
			contactPoint: circle1.getPosition().add(delta.copy().setLength(circle1.radius + depth * .5)),
			self: circle1,
			target: circle2
		}
	}



	function boxCircle(box, circle) {
		let axisA = new Vector([0, 1]).setAngle(box.getAngle()).setLength(1);
		let points = box.getPoints();

		let axis = [
			axisA,
			axisA.getPerpendicular(),
		];

		// Find closest point on box
		let minDistance = Infinity;
		let minAxis;
		for (let i = 0; i < points.length; i++)
		{
			let delta = points[i].difference(circle.getPosition());
			let squareDistance = Math.pow(delta.value[0], 2) + Math.pow(delta.value[1], 2);

			if (squareDistance > minDistance) continue;
			minDistance = squareDistance;
			minAxis = delta.setLength(1);
		}
		axis.push(minAxis);

		let contactPoint = new Vector([100, 100]);

		let minDepth = -Infinity;
		let normalAxis = false;
		let direction = 1;
		let lastA = 0;
		for (let a = 0; a < axis.length; a++) 
		{
			let boxDomain = box.getProjectedPoints(axis[a]);
			let circleDomain = circle.getProjectionDomain(axis[a]);

			let distanceA = boxDomain.min.value - circleDomain[1];
			let distanceB = circleDomain[0] - boxDomain.max.value;
			let distance = Math.max(distanceA, distanceB);

			if (distance >= 0) return false;
				
			if (distance < minDepth) continue; 
			minDepth = distance;
			normalAxis = axis[a];
			lastA = a;

			if (distance == distanceA) {
				direction = -1;
			} else direction = 1;
		}
		
		let normal = normalAxis.scale(direction);
		contactPoint = circle.getPosition().add(normal.copy().scale(-circle.radius));

		return {
			normal: normal,
			depth: -minDepth,
			contactPoint: contactPoint,
			self: box,
			target: circle
		};
	}

	function circleBox(circle, box) {
		let result = boxCircle(box, circle);
		if (!result) return false;
		return {
			normal: result.normal.scale(-1),
			depth: result.depth,
			contactPoint: result.contactPoint,
			self: circle,
			target: box
		}
	}
}