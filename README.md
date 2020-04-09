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
		isGravGroupParticle: boolean [false]	Whether the particle is in a gravgroup
		isGravGroup: boolean [false]
	}



- SpinParticle extends GravParticle
	angle: 					float [-Math.PI, Math.PI]
	angularVelocity: 		float











PhysicsEngine:

f: 	getTotalGravVector(particle)
p:	particle 		GravParticle object (or extender of which)
r:	2d-vector


f: 	getTotalGravVectorByGravGroup(particle, gravGroup)
p:	particle 		GravParticle object (or extender of which)
	gravGroup 		GravGroup object
r:	2d-vector


f: 	getCenterOfMass(particles)
p:  particle-array of type GravParticle
r: 	2d-vector
Note: if the particle-array stays the same and the particles only interect with eachother the center of mass will not change, since all particles will deviate to it evenly









Vector

f: 	setAngle(angle, radius)
p: 	angle [-Math.PI, Math.PI]		* See Angle
	radius optional [1]






Angle

		
	
			 0
	-.5 PI		.5 PI
	  	   -PI/PI

