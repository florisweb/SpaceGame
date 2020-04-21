document.onmousedown = function() { 
  InputHandler.mouseDown = true;
}
document.onmouseup = function() {
  InputHandler.mouseDown = false;
}


function _InputHandler() {
	let HTML = {
		canvas: gameCanvas,
	}
	this.mouseDown = false;
	this.draging = false;

	this.settings = new function() {
		this.dragSpeed = 1;
		this.scrollSpeed = .005
	}
	assignMouseDrager();
	assignMouseMoveHandler();




	HTML.canvas.addEventListener("click", function(_e) {
		let mousePosition = new Vector([
			_e.offsetX / HTML.canvas.offsetWidth * HTML.canvas.width, 
			_e.offsetY / HTML.canvas.offsetHeight * HTML.canvas.height
		]);

		let worldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition);

		for (entity of PhysicsEngine.particles) 
		{
			let distance = worldPosition.difference(entity.position).getLength();
			if (distance > entity.mesh.meshRange) continue;
			RenderEngine.camera.follow(entity);
			break;
		}
	});

	HTML.canvas.addEventListener('wheel', function(event) {
		let mousePosition = new Vector([
			event.offsetX / HTML.canvas.offsetWidth * HTML.canvas.width, 
			event.offsetY / HTML.canvas.offsetHeight * HTML.canvas.height
		]);

		let startWorldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition.copy());

	    RenderEngine.camera.zoom += event.deltaY * InputHandler.settings.scrollSpeed;
	    if (RenderEngine.camera.zoom < .1) RenderEngine.camera.zoom = .1;
	    

	    let endWorldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition);
	    RenderEngine.camera.position.add(endWorldPosition.difference(startWorldPosition));
	    
	    return false; 
	}, false);





	function assignMouseMoveHandler() {
		HTML.canvas.addEventListener("mousemove", 
		    function (_event) {
		    	let mousePosition = new Vector([
					_event.offsetX / HTML.canvas.offsetWidth * HTML.canvas.width, 
					_event.offsetY / HTML.canvas.offsetHeight * HTML.canvas.height
				]);
	    		let worldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition);

		    	Server.sendPacket(0, worldPosition.value);
		    }
		);
	}








	function assignMouseDrager() {
		HTML.canvas.addEventListener("mousedown", 
	    	function (_event) {
	      		InputHandler.draging = true;
	    	}
	  	);

	  	HTML.canvas.addEventListener("mouseup", stopDraging);

	  	let prevDragVector = false;
		HTML.canvas.addEventListener("mousemove", 
		    function (_event) {
		    	if (!InputHandler.draging) return;
		    	if (!InputHandler.mouseDown) return stopDraging();
		    	RenderEngine.camera.follow(false);

		    	if (prevDragVector)
		    	{
		    		let deltaPos = new Vector([_event.screenX, _event.screenY]).difference(prevDragVector);
		    		let moveVector = deltaPos.scale(InputHandler.settings.dragSpeed * RenderEngine.camera.zoom);
		    		RenderEngine.camera.position.add(moveVector);
		    	}

		    	prevDragVector = new Vector([_event.screenX, _event.screenY]);
		    }
		);
		
		function stopDraging() {
			InputHandler.draging = false;
	      	prevDragVector = false;
		}
	}

}