
<!DOCTYPE html>
<html>
	<head>
		<title>Spacegame test</title>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>


		<link rel="stylesheet" type="text/css" href="css/component.css?a=1">
		<link rel="stylesheet" type="text/css" href="css/main.css?a=1">
		<script type="text/javascript" src="/JS/jQuery.js"></script>
	</head>	
	<body>
		

		<script>
			// temporary so things don't get cached
			let antiCache = Math.round(Math.random() * 100000000);
			$.getScript("js/extraFunctions.js?antiCache=" 			+ antiCache, function() {});
			$.getScript("js/vector.js?antiCache=" 					+ antiCache, function() {});
			$.getScript("js/physicsEngine.js?antiCache=" 			+ antiCache, function() {});
			$.getScript("js/renderEngine.js?antiCache="				+ antiCache, function() {});
			$.getScript("js/game.js?antiCache="						+ antiCache, function() {});
			$.getScript("js/app.js?antiCache="						+ antiCache, function() {});
			
		</script>

	</body>
</html>	