
function _CollisionEngine() {
	this.collisionParticles = [];
	this.cache = [];
	

	this.settings = new function() {
		this.useCache = true;
		this.collisionBorderStartValue = .1;
	}

	this.update = function() {
		this.clearCache();
	}

	this.clearCache = function() {
		this.cache = [];
		this.cache.add = function(_aId, _bId, _value) {
			value = Object.assign([], _value);
			if (this[_aId + "-" + _bId]) {this[_aId + "-" + _bId] = value; return}
			this[_bId + "-" + _aId] = value;
		}
		this.cache.get = function(_aId, _bId) {
			if (this[_aId + "-" + _bId]) return this[_aId + "-" + _bId];
			return this[_bId + "-" + _aId];
		}
	}
	this.clearCache();


	this.draw = function() {
		for (item of this.collisionParticles) item.draw();
	}

	this.addCollisionParticle = function(_collisionParticle) {
		this.collisionParticles.push(_collisionParticle);
	}

	this.getCollisionVectors = function(_item) {
		let vectors = [];
		for (let i = 0; i < this.collisionParticles.length; i++) 
		{
			let curParticle = this.collisionParticles[i]; 
			if (_item.id == curParticle.id) continue;
			
			if (_item.parent.position.difference(curParticle.parent.position).getLength() > _item.meshRange + curParticle.meshRange) continue;

			let vector = _item.innerMesh.getCollisionVector(curParticle);
			if (!vector) continue;
			
			vectors.push({
				vector: vector, 
				target: this.collisionParticles[i]
			});
		}
		
		return vectors;

	}
	
	// this.getIntersections = function(_item) {
	// 	let intersections = [];
	// 	for (let i = 0; i < this.collisionParticles.length; i++) 
	// 	{
	// 		let curParticle = this.collisionParticles[i]; 
	// 		if (_item.id == curParticle.id) continue;
			
	// 		if (_item.parent.position.difference(curParticle.parent.position).getLength() > _item.meshRange + curParticle.meshRange) continue;
	// 		let subIntersect = this.cache.get(_item.id, curParticle.id);
	// 		if (!subIntersect || !this.settings.useCache) 
	// 		{
	// 			subIntersect = _item.getIntersectionsByMesh(curParticle);
	// 			if (this.settings.useCache) this.cache.add(_item.id, curParticle.id, subIntersect);
	// 		}

	// 		if (subIntersect.length == 0) continue;
	// 		for (let i = 0; i < subIntersect.length; i++) RenderEngine.drawVector(subIntersect[i].copy(), new Vector([2, 2]), "#0f0");
			
	// 		intersections.push({intersects: subIntersect, target: this.collisionParticles[i]})
	// 	}
		
	// 	return intersections;
	// }
}










function CollisionLine({offset, shape}, _meshObject) {
	this.offset 	= new Vector(offset);
	this.shape 	 	= new Vector(shape);
	this.mesh 		= _meshObject;

	this.getPosition = function() {
		return this.mesh.getPosition().copy().add(this.offset);
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
		let a = this.shape.getAngle();
		let b = _line.shape.getAngle();
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
		if (!this.xOnDomain(intersectX) || !_line.xOnDomain(intersectX)) return false;
		if (!this.yOnDomain(intersectY) || !_line.yOnDomain(intersectY)) return false;

		return new Vector([
			intersectX,
			intersectY,
		]);
	}

	const marge = 0.0001;
	this.xOnDomain = function(_x) {
		let position = this.getPosition();
		let endX = position.copy().add(this.shape).value[0];
		let min = Math.min(position.value[0], endX);
		let max = Math.max(position.value[0], endX);
		return min - marge <= _x && _x <= max + marge;
	}
	this.yOnDomain = function(_y) {
		let position = this.getPosition();
		let endY = position.copy().add(this.shape).value[1];
		let min = Math.min(position.value[1], endY);
		let max = Math.max(position.value[1], endY);
		return min - marge <= _y && _y <= max + marge;
	}

	this.draw = function(_color) {
		RenderEngine.drawVector(this.getPosition().copy(), this.shape.copy(), _color);
	}
}






// function CollisionMesh({factory, offset}, _parent) {
// 	this.id = newId();
// 	this.parent = _parent;
	
// 	this.lines = factory.call(this);
// 	this.offset = new Vector(offset);
// 	this.meshRange = setMeshRange(this.lines);

// 	this.draw = function() {
// 		for (line of this.lines) line.draw();
// 	}

