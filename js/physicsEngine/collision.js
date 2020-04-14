
function _CollisionEngine() {
	this.settings = new function() {
		this.useCache = true;
		this.collisionVelocityTransfer = .5; // bouncyness
	}

	this.update = function() {}

	this.getCollisionVectors = function(_item) {
		let vectors = [];
		let particleCount = PhysicsEngine.particles.length;
		for (let i = 0; i < particleCount; i++) 
		{
			let curParticle = PhysicsEngine.particles[i]; 
			if (!curParticle || !curParticle.config.exerciseCollisions || !curParticle.mesh) continue;
			let curMesh = curParticle.mesh;

			if (_item.parent.position.difference(curParticle.position).getLength() > _item.meshRange + curMesh.meshRange) continue;
			if (_item.id == curMesh.id) continue;

			let vector = _item.innerMesh.getCollisionVector(curMesh);
			if (!vector) continue;
			
			vectors.push({
				vector: vector, 
				target: PhysicsEngine.particles[i].mesh
			});
		}
		
		return vectors;
	}
}













function CollisionParticle({mass, position, config = {}}, _meshFactory) {
	if (config.exerciseCollisions === undefined) config.exerciseCollisions = true;
	if (config.collisionSensitive === undefined) config.collisionSensitive = true;
	Particle.call(this, {position: position, mass: mass, config: config});

	this.mesh = _meshFactory(this);
	this.angle = 0;


	this.getCollisionData = function() {
		if (!config.collisionSensitive) return {
			positionCorrection: new Vector([0, 0]),
			vector: new Vector([0, 0])
		}

		let vectors = this.mesh.getCollisionVectors();

		if (vectors.length)
		{
			Fcollision = createCollisionAngleVector(vectors);

			let preventCollisionReaction = false;
			if (this.config.onCollision) try {// Handle onCollision-event
				preventCollisionReaction = this.config.onCollision.call(this, vectors, Fcollision);
			} catch (e) {};

			if (!preventCollisionReaction) return collisionHandler.call(this, vectors, Fcollision);
		}

		return {
			positionCorrection: new Vector([0, 0]),
			vector: new Vector([0, 0])
		}
	}

	function createCollisionAngleVector(_vectors) {
		let angleVector = new Vector([0, 0]);
		for (let v = 0; v < _vectors.length; v++)
		{
			angleVector.add(_vectors[v].vector);
		}
		return angleVector.setLength(.01 / PhysicsEngine.settings.roundError);// Small energy loss here
	}


	function collisionHandler(vectors, Fcollision) {
		let collisionAngle = Fcollision.getAngle();
		let positionCorrectionVector = new Vector([0, 0]);

		let velocityProjection1 = Fcollision.getProjection(this.velocity);
		let u1 = velocityProjection1.getLength() * (1 - (collisionAngle - velocityProjection1.getAngle()) / Math.PI * 2);

		for (let v = 0; v < vectors.length; v++)
		{
			let target = vectors[v].target.parent;
			
			let collisionPercentage = PhysicsEngine.formulas.calcMassInfluence(this.mass, target.mass);
			positionCorrectionVector.add(
				vectors[v].vector.copy().scale(1 - collisionPercentage)
			);

			let velocityProjection2 = Fcollision.getProjection(target.velocity);
			let u2 = velocityProjection2.getLength() * (1 - (collisionAngle - velocityProjection2.getAngle()) / Math.PI * 2);
			
			// Thank you buddy: https://en.wikipedia.org/wiki/Elastic_collision
			let deltaVelocity = (
									(this.mass - target.mass) / (this.mass + target.mass) * u1 
									+ 2 * target.mass / (this.mass + target.mass) * u2
								) - u1;
	
			let deltaVelocityVector = Fcollision.copy().setLength(deltaVelocity * CollisionEngine.settings.collisionVelocityTransfer);
		
			let FspeedChange = deltaVelocityVector.scale(-this.mass);
			Fcollision.add(FspeedChange);
		}

		positionCorrectionVector.scale(1 / vectors.length);

		return {
			positionCorrection: positionCorrectionVector.scale(-1),
			vector: Fcollision.scale(-1),
		}
	}
}






