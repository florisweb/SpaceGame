Default: []


Version 1.0
Planned features:


project SpaceDust












Body
- shape 
- tempValues: {force, positionOffset, torque}
- material
- massData {mass, invMass, invInertia}


BodyGroup extends Body
- shape
- bodies: []










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














Formula's:

moment of inertia: rotational intertia
dMomentum = dV * m
I = mr^2


F -> torque t
m -> I