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
		
		const worldMarge = 20;
		this.inView = function(_particle) {
			let marge = worldMarge + _particle.radius;
			let projSize = this.getWorldProjectionSize();
			let dPos = this.position.difference(_particle.position);
			if (dPos.value[0] < -marge || dPos.value[1] < -marge) return false;
			if (dPos.value[0] > projSize.value[0] + marge || dPos.value[1] > projSize.value[1] + marge) return false;
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
		const gridSize = 50;
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