function MeshObject({meshFactory, offset}, _parent) {
	this.offset	= new Vector(offset);
	this.parent = _parent;
	this.id = newId();
	
	this.angle = 0;
	this.getAngle = function() {
		return this.parent.angle + this.angle;
	}

	this.getPosition = function() {
		return this.parent.position.copy().add(
			this.offset.copy().rotate(this.parent.angle)
		);
	}

	this.outerMesh = new OuterMesh({factory: meshFactory}, this);
	this.offset.add(this.outerMesh.calcCenterOfMassOffset());	
	this.meshRange = setMeshRange(this.outerMesh.lines);
	this.innerMesh = new InnerMesh(this.outerMesh, this);


	function setMeshRange(_lines) {
		let maxRange = 0;
		for (let i = 0; i < _lines.length; i++) 
		{
			let vector1 = _lines[i].offset.copy();
			let vector2 = vector1.copy().add(_lines[i].shape);
			let range1 = vector1.getLength();
			let range2 = vector2.getLength();
			let range = range1 > range2 ? range1 : range2;

			if (range < maxRange) continue;
			maxRange = range;
		}
		return maxRange;
	}

	this.getCollisionVectors = function() {
		return CollisionEngine.getCollisionVectors(this);
	}

	this.draw = function() {
		if (this.parent.config.exerciseCollisions) this.outerMesh.draw("#f00");
		this.innerMesh.draw("rgba(0, 0, 255, .5)");
	}
}








function OuterMesh({factory}, _meshObject) {
	this.mesh = _meshObject;
	this.lines = factory.call(this.mesh);

	this.draw = function(_color) {
		for (line of this.lines) line.draw(_color);
	}

	this.calcCenterOfMassOffset = function() {
		let curVector = new Vector([0, 0]); 
		let lengthTillNow = 0;
		for (let i = 0; i < this.lines.length; i++)
		{
			let curLength = this.lines[i].shape.getLength();;
			lengthTillNow += curLength;
			let perc = curLength / lengthTillNow;
			let delta = curVector.difference(
				this.lines[i].getPosition().add(this.lines[i].getShape().scale(.5))
			);
			curVector.add(delta.scale(perc));
		}
		return this.mesh.getPosition().difference(curVector).scale(-1);
	}
}




function InnerMesh(_outerMesh, _meshObject) {
	this.mesh = _meshObject;
	this.lines = createLines(this);

	this.draw = function(_color) {
		for (line of this.lines) line.draw(_color);
	}


	this.getCollisionVector = function(_meshObject) {
		let vector = new Vector([0, 0]);
		let collisions = this.getCollisions(_meshObject.outerMesh, true);
		if (collisions.length == 0) return false;
		
		for (let c = 0; c < collisions.length; c++) vector.add(collisions[c].collision);

		return vector.scale(1 / collisions.length);
	}


	this.getCollisions = function(_outerMesh, _inverted = true) {
		let meshPosition = this.mesh.parent.position.copy();
		let collisions = [];
		for (let l = 0; l < this.lines.length; l++)
		{
			let intersections = this.lines[l].getIntersectionsFromLineList(_outerMesh.lines);
			if (!intersections || !intersections.length) continue;																													// if (intersections.length > 1) console.warn("Problems sir:", intersections); !!!!!!!! TODO

			let collision = meshPosition.difference(intersections[0]);
			if (_inverted) 
			{
				collision.setLength(this.lines[l].shape.getLength() - collision.getLength());
			}

			collisions.push({
				line: this.lines[l],
				collision: collision
			})
		}

		return collisions;
	}



	function createLines(This) {
		const lineCount = 20;
		const anglePerLine = (2 * Math.PI) / lineCount;
		
		let lines = [];
		for (let a = 0; a < Math.PI * 2; a += anglePerLine) 
		{
			let newLine = new CollisionLine({
				offset: [0, 0],
				shape: new Vector([0, 0]).setAngle(a, This.mesh.meshRange).value
			}, This.mesh);
			lines.push(newLine);
		}
		return lines;
	}

	
	function setLineLength(This) {
		let collisions = This.getCollisions(This.mesh.outerMesh, false);
		for (let l = 0; l < collisions.length; l++)
		{
			collisions[l].line.shape.setLength(
				collisions[l].collision.add(This.mesh.offset).getLength()
			);
		}
	}
	setLineLength(this);
}


