// 	function setMeshRange(_lines) {
// 		let maxRange = 0;
// 		for (let i = 0; i < _lines.length; i++) 
// 		{
// 			let vector1 = _lines[i].offset.copy();
// 			let vector2 = vector1.copy().add(_lines[i].shape);
// 			let range1 = vector1.getLength();
// 			let range2 = vector2.getLength();
// 			let range = range1 > range2 ? range1 : range2;

// 			if (range < maxRange) continue;
// 			maxRange = range;
// 		}
// 		return maxRange;
// 	}
	
// 	this.getIntersectionsByLine = function(_line) {
// 		let intersections = [];
// 		for (let l = 0; l < this.lines.length; l++)
// 		{
// 			let intersection = this.lines[l].getIntersections(_line);
// 			if (!intersection) continue;
// 			intersections.push(intersection[0]);
// 		}
// 		return intersections;
// 	}
// 	this.getIntersectionsByMesh = function(_mesh) {
// 		let intersections = [];
// 		for (let l = 0; l < _mesh.lines.length; l++)
// 		{
// 			let result = this.getIntersectionsByLine(_mesh.lines[l]);
// 			intersections = intersections.concat(result);
// 		}
// 		return intersections;
// 	}

// 	this.getCollisionVectors = function() {
// 		let collisions = CollisionEngine.getIntersections(this);
// 		for (let t = 0; t < collisions.length; t++)
// 		{
// 			let curVector = new Vector([0, 0]);
// 			let curTarget = collisions[t];

// 			for (let i = 0; i < curTarget.intersects.length; i++)
// 			{
// 				curVector.add(curTarget.intersects[i]);
// 			}

// 			collisions[t].vector = curVector.scale(1 / curTarget.intersects.length);
// 			delete collisions[t].intersects;
// 		}
// 		return collisions;


// 		// let collisionVector = new Vector([0, 0]);
// 		// if (intersections.length == 0) return collisionVector;

// 		// for (let i = 0; i < intersections.length; i++)
// 		// {
// 		// 	let relativePos = this.parent.position.difference(intersections[i]);
// 		// 	let meshPercentage = relativePos.copy().setLength((this.meshRange - relativePos.getLength()) / this.meshRange + CollisionEngine.settings.collisionBorderStartValue);			
// 		// 	collisionVector.add(meshPercentage);
// 		// }

// 		// return new Vector([0, 0]);// collisionVector.scale(1 / intersections.length);
// 	}
// }

// function OuterCollisionMesh({factory, offset}, _parent) {
// 	this.parent = _parent;
	
// 	this.lines = factory.call(this);
// 	this.offset = new Vector(offset);
// 	this.meshRange = setMeshRange(this.lines);

// 	this.draw = function() {
// 		for (line of this.lines) line.draw();
// 	}

// 	function setMeshRange(_lines) {
// 		let maxRange = 0;
// 		for (let i = 0; i < _lines.length; i++) 
// 		{
// 			let vector1 = _lines[i].offset.copy();
// 			let vector2 = vector1.copy().add(_lines[i].shape);
// 			let range1 = vector1.getLength();
// 			let range2 = vector2.getLength();
// 			let range = range1 > range2 ? range1 : range2;

// 			if (range < maxRange) continue;
// 			maxRange = range;
// 		}
// 		return maxRange;
// 	}
	
// 	this.getIntersectionsByLine = function(_line) {
// 		let intersections = [];
// 		for (let l = 0; l < this.lines.length; l++)
// 		{
// 			let intersection = this.lines[l].getIntersections(_line);
// 			if (!intersection) continue;
// 			intersections.push(intersection[0]);
// 		}
// 		return intersections;
// 	}
// 	this.getIntersectionsByMesh = function(_mesh) {
// 		let intersections = [];
// 		for (let l = 0; l < _mesh.lines.length; l++)
// 		{
// 			let result = this.getIntersectionsByLine(_mesh.lines[l]);
// 			intersections = intersections.concat(result);
// 		}
// 		return intersections;
// 	}

// 	this.getCollisionVectors = function() {
// 		let collisions = CollisionEngine.getIntersections(this);
// 		for (let t = 0; t < collisions.length; t++)
// 		{
// 			let curVector = new Vector([0, 0]);
// 			let curTarget = collisions[t];

// 			for (let i = 0; i < curTarget.intersects.length; i++)
// 			{
// 				curVector.add(curTarget.intersects[i]);
// 			}

// 			collisions[t].vector = curVector.scale(1 / curTarget.intersects.length);
// 			delete collisions[t].intersects;
// 		}
// 		return collisions;


// 		// let collisionVector = new Vector([0, 0]);
// 		// if (intersections.length == 0) return collisionVector;

