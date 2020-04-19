
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
			
			$.getScript("js/server.js?antiCache=" 					+ antiCache, function() {});
			$.getScript("js/game.js?antiCache="						+ antiCache, function() {});
			$.getScript("js/app.js?antiCache="						+ antiCache, function() {});
			
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