function CollisionLine({offset, shape}, _meshObject) {
	this.offset 	= new Vector(offset);
	this.shape 	 	= new Vector(shape);
	this.mesh 		= _meshObject;

	this.getPosition = function() {
		return this.mesh.getPosition().copy().add(
			this.offset.copy().rotate(this.mesh.getAngle())
		);
	}
	this.getShape = function() {
		return this.shape.copy().rotate(this.mesh.getAngle());
	}

	this.getIntersectionsFromLineList = function(_lineList) {
		let intersections = [];
		for (let l = 0; l < _lineList.length; l++)
		{
			let intersection = this.getIntersection(_lineList[l]);
			if (!intersection) continue;
			intersections.push(intersection);
		}

		return intersections;
	}

	this.getIntersection = function(_line) {
		let a = this.getShape().getAngle();
		let b = _line.getShape().getAngle();
		let posA = this.getPosition();
		let posB = _line.getPosition();

		let intersectX = 	(
								Math.tan(a) * posA.value[0] 
								- Math.tan(b) * posB.value[0] 
								- posA.value[1] 
								+ posB.value[1]
							) / ( 
								Math.tan(a) - Math.tan(b)
							);
		let intersectY = 	(
								Math.tan(b) * posA.value[1]
								- Math.tan(a) * posB.value[1]
								+ (posB.value[0] - posA.value[0]) * Math.tan(a) * Math.tan(b)
							) / (
								Math.tan(b) - Math.tan(a)
							);
		if (
			!this.xOnDomain(intersectX) || !_line.xOnDomain(intersectX) ||
			!this.yOnDomain(intersectY) || !_line.yOnDomain(intersectY)
		) return false;

		return new Vector([
			intersectX,
			intersectY,
		]);
	}

	const marge = 0.0001;
	this.xOnDomain = function(_x) {
		let position = this.getPosition();
		let endX = position.copy().add(this.getShape()).value[0];
		let min = Math.min(position.value[0], endX);
		let max = Math.max(position.value[0], endX);
		return min - marge <= _x && _x <= max + marge;
	}
	this.yOnDomain = function(_y) {
		let position = this.getPosition();
		let endY = position.copy().add(this.getShape()).value[1];
		let min = Math.min(position.value[1], endY);
		let max = Math.max(position.value[1], endY);
		return min - marge <= _y && _y <= max + marge;
	}

	this.draw = function(_color) {
		RenderEngine.drawVector(this.getPosition().copy(), this.getShape().copy(), _color);
	}
}












function CollisionBox({diagonal}, _parent) {
	this.diagonal = new Vector(diagonal);
	
	function generateMesh() {
		return [
			new CollisionLine({offset: [0, 0], 						shape: [this.diagonal.value[0], 0]},	this),
			new CollisionLine({offset: [0, 0], 						shape: [0, this.diagonal.value[1]]}, 	this),
			new CollisionLine({offset: this.diagonal.copy().value, 	shape: [-this.diagonal.value[0], 0]},	this),
			new CollisionLine({offset: this.diagonal.copy().value, 	shape: [0, -this.diagonal.value[1]]},	this),
		];
	}

	MeshObject.call(this, {meshFactory: generateMesh, offset: [0, 0]}, _parent);
}


function CollisionCircle({radius, lineCount}, _parent) {
	this.radius = radius;
	
	function generateMesh() {
		let lines = [];

		const anglePerLine = (2 * Math.PI) / lineCount;
		const length = Math.sin(anglePerLine * .5) * this.radius * 2;
		
		for (let a = 0; a < Math.PI * 2; a += anglePerLine) 
		{
			let deltaPos = new Vector([0, 0]).setAngle(a, this.radius);
			let newLine = new CollisionLine({
				offset: deltaPos.value, 
				shape: new Vector([0, 0]).setAngle(a + (anglePerLine + Math.PI) * .5, length).value
			}, this);
			lines.push(newLine);
		}
		return lines;
	}

	MeshObject.call(this, {meshFactory: generateMesh, offset: [0, 0]}, _parent);
}