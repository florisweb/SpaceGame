
<!DOCTYPE html>
<html>
	<head>
		<title>Spacegame test</title>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>


		<link rel="stylesheet" type="text/css" href="css/component.css?a=1">
		<link rel="stylesheet" type="text/css" href="css/main.css?a=7">
		<script type="text/javascript" src="/JS/jQuery.js"></script>
	</head>	
	<body>
		<canvas id="gameCanvas" width="800" height="600"></canvas>
		

		<script>
			// temporary so things don't get cached
			let antiCache = Math.round(Math.random() * 100000000);
			$.getScript("js/extraFunctions.js?antiCache=" 			+ antiCache, function() {});
			$.getScript("js/vector.js?antiCache=" 					+ antiCache, function() {});
			$.getScript("js/animator.js?antiCache=" 				+ antiCache, function() {});
				
			$.getScript("js/physicsEngine/gravity.js?antiCache=" 	+ antiCache, function() {});
			$.getScript("js/physicsEngine/collision.js?antiCache=" 	+ antiCache, function() {});
			$.getScript("js/physicsEngine/engine.js?antiCache=" 	+ antiCache, function() {});


			$.getScript("js/renderEngine.js?antiCache="				+ antiCache, function() {});
			$.getScript("js/inputHandler.js?antiCache=" 			+ antiCache, function() {});
			$.getScript("js/game.js?antiCache="						+ antiCache, function() {});
			$.getScript("js/app.js?antiCache="						+ antiCache, function() {});
			



			// var socket;

			// function init() {
			// 	socket = new WebSocket("ws://localhost:8080", "spaceGame-protocol");

			// 	socket.onopen = function(e) {
			// 		console.log(e);
			// 	}

			// 	socket.onmessage = function(e) {
			// 		let data = JSON.parse(e.data);

			// 		PhysicsEngine.particles = [];

			// 		for (let p = 0; p < data.length; p++)
			// 		{
			// 			let config = {mass: data[p].mass, position: data[p].position, config: {startVelocity: data[p].velocity}};
			// 			let particle = new GravParticle(config);
			// 			CollisionParticle.call(particle, config, createMeshFactory({radius: data[p].radius}));
			// 			SpinParticle.call(particle, config);
			// 			particle.calcPhysics = calcPhysics;
			// 			particle.angle = data[p].angle;
			// 			particle.id = data[p].id;
						
			// 			PhysicsEngine.addParticle(particle);
			// 		}

			// 	}

			// 	socket.onerror = function(e) {
			// 		console.log("[Error] " + e.data);
			// 	}

			// 	socket.onclose = function(e) {
			// 		if(e.wasClean) {
			// 			console.log("Disconnected.");
			// 		} else {
			// 			console.log("Connection died. -- Reconnecting...");
			// 		}
			// 	}
			// }

			// document.body.onload = function() {
			// 	init();
			// }
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