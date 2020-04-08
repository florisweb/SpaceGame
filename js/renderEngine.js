function _RenderEngine() {
	let HTML = {
		canvas: gameCanvas,
	}
	this.settings = new function() {
		this.renderVectors = false;
	}

	this.camera = new function() {
		this.size = new Vector([800, 600]); // canvas

		
		this.zoom = 1; // percent of the world you can see
		this.position = new Vector([0, 0]); // in world

		this.getWorldProjectionSize = function() {
			return this.size.copy().scale(this.zoom);
		}


		this.worldPosToCanvasPos = function(_position) {
			let rPos = this.position.difference(_position);
			return rPos.scale(1 / this.zoom);
		}
		
		this.inView = function(_particle) {
			let projSize = this.getWorldProjectionSize();
			let dPos = this.position.difference(_particle.position);
			if (dPos.value[0] < -_particle.radius || dPos.value[1] < -_particle.radius) return false;
			if (dPos.value[0] > projSize.value[0] + _particle.radius || dPos.value[1] > projSize.value[1] + _particle.radius) return false;
			return true;
		}
	} 

	
	const ctx = HTML.canvas.getContext("2d");
	ctx.constructor.prototype.circle = function(x, y, size) {
		if (size < 0) return;
		this.ellipse(
			x, 
			y, 
			size,
			size,
			0,
			0,
			2 * Math.PI
		);
	}


	let lastUpdate = new Date();
	this.update = function(_entities = []) {
		this.clearCanvas();
		this.drawWorldGrid();
		this.drawWorldBorders();

		for (let i = 0; i < _entities.length; i++)
		{
			this.drawEntity(_entities[i]);
		}

		let fps = 1 / ((new Date() - lastUpdate) / 1000);
		this.drawStatistics(fps);
		lastUpdate = new Date();
	}






	this.clearCanvas = function() {
		ctx.clearRect(0, 0, HTML.canvas.width, HTML.canvas.height);
	}


	this.drawWorldGrid = function() {
		const gridSize = 50 * Math.round(this.camera.zoom);
		ctx.strokeStyle = "#444";
		
		let cameraSize = this.camera.getWorldProjectionSize().value;
		
		for (let wx = this.camera.position.value[0]; wx <= cameraSize[0] + this.camera.position.value[0]; wx += gridSize)
		{
			let dx = wx - this.camera.position.value[0] % gridSize;
			let canvasPosA = this.camera.worldPosToCanvasPos(new Vector([
				dx, 
				this.camera.position.value[1]
			]));
			let canvasPosB = this.camera.worldPosToCanvasPos(new Vector([
				dx, 
				cameraSize[1] + this.camera.position.value[1]
			]));

			ctx.beginPath();
			ctx.moveTo(canvasPosA.value[0], canvasPosA.value[1]);
			ctx.lineTo(canvasPosB.value[0], canvasPosB.value[1]);
			ctx.closePath();
			ctx.stroke();
		}

		for (let wy = this.camera.position.value[1]; wy <= cameraSize[1] + this.camera.position.value[1]; wy += gridSize)
		{
			let dy = wy - this.camera.position.value[1] % gridSize;
			let canvasPosA = this.camera.worldPosToCanvasPos(new Vector([
				this.camera.position.value[0], 
				dy
			]));
			let canvasPosB = this.camera.worldPosToCanvasPos(new Vector([
				cameraSize[0] + this.camera.position.value[0], 
				dy
			]));

			ctx.beginPath();
			ctx.moveTo(canvasPosA.value[0], canvasPosA.value[1]);
			ctx.lineTo(canvasPosB.value[0], canvasPosB.value[1]);
			ctx.closePath();
			ctx.stroke();
		}
	}
	
	this.drawWorldBorders = function() {
		const borderThickness = 10000;
		ctx.fillStyle = "rgba(0, 0, 0, .2)";
		ctx.beginPath();

		fillRect(
			new Vector([-borderThickness, -borderThickness]),
			new Vector([PhysicsEngine.world.size.value[0] + borderThickness, 0])
		);

		fillRect(
			new Vector([-borderThickness, PhysicsEngine.world.size.value[1]]),
			new Vector([PhysicsEngine.world.size.value[0] + borderThickness, PhysicsEngine.world.size.value[1] + borderThickness])
		);

		fillRect(
			new Vector([-borderThickness, 0]),
			new Vector([0, PhysicsEngine.world.size.value[1]])
		);

		fillRect(
			new Vector([PhysicsEngine.world.size.value[0], 0]),
			new Vector([PhysicsEngine.world.size.value[0] + borderThickness, PhysicsEngine.world.size.value[1]])
		);

		ctx.fill();
	}

	function fillRect(_coordA, _coordB) {
		let canvasA = RenderEngine.camera.worldPosToCanvasPos(_coordA);
		let canvasB = RenderEngine.camera.worldPosToCanvasPos(_coordB);
		let size = canvasA.difference(canvasB);
		ctx.fillRect(canvasA.value[0], canvasA.value[1], size.value[0], size.value[1]);
	}



	this.drawEntity = function(_entity) {
		if (!this.camera.inView(_entity)) return false;
		let canvasPos = this.camera.worldPosToCanvasPos(_entity.position);

		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.circle(canvasPos.value[0], canvasPos.value[1], _entity.radius / this.camera.zoom);
		ctx.closePath();
		ctx.stroke();
	}

	this.drawVector = function(_startVector, _relativeVector, _color = "red") {
		let canStart = this.camera.worldPosToCanvasPos(_startVector);
		let canStop = this.camera.worldPosToCanvasPos(_startVector.add(_relativeVector));

		ctx.strokeStyle = _color;
		ctx.beginPath();
		ctx.moveTo(canStart.value[0], canStart.value[1]);
		ctx.lineTo(canStop.value[0], canStop.value[1]);
		ctx.closePath();
		ctx.stroke();
	}





	this.drawStatistics = function(_fps) {
		ctx.font = '16px calibri';
		ctx.fillStyle = "#f00";
		ctx.beginPath();
		ctx.fillText("Fps: " + Math.round(_fps * 10) / 10, 5, 20);
		ctx.closePath();
		ctx.fill();
	}












	


	
}