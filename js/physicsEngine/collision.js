/*new CollisionBox({position: [80, 130], diagonal: [50, 80]}),
		new CollisionCircle({position: [100, 100], radius: 50, lineCount: 50}),
		new CollisionCircle({position: [160, 100], radius: 30, lineCount: 50}),
		new CollisionBox({position: [70, 30], diagonal: [30, 80]}),

		new CollisionBox({position: [170, 30], diagonal: [30, 80]}),
		new CollisionBox({position: [170, 10], diagonal: [50, 30]}),*/

function _CollisionEngine() {
	this.collisionParticles = [];
	this.settings = new function() {
		this.antiSpeedConstant = .5;
	}


	this.draw = function() {
		for (item of this.collisionParticles) item.draw();
	}

	this.addCollisionParticle = function(_collisionBox) {
		this.collisionParticles.push(_collisionBox);
	}


	this.drawIntersections = function() {
		for (item of this.collisionParticles) 
		{
			let intersections = this.getIntersections(item);
			for (intersection  of intersections)
			{
				RenderEngine.drawVector(intersection, new Vector([10, 0]), "#0f0");
			}
		}
	}

	
	this.getIntersections = function(_item) {
		let intersections = [];
		for (let i = 0; i < this.collisionParticles.length; i++) 
		{
			let curParticle = this.collisionParticles[i]; 
			if (_item.id == curParticle.id) continue;
			
			if (_item.parent.position.difference(curParticle.parent.position).getLength() > _item.meshRange + curParticle.meshRange) continue;
			intersections = intersections.concat(_item.getIntersectionsByMesh(curParticle));
		}
		return intersections;
	}
}




function CollisionLine({offset, shape}, _parent) {
	this.offset 	= new Vector(offset);
	this.shape 	 	= new Vector(shape);
	this.parent 	= _parent;

	this.getPosition = function() {
		return this.parent.position.copy().add(this.offset);
	}

	this.getIntersections = function(_line) {
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

		return [new Vector([
			intersectX,
			intersectY,
		])];
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

	this.draw = function() {
		RenderEngine.drawVector(this.getPosition().copy(), this.shape.copy());
	}
}



function CollisionMesh({factory}, _parent) {
	this.id = newId();
	this.lines = factory.call(this);
	this.parent = _parent;
	this.meshRange = setMeshRange(this.lines);

	this.draw = function() {
		for (line of this.lines) line.draw();
	}

	function setMeshRange(_lines) {
		let maxRange = 0;
		for (let i = 0; i < _lines.length; i++) 
		{
			let vector = _lines[i].offset.copy().add(_lines[i].shape);
			let range = vector.getLength();
			if (range < maxRange) continue;
			maxRange = range;
		}
		return maxRange;
	}
	
	this.getIntersectionsByLine = function(_line) {
		let intersections = [];
		for (let l = 0; l < this.lines.length; l++)
		{
			let intersection = this.lines[l].getIntersections(_line);
			if (!intersection) continue;
			intersections.push(intersection[0]);
		}
		return intersections;
	}
	this.getIntersectionsByMesh = function(_mesh) {
		let intersections = [];
		for (let l = 0; l < _mesh.lines.length; l++)
		{
			let result = this.getIntersectionsByLine(_mesh.lines[l]);
			intersections = intersections.concat(result);
		}
		return intersections;
	}

	this.getCollisionVector = function() {
		let intersections = CollisionEngine.getIntersections(this);
		let collisionVector = new Vector([0, 0]);
		if (intersections.length == 0) return collisionVector;

		for (let i = 0; i < intersections.length; i++)
		{
			let relativePos = this.parent.position.difference(intersections[i]);
			collisionVector.add(relativePos);
		}

		return collisionVector.scale(1 / intersections.length).scale(1);
	}
}







function CollisionBox({position, diagonal}, _parent) {
	this.diagonal = new Vector(diagonal);
	
	function generateMesh() {
		return [
			new CollisionLine({offset: [0, 0], 						shape: [this.diagonal.value[0], 0]},	_parent),
			new CollisionLine({offset: [0, 0], 						shape: [0, this.diagonal.value[1]]}, 	_parent),
			new CollisionLine({offset: this.diagonal.copy().value, 	shape: [-this.diagonal.value[0], 0]},	_parent),
			new CollisionLine({offset: this.diagonal.copy().value, 	shape: [0, -this.diagonal.value[1]]},	_parent),
		];
	}

	CollisionMesh.call(this, {position: position, factory: generateMesh}, _parent);
}

function CollisionCircle({position, radius, lineCount}, _parent) {
	this.radius = radius;
	
	function generateMesh() {
		let lines = [];

		const anglePerLine = (2 * Math.PI) / lineCount;
		const b = Math.PI / anglePerLine / 2;
		const length = Math.sin(anglePerLine * .5) * this.radius * 2;
		
		for (let a = 0; a < Math.PI * 2; a += anglePerLine) 
		{
			let deltaPos = new Vector([0, 0]).setAngle(a, this.radius);
			let newLine = new CollisionLine({
				offset: deltaPos.value, 
				shape: new Vector([0, 0]).setAngle(a + (anglePerLine + Math.PI) * .5, length).value
			}, _parent);
			lines.push(newLine);
		}
		return lines;
	}

	CollisionMesh.call(this, {position: position, factory: generateMesh}, _parent);
}













function CollisionParticle({mass, position, config = {}}, _meshFactory) {
	if (config.exerciseCollisions === undefined) config.exerciseCollisions = true;
	Particle.call(this, {position: position, mass: mass, config: config});
	
	this.collisionMesh = _meshFactory(this);
	CollisionEngine.addCollisionParticle(this.collisionMesh);

	this.getCollisionVector = function(_Fres) {
		let vector = this.collisionMesh.getCollisionVector();
		if (vector.getLength() == 0) return vector;

		// vector.scale(this.mass / 1);

		let antiFres = vector.getProjection(_Fres);
		vector.add(antiFres);


		let velocityComponent = vector.getProjection(this.velocity);
		if (velocityComponent.getAngle() - vector.getAngle() == 0) // ?????
		{
			let FantiSpeed = 
					.5 * 
					this.mass * 
					Math.pow(velocityComponent.getLength(), 2) * 
					CollisionEngine.settings.antiSpeedConstant;

			vector.setLength(vector.getLength() + FantiSpeed);
		}

		return vector.scale(-1);
	}
}







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

