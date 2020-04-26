Default: []


Version 1.0
Planned features:










- Particle: 
	id
	mass
	position
	velocity
	config: {
		startVelocity: array [0, 0]
	}


- GravParticle extends Particle
	radius
	config: {
		exerciseGravity: boolean [true]			Whether the particle has any gravitational effect on other particles
		gravitySensitive: boolean [true] 		Whether other particles have gravitational effect on the particle
	}
	particle.calcPhysics(particleIndex) - custom function
	
	f: getGravVector(particleIndex)
	



- SpinParticle extends Particle
	angle: 					float [-Math.PI, Math.PI]
	angularVelocity: 		float



- CollisionParticle extends Particle
	config: {
		exerciseCollisions: boolean [true]
		collisionSensitive: boolean [true]
		onCollision - see \/
	}
	
	
	f: 	onCollision(vectors, Fcollision)
	p:	vectors: [{
		vector:	new Vector: own indent vector 
		target: the collision-target's mesh-object
	}]
	r: preventCollisionReaction [boolean]








PhysicsEngine:

f: 	getTotalGravVector(particle)
p:	particle 		GravParticle object (or extender of which)
r:	2d-vector


f: 	getCenterOfMass(particles)
p:  particle-array of type GravParticle
r: 	2d-vector
Note: if the particle-array stays the same and the particles only interect with eachother the center of mass will not change, since all particles will deviate to it evenly






CollisionEngine:

f: 	MeshObject.getCollisionVectors
r:	[{
	vector: new Vector 		CollisionPosition relative to mesh.parent.getPosition()
	target: MeshObject
}]


f: 	CollisionParticle.getCollisionData
r:	{
	vector: new Vector: Fcollision
	positionCorrection: new Vector
}



?
f:	CollisionMesh.getCollisionVector
r:	2d-vector: percentage of how far another mesh is inside the current mesh (1 = center, 0 = not at all)
?













Vector

f: 	setAngle(angle, radius)
p: 	angle [-Math.PI, Math.PI]		* See Angle
	radius optional [1]

f: 	getProjection(projVector)
p:  projVector 2d-vector
r: 	2d-vector		returns the projection of projVector on self



Coords:
		x ->
	y	0 0		1 0
	|	
	\/	0 1		1 1


Angle
		
		   -.5 PI
	-PI/PI			0
			.5 PI










Collision: {
	normal: Vec - away from self,
	depth: 
	self,
	target
}



