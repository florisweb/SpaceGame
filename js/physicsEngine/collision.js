
function _CollisionEngine() {
	this.collisionBoxes = [
		new CollisionBox({position: [80, 130], diagonal: [50, 80]}),
		new CollisionCircle({position: [100, 100], radius: 50, lineCount: 50}),
		new CollisionCircle({position: [160, 100], radius: 30, lineCount: 50}),
		new CollisionBox({position: [70, 30], diagonal: [30, 80]}),

		new CollisionBox({position: [170, 30], diagonal: [30, 80]}),
		new CollisionBox({position: [170, 10], diagonal: [50, 30]}),

	];

	this.draw = function() {
		for (item of this.collisionBoxes) item.draw();
	}


	this.drawIntersections = function() {
		for (item of this.collisionBoxes) 
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
		for (let i = 0; i < this.collisionBoxes.length; i++) 
		{
			if ( _item.id == this.collisionBoxes[i].id) continue;
			intersections = intersections.concat(_item.getIntersectionsByMesh(this.collisionBoxes[i]));
		}
		return intersections;
	}
}




function CollisionLine({position, shape}) {
	this.position 	= new Vector(position);
	this.shape 	 	= new Vector(shape);

	this.getIntersections = function(_line) {
		let a = this.shape.getAngle();
		let b = _line.shape.getAngle();

		let intersectX = 	(
								Math.tan(a) * this.position.value[0] 
								- Math.tan(b) * _line.position.value[0] 
								- this.position.value[1] 
								+ _line.position.value[1]
							) / ( 
								Math.tan(a) - Math.tan(b)
							);
		let intersectY = 	(
								Math.tan(b) * this.position.value[1]
								- Math.tan(a) * _line.position.value[1]
								+ (_line.position.value[0] - this.position.value[0]) * Math.tan(a) * Math.tan(b)
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
		let endX = this.position.copy().add(this.shape).value[0];
		let min = Math.min(this.position.value[0], endX);
		let max = Math.max(this.position.value[0], endX);
		return min - marge <= _x && _x <= max + marge;
	}
	this.yOnDomain = function(_y) {
		let endY = this.position.copy().add(this.shape).value[1];
		let min = Math.min(this.position.value[1], endY);
		let max = Math.max(this.position.value[1], endY);
		return min - marge <= _y && _y <= max + marge;
	}

	this.draw = function() {
		RenderEngine.drawVector(this.position.copy(), this.shape.copy());
	}
}



function CollisionMesh({position, factory}) {
	this.id = newId();
	this.position = new Vector(position);
	this.lines = factory.call(this);

	this.draw = function() {
		for (line of this.lines) line.draw();
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
}



function CollisionBox({position, diagonal}) {
	this.diagonal = new Vector(diagonal);
	
	function generateMesh() {
		return [
			new CollisionLine({position: this.position.copy().value, shape: [this.diagonal.value[0], 0]}),
			new CollisionLine({position: this.position.copy().value, shape: [0, this.diagonal.value[1]]}),
			new CollisionLine({position: this.position.copy().add(this.diagonal).value, shape: [-this.diagonal.value[0], 0]}),
			new CollisionLine({position: this.position.copy().add(this.diagonal).value, shape: [0, -this.diagonal.value[1]]}),
		];
	}

	CollisionMesh.call(this, {position: position, factory: generateMesh});
}

function CollisionCircle({position, radius, lineCount}) {
	this.radius = radius;
	
	function generateMesh() {
		let lines = [];

		const anglePerLine = (2 * Math.PI) / lineCount;
		const b = Math.PI / anglePerLine / 2;
		const length = Math.sin(anglePerLine * .5) * this.radius * 2;
		
		for (let a = 0; a < Math.PI * 2; a += anglePerLine) 
		{
			let deltaPos = this.position.copy().add(new Vector([0, 0]).setAngle(a, this.radius));
			let newLine = new CollisionLine({
				position: deltaPos.value, 
				shape: new Vector([0, 0]).setAngle(a + (anglePerLine + Math.PI) * .5, length).value
			});
			lines.push(newLine);
		}
		return lines;
	}

	CollisionMesh.call(this, {position: position, factory: generateMesh});
}
















function CollisionParticle({mass, position, config = {}}, _shapeFunction) {
	if (config.exerciseCollisions === undefined) config.exerciseCollisions = true;
	Particle.call(this, {position: position, mass: mass, config: config});
	let This = this;
	
	
	this.shapeFunction = _shapeFunction;
	this.minRadius = 0;
	this.maxRadius = this.radius;

	this.getCollisionVector = function(_Fres) {
		let vector = getCollisionVector();
		if (vector.getLength() == 0) return vector;

		let Fcollision = vector.getProjection(_Fres);		
		let FantiSpeed = 
				.5 * 
				this.mass * 
				Math.pow(vector.getProjection(this.velocity).getLength(), 2) * 
				PhysicsEngine.collision.settings.antiSpeedConstant;
		
		Fcollision.setLength(Fcollision.getLength() + FantiSpeed)

		return Fcollision.scale(-1);
	}


	
	const angleSteps = (2 * Math.PI) / PhysicsEngine.collision.settings.rays;
	function getCollisionVector() {
		let totalVector = new Vector([0, 0]);
		let activeRays = 0;
		for (let p = 0; p < PhysicsEngine.particles.length; p++)
		{
			let curParticle = PhysicsEngine.particles[p];
			if (!curParticle.config.exerciseCollisions) continue;
			if (This.position.difference(curParticle.position).getLength() > This.maxRadius + curParticle.maxRadius) continue;
			if (curParticle.id == This.id) continue;

			for (let a = -Math.PI; a < Math.PI; a += angleSteps)
			{
				for (let d = This.minRadius; d < This.maxRadius; d += PhysicsEngine.collision.settings.rayStepSize)
				{
					let relativeAngle = new Vector([0, 0]).setAngle(a, d);
					let position = This.position.copy().add(relativeAngle);
					if (!curParticle.shapeFunction(position)) continue;
					totalVector.add(relativeAngle);
					activeRays++;
					break;
				}
			}
		}
		
		if (activeRays == 0) return new Vector([0, 0]);
		return totalVector.scale(1 / activeRays);
	}




	this.applyGravitation = function() {
		let Fgrav = this.getFgrav();
		let Fres = Fgrav.copy();

		let a = Fres.scale(1 / this.mass);
		this.velocity.add(a);
		this.position.add(this.velocity);

		this.drawVectors(Fgrav, a.copy());
		return a;
	}

	this.getFgrav = function() {
		return PhysicsEngine.getTotalGravVector(this);
	}

	this.drawVectors = function(_Fgrav, _a) {
		if (!RenderEngine.settings.renderVectors) return;
		RenderEngine.drawVector(this.position.copy(), _Fgrav.scale(3), "#00f");
		RenderEngine.drawVector(this.position.copy(), this.velocity.copy().scale(30), "#f00");
		RenderEngine.drawVector(this.position.copy(), _a.scale(5000), "#fa0");
	}
}

