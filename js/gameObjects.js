function Sun() {
	let config = {
		position: PhysicsEngine.world.size.copy().scale(.5).value,
		shapeFactory: function(_this) {
			return [
				new Circle({offset: [0, 0], radius: 60}, _this),
			];
		},
		config: {
			gravitySensitive: false,
			exerciseGravity: true,
		}
	};
	Body.call(this, config);

	
	
	let img = document.createElement("img");
	img.src = "images/sun.png";
	this.draw = function(ctx) {
		let center = RenderEngine.camera.worldPosToCanvasPos(this.position);
		let radius = this.shape.shapeRange / RenderEngine.camera.zoom;

		for (let i = 0; i < 5; i++)
		{
			let curRadius = radius - radius * i / 6;

			ctx.fillStyle = "rgb(255, " + ((5 - i) * 20 + 20) + ", 30)";
			ctx.beginPath();
			ctx.circle(
				center.value[0],
				center.value[1],
				curRadius,
				curRadius
			);
			ctx.closePath();
			ctx.fill();
		}










		// let radius = this.mesh.radius / RenderEngine.camera.zoom * 1.2;

		// var x = center.value[0];
		// var y = center.value[1];

		// ctx.translate(x, y);
		// ctx.rotate(this.angle);
		// ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
		// ctx.rotate(-this.angle);
		// ctx.translate(-x, -y);


		// ctx.drawImage(img, center.value[0] - radius, center.value[1] - radius, radius * 2, radius * 2);


	}
}



function Planet(_ring) {
	let ring = _ring; 

	let distance = Math.pow(ring, 1.3) * 400;
	let radius = Math.random() * 30 + 10;
	let startVelocity = PhysicsEngine.gravity.formulas.calcEscapeVelocity(sun.massData.mass, distance) * .7;

	let config = {
		position: [PhysicsEngine.world.size.value[0] / 2 - distance, PhysicsEngine.world.size.value[1] / 2],
		shapeFactory: function(_this) {
			return [
				new Circle({offset: [0, 0], radius: radius}, _this),
			];
		},
		config: {
			gravitySensitive: true,
			exerciseGravity: true,
		}
	};

	Body.call(this, config);
	this.velocity.add(new Vector([0, startVelocity]));

	

	this.buildings = [];

	this.addBuilding = function() {
		let building = {

		}
		
		building.mesh = new CollisionBox({diagonal: [8, 5], offset: [0, this.radius]}, this);

		this.buildings.push(building);
	}
}


