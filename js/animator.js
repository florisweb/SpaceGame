function _Animator() {
	let animations = [];
	this.animations = animations;
	

	const sigmoidRange = 10;
	this.givePercByFrames = function(_frame, _maxFrames) {
		let rIndex = (_frame / _maxFrames) * 2 * sigmoidRange - sigmoidRange;

		return sigmoid(rIndex);
	}


	this.animateValue = function(_config) {
		let animation = new Animation(_config);
		animations.push(animation);
	}
	

	this.update = function() {
		for (let i = 0; i < animations.length; i++) animations[i].update();
	}

	function removeAnimation(_id) {
		for (let i = animations.length - 1; i >= 0; i--)
		{
			if (animations[i].id != _id) continue
			return animations.splice(i, 1);
		}
	}


		
	function sigmoid(_x) {
	  return 1 / (1 + Math.pow(Math.E, -_x));
	}



	function Animation({start, end, frames, callback}) {
		this.id = newId();

		this.startValue = start;
		this.endValue = end;
		this.totalFrames = frames;

		let frame = 0;
		this.update = function() {
			if (frame >= this.totalFrames) return removeAnimation(this.id);
			frame++;

			let value = this.startValue + Animator.givePercByFrames(frame, this.totalFrames) * (this.endValue - this.startValue);
			try {
				callback(value, frame / this.totalFrames);
			} catch (e) {}
		}
	}
	
}