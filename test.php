
<!DOCTYPE html>
<html>
	<head>
		<title>Spacegame test</title>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>


		<script type="text/javascript" src="/JS/jQuery.js"></script>
		<script type="text/javascript" src="js/vector.js"></script>

		<style>
			#gameCanvas {
				position: relative;
				width: 90vw;
				height: auto;
				border: 1px solid red;
			}
		</style>
	</head>	
	<body>
		<canvas id="gameCanvas" width="800" height="600"></canvas>
		

		<script>
			// temporary so things don't get cached
			let antiCache = Math.round(Math.random() * 100000000);
			$.getScript("js/extraFunctions.js?antiCache=" 			+ antiCache, function() {});
			

			const ctx = gameCanvas.getContext("2d");
			ctx.constructor.prototype.circle = function(circle) {
				ctx.fillStyle = "rgba(0, 0, 255, .2)";
				ctx.beginPath();
				this.ellipse(
					circle.position.value[0],
					circle.position.value[1],
					circle.radius,
					circle.radius,
					0,
					0,
					2 * Math.PI
				);
				ctx.closePath();
				ctx.fill();
			}

			ctx.constructor.prototype.drawLine = function(line) {
				ctx.beginPath();
				ctx.moveTo(line.position.value[0], line.position.value[1]);
				let endPos = line.position.copy().add(line.shape);
				ctx.lineTo(endPos.value[0], endPos.value[1]);

				ctx.closePath();
			}


			let circle = {
				position: new Vector([200, 200]),
				radius: 50,
			}

			let line = {
				position: new Vector([280, 150]),
				shape: new Vector([-100, 100])
			}


			gameCanvas.onmousemove = function(_e) {
				circle.position = new Vector([_e.layerX, _e.layerY]);
			}


			function loop() {
				ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
				
				ctx.strokeStyle = "#f00";
				ctx.circle(circle);
				ctx.drawLine(line);
				ctx.stroke();

				line.shape.setAngle(line.shape.getAngle() + 0.01, line.shape.getLength());

				getIntersections();
				requestAnimationFrame(loop);
			}

			loop();





			function getIntersections() {
				let delta = line.position.difference(circle.position);
				let alpha = delta.getAngle() - line.shape.getAngle();
				let length = Math.sin(alpha) * delta.getLength();

				let perpendicularLine = {
					position: circle.position.copy(),
					shape: line.shape.getPerpendicular().setLength(length)
				}


				ctx.strokeStyle = "#00f";
				ctx.drawLine(perpendicularLine);
				ctx.stroke();


				let aEnd = circle.position.copy().add(perpendicularLine.shape);

				let addVectorLength = Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(length, 2));
				let addVector = line.shape.copy().setLength(addVectorLength);

				let posA = aEnd.copy().add(addVector);
				let posB = aEnd.copy().add(addVector.copy().scale(-1));


				let deltaA = line.position.difference(posA);
				let deltaB = line.position.difference(posB);
				let errorA = deltaA.getAngle() - line.shape.getAngle();
				let errorB = deltaB.getAngle() - line.shape.getAngle();
				

				if (errorA > .1 || deltaA.getLength() - line.shape.getLength() > 0) {
				} else {
					ctx.strokeStyle = "#333";
					ctx.drawLine({
						position: posA,
						shape: new Vector([10, 0])
					});
					ctx.stroke();
				}

				if (errorB > .1 || deltaB.getLength() - line.shape.getLength() > 0) {
				} else {
					ctx.strokeStyle = "#000";
					ctx.drawLine({
						position: posB,
						shape: new Vector([10, 0])
					});
					ctx.stroke();
				}


			}





			
		</script>
<!-- 
		<script type="text/javascript" src="js/extraFunctions.js"></script>
		<script type="text/javascript" src="js/vector.js"></script>
		<script type="text/javascript" src="js/animator.js"></script>

		<script type="text/javascript" src="js/physicsEngine/gravity.js"></script>
		<script type="text/javascript" src="js/physicsEngine/collision.js"></script>
		<script type="text/javascript" src="js/physicsEngine/engine.js"></script>

		<script type="text/javascript" src="js/renderEngine.js"></script>
		<script type="text/javascript" src="js/inputHandler.js"></script>
		<script type="text/javascript" src="js/game.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
 -->
	</body>
</html>	