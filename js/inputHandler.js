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

	    	if (prevDragVector)
	    	{
	    		let deltaPos = new Vector([_event.screenX, _event.screenY]).difference(prevDragVector);
	    		RenderEngine.camera.position.add(deltaPos);
	    	}

	    	prevDragVector = new Vector([_event.screenX, _event.screenY]);
	    }
	);
	

	function stopDraging() {
		InputHandler.draging = false;
      	prevDrag = false;
	}

}