// 		// for (let i = 0; i < intersections.length; i++)
// 		// {
// 		// 	let relativePos = this.parent.position.difference(intersections[i]);
// 		// 	let meshPercentage = relativePos.copy().setLength((this.meshRange - relativePos.getLength()) / this.meshRange + CollisionEngine.settings.collisionBorderStartValue);			
// 		// 	collisionVector.add(meshPercentage);
// 		// }

// 		// return new Vector([0, 0]);// collisionVector.scale(1 / intersections.length);
// 	}
// }



function CollisionParticle({mass, position, config = {}}, _meshFactory) {
	if (config.exerciseCollisions === undefined) config.exerciseCollisions = true;
	Particle.call(this, {position: position, mass: mass, config: config});

	this.mesh = _meshFactory(this);
	CollisionEngine.addCollisionParticle(this.mesh);


	this.getCollisionData = function(_Fres) {
		let vectors = this.mesh.getCollisionVectors();

		let positionCorrectionVector = new Vector([0, 0]);
		let Fcollision = new Vector([0, 0]);
		

		if (vectors.length)
		{
			for (let v = 0; v < vectors.length; v++)
			{
				let collisionPercentage = PhysicsEngine.formulas.calcMassInfluence(this.mass, vectors[v].target.parent.mass);
				// console.log(collisionPercentage, this.id);

				positionCorrectionVector.add(
					vectors[v].vector.copy().scale(collisionPercentage)
				);

				Fcollision.add(vectors[v].vector);
			}

			positionCorrectionVector.scale(1 / vectors.length);

	
			Fcollision.add(Fcollision.getProjection(_Fres));

			let speed = Fcollision.getProjection(this.velocity);
			Fcollision.add(speed.scale(this.mass));
		}


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

	this.getPosition = function() {
		return this.parent.position.copy().add(this.offset);
	}

	this.outerMesh = new OuterMesh({factory: meshFactory}, this);
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
		this.outerMesh.draw("#f00");
		this.innerMesh.draw("rgba(0, 0, 255, .5)");
	}
}








