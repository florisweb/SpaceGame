function _RenderEngine() {
	let HTML = {
		canvas: gameCanvas,
	}
	this.settings = new function() {
		this.renderVectors = true;
	}

	this.camera = new function() {
		this.size = new Vector([800, 600]); // canvas
		
		this.zoom = 2.4; // percent of the camsize you can see
		this.position = new Vector([0, 0]); // in world

		let followEntity = false;
		this.follow = function(_entity) {
			followEntity = _entity;
			if (!followEntity) return;
			
			let rScreen = this.getWorldProjectionSize().scale(-.5);
			this.panTo(followEntity.position.copy().add(rScreen));
		}

		this.update = function() {
			if (!followEntity) return;
			if (panning) return;
			let rScreen = this.getWorldProjectionSize().scale(-.5);
			this.position = followEntity.position.copy().add(rScreen);
		}


		this.getWorldProjectionSize = function() {
			return this.size.copy().scale(this.zoom);
		}

		this.worldPosToCanvasPos = function(_position) {
			let rPos = this.position.difference(_position);
			return rPos.scale(1 / this.zoom);
		}
		this.canvasPosToWorldPos = function(_position) {
			let rPos = _position.scale(this.zoom);
			return this.position.copy().add(rPos); 
		}
		
		this.inView = function(_particle) {
			let projSize = this.getWorldProjectionSize();
			let dPos = this.position.difference(_particle.position);
			if (dPos.value[0] < -_particle.radius || dPos.value[1] < -_particle.radius) return false;
			if (dPos.value[0] > projSize.value[0] + _particle.radius || dPos.value[1] > projSize.value[1] + _particle.radius) return false;
			return true;
		}


		this.zoomTo = function(_targetValue) {
			Animator.animateValue({
				start: this.zoom,
				end: _targetValue,
				frames: 100,
				callback: function(_value) {
					RenderEngine.camera.zoom = _value;
				}
			});
		}


		let panning = false;
		this.panTo = function(_endCoords) {
			panning = true;
			const cameraSpeed = 20;
			let delta = this.position.difference(_endCoords);
			let startPosition = this.position;
			Animator.animateValue({
				start: 0,
				end: 1,
				frames: delta.getLength() / cameraSpeed,
				callback: function(_value, _percentage) {
					if (_value >= .9) panning = false;
					let dpos = delta.copy().scale(_value);
					RenderEngine.camera.position = startPosition.copy().add(dpos);
				}
			});
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
		this.camera.update();

		this.clearCanvas();
		this.drawWorldBackground();
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
		const gridSize = 50 * Math.ceil(this.camera.zoom);
		ctx.strokeStyle = "#444";
		
		
		for (let dx = gridSize; dx < PhysicsEngine.world.size.value[0]; dx += gridSize)
		{
			let canvasPosA = this.camera.worldPosToCanvasPos(new Vector([
				dx, 
				0
			]));
			let canvasPosB = this.camera.worldPosToCanvasPos(new Vector([
				dx, 
				PhysicsEngine.world.size.value[1]
			]));

			ctx.beginPath();
			ctx.moveTo(canvasPosA.value[0], canvasPosA.value[1]);
			ctx.lineTo(canvasPosB.value[0], canvasPosB.value[1]);
			ctx.closePath();
			ctx.stroke();
		}

		for (let dy = gridSize; dy < PhysicsEngine.world.size.value[1]; dy += gridSize)
		{
			let canvasPosA = this.camera.worldPosToCanvasPos(new Vector([
				0,
				dy
			]));
			let canvasPosB = this.camera.worldPosToCanvasPos(new Vector([
				PhysicsEngine.world.size.value[0],
				dy
			]));

			ctx.beginPath();
			ctx.moveTo(canvasPosA.value[0], canvasPosA.value[1]);
			ctx.lineTo(canvasPosB.value[0], canvasPosB.value[1]);
			ctx.closePath();
			ctx.stroke();
		}
	}
	
	this.drawWorldBackground = function() {
		ctx.fillStyle = "#333";
		ctx.beginPath();	

		fillRect(
			new Vector([0, 0]),
			new Vector([PhysicsEngine.world.size.value[0], PhysicsEngine.world.size.value[1]])
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
		ctx.font = '14px arial';
		ctx.fillStyle = "#eee";
		ctx.beginPath();
		ctx.fillText("Fps: " + Math.round(_fps * 10) / 10, 5, 20);
		ctx.fillText("Particles: " + PhysicsEngine.particles.length, 5, 40);
		ctx.closePath();
		ctx.fill();
	}







	
}