function OuterMesh({factory}, _meshObject) {
	this.mesh = _meshObject;
	this.lines = factory.call(this.mesh);

	this.draw = function(_color) {
		for (line of this.lines) line.draw(_color);
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
		// let collisions = this.getCollisions(_meshObject.outerMesh);
		let collisions = this.getInvertedCollisions(_meshObject.outerMesh);
		if (collisions.length == 0) return false;
		
		for (let c = 0; c < collisions.length; c++)
		{
			vector.add(collisions[c].collision);
			RenderEngine.drawVector(collisions[c].collision.copy().add(this.mesh.getPosition()), new Vector([2, 2]), "#0f0");
		}

		return vector.scale(1 / collisions.length);
	}

	this.getInvertedCollisions = function(_outerMesh) {
		let collisions = this.getCollisions(_outerMesh);
		for (let l = 0; l < collisions.length; l++)
		{
			collisions[l].collision.setLength(collisions[l].line.shape.getLength() - collisions[l].collision.getLength());
		}
	
		return collisions;
	}


	this.getCollisions = function(_outerMesh) {
		let meshPosition = this.mesh.parent.position.copy();
		let collisions = [];
		for (let l = 0; l < this.lines.length; l++)
		{
			let intersections = this.lines[l].getIntersectionsFromLineList(_outerMesh.lines);
			if (!intersections || !intersections.length) continue;
																																			// if (intersections.length > 1) console.warn("Problems sir:", intersections); !!!!!!!! TODO
			let collision = meshPosition.difference(intersections[0]);
			collisions.push({
				line: this.lines[l],
				collision: collision
			})
		}

		return collisions;
	}



	function createLines(This) {
		const lineCount = 10;
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
		let collisions = This.getCollisions(This.mesh.outerMesh)
		for (let l = 0; l < collisions.length; l++)
		{
			collisions[l].line.shape.setLength(
				collisions[l].collision.add(This.mesh.offset).getLength()
			);
		}
	}
	setLineLength(this);
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

	MeshObject.call(this, {meshFactory: generateMesh, offset: this.diagonal.copy().scale(-.5).value}, _parent);
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













// function CollisionParticle({mass, position, config = {}}, _meshFactory) {
// 	if (config.exerciseCollisions === undefined) config.exerciseCollisions = true;
// 	Particle.call(this, {position: position, mass: mass, config: config});
	
// 	this.collisionMesh = _meshFactory(this);
// 	CollisionEngine.addCollisionParticle(this.collisionMesh);

// 	this.getCollisionVector = function() {
// 		let vectors = this.collisionMesh.getCollisionVectors();
// 		if (vectors.length == 0) return new Vector([0, 0]);
// 		console.log("vectors", vectors);
// 		for (let i = 0; i < vectors.length; i++) RenderEngine.drawVector(vectors[i].vector.copy(), new Vector([2, 2]), "#00f");




// 		// let deltaPixels = vectors.copy().scale(this.mesh.meshRange); // exact amount of pixels that has to be moved in order to seperate
// 		// console.log(deltaPixels);
// 		// this.position.add(deltaPixels.scale(-.5));

// 		// let antiFres = vector.getProjection(this.Fres);
// 		// vector.add(antiFres);
		
// 		// let velocityComponent = vector.getProjection(this.velocity);
// 		// if (velocityComponent.getAngle() - vector.getAngle() == 0)
// 		// {
// 		// 	let Ekin = 
// 		// 			.5 * 
// 		// 			this.mass * 
// 		// 			Math.pow(velocityComponent.getLength(), 2);
// 		// 	let Fkin = Ekin / this.mesh.meshRange;
// 		// 	vector.setLength(antiFres.getLength() + Fkin);
// 		// }

// 		return new Vector([0, 0]);
// 		// return vector.scale(-1);
// 	}
// }







// function CollisionParticle({mass, position, config = {}}, _shapeFunction) {
// 	if (config.exerciseCollisions === undefined) config.exerciseCollisions = true;
// 	Particle.call(this, {position: position, mass: mass, config: config});
// 	let This = this;
	
	
// 	this.shapeFunction = _shapeFunction;
// 	this.minRadius = 0;
// 	this.maxRadius = this.radius;

// 	this.getCollisionVector = function(_Fres) {
// 		let vector = getCollisionVector();
// 		if (vector.getLength() == 0) return vector;

// 		let Fcollision = vector.getProjection(_Fres);		
// 		let FantiSpeed = 
// 				.5 * 
// 				this.mass * 
// 				Math.pow(vector.getProjection(this.velocity).getLength(), 2) * 
// 				PhysicsEngine.collision.settings.antiSpeedConstant;
		
// 		Fcollision.setLength(Fcollision.getLength() + FantiSpeed)

// 		return Fcollision.scale(-1);
// 	}


	
// 	const angleSteps = (2 * Math.PI) / PhysicsEngine.collision.settings.rays;
// 	function getCollisionVector() {
// 		let totalVector = new Vector([0, 0]);
// 		let activeRays = 0;
// 		for (let p = 0; p < PhysicsEngine.particles.length; p++)
// 		{
// 			let curParticle = PhysicsEngine.particles[p];
// 			if (!curParticle.config.exerciseCollisions) continue;
// 			if (This.position.difference(curParticle.position).getLength() > This.maxRadius + curParticle.maxRadius) continue;
// 			if (curParticle.id == This.id) continue;

// 			for (let a = -Math.PI; a < Math.PI; a += angleSteps)
// 			{
// 				for (let d = This.minRadius; d < This.maxRadius; d += PhysicsEngine.collision.settings.rayStepSize)
// 				{
// 					let relativeAngle = new Vector([0, 0]).setAngle(a, d);
// 					let position = This.position.copy().add(relativeAngle);
// 					if (!curParticle.shapeFunction(position)) continue;
// 					totalVector.add(relativeAngle);
// 					activeRays++;
// 					break;
// 				}
// 			}
// 		}
		
// 		if (activeRays == 0) return new Vector([0, 0]);
// 		return totalVector.scale(1 / activeRays);
// 	}




// 	this.applyGravitation = function() {
// 		let Fgrav = this.getFgrav();
// 		let Fres = Fgrav.copy();

// 		let a = Fres.scale(1 / this.mass);
// 		this.velocity.add(a);
// 		this.position.add(this.velocity);

// 		this.drawVectors(Fgrav, a.copy());
// 		return a;
// 	}

// 	this.getFgrav = function() {
// 		return PhysicsEngine.getTotalGravVector(this);
// 	}

// 	this.drawVectors = function(_Fgrav, _a) {
// 		if (!RenderEngine.settings.renderVectors) return;
// 		RenderEngine.drawVector(this.position.copy(), _Fgrav.scale(3), "#00f");
// 		RenderEngine.drawVector(this.position.copy(), this.velocity.copy().scale(30), "#f00");
// 		RenderEngine.drawVector(this.position.copy(), _a.scale(5000), "#fa0");
// 	}
// }

