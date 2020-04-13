#!/usr/bin/env node



// a = require("./extraFunctions.js");


global.newId = function() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}





global.Vector = require("./vector.js").Vector;

let GravModule = require("./physicsEngine/gravity.js");
global.Particle = GravModule.Particle;
global.GravParticle = GravModule.GravParticle;
global.SpinParticle = GravModule.SpinParticle;


let CollModule = require("./physicsEngine/collision.js");
global.MeshObject = CollModule.MeshObject;
global.CollisionBox = CollModule.CollisionBox;
global.CollisionCircle = CollModule.CollisionCircle;
global.CollisionLine = CollModule.CollisionLine;
global.CollisionParticle = CollModule.CollisionParticle;


global.CollisionEngine = new CollModule._CollisionEngine();

let PhyModule = require("./physicsEngine/engine.js");




global.PhysicsEngine;


function _Game() {
  this.updates = 0;
  this.running = true;

  this.setup = function() {
    PhysicsEngine = new PhyModule._PhysicsEngine();
  }

  this.maxFps = 0;
  this.update = function() {
    let start = new Date();
    this.updates++;
    PhysicsEngine.update();



    
    if (this.updates % 100 == 0) Clients.broadCast(PhysicsEngine.export());
    let ms = new Date() - start;

    console.log("[UPDATE] FPS: " + (1000 / ms));

    if (!this.running) return;
  	setImmediate(function () {Game.update()});
    // setTimeout(function () {Game.update()}, 1000 / 60 - ms);
  }
}

const Game  = new _Game();

Game.setup();































const createMeshFactory = function({radius}) {
	return function (_parent) {
		return new CollisionCircle({radius: radius, lineCount: 10}, _parent);
	}
}

const createMeshFactory2 = function() {
	return function (_parent) {
		return new function() {
			this.radius = 30;
			let lineCount = 5;

			function generateMesh() {
				let lines = [];


				const anglePerLine = (2 * Math.PI) / lineCount;
				const length = Math.sin(anglePerLine * .5) * this.radius * 2;

				lines.push(
					new CollisionLine({
						offset: [30, 0],
						shape: [20, 12],
					}, this)
				);
				lines.push(
					new CollisionLine({
						offset: [10, 30],
						shape: [20, 12],
					}, this)
				);
				lines.push(
					new CollisionLine({
						offset: [50, 12],
						shape: [-20, 30],
					}, this)
				);

				
				for (let a = anglePerLine; a < Math.PI * 2; a += anglePerLine) 
				{
					let deltaPos = new Vector([0, 0]).setAngle(a, this.radius);
					let newLine = new CollisionLine({
						offset: deltaPos.value, 
						shape: new Vector([0, 0]).setAngle(a + (anglePerLine + Math.PI) * .5, length).value
					}, this);
					lines.push(newLine);
				}


				return lines;
			}

			MeshObject.call(this, {meshFactory: generateMesh, offset: [0, 0]}, _parent);
		}
	}
}


const calcPhysics = function() {
	this.physicsObj.Fres.add(this.getGravVector());
	let collisionData = this.getCollisionData(this.physicsObj.Fres);

	this.physicsObj.positionCorrection.add(collisionData.positionCorrection);
	this.physicsObj.Fres.add(collisionData.vector);	

	if (this.applyAngularVelocity) this.applyAngularVelocity();
}









let sunConfig = {mass: 113097.33552923254, position: [1320, 1200], config: {startVelocity: [-3, 2]}};
let sun = new GravParticle(sunConfig); //mercury
CollisionParticle.call(sun, sunConfig, createMeshFactory2());
SpinParticle.call(sun, sunConfig);
sun.calcPhysics = calcPhysics;
PhysicsEngine.addParticle(sun);



{
let sunConfig2 = {mass: 4188790.2047863905, position: [1150, 1000], config: {startVelocity: [0, 0]}};
let sun2 = new GravParticle(sunConfig2); //mercury
CollisionParticle.call(sun2, sunConfig2, createMeshFactory({radius: 100}));
SpinParticle.call(sun2, sunConfig2);
sun2.calcPhysics = calcPhysics;
PhysicsEngine.addParticle(sun2);
}


createParticleSet(new Vector([1000, 1000]), 1000, 30);


// let mercuryConfig = {mass: 50235, position: [500, 1000], radius: 20, config: {startVelocity: [0, .8]}};
// // let mercuryConfig = {mass: 50235, position: [500, 1000], radius: 20, config: {startVelocity: [0, 2.1]}};
// let mercury = new GravParticle(mercuryConfig); //mercury
// CollisionParticle.call(mercury, mercuryConfig, circleShapeFunction);
// SpinParticle.call(mercury, mercuryConfig);
// mercury.update = update;
// PhysicsEngine.addParticle(mercury);






// let earthGroup = new GravGroup();
// earthGroup.update = function() {
// 	this.updateValues();

// 	let Fres = this.getGravVector();
// 	let acceleration = this.applyFres(Fres);

// 	for (let i = 0; i < this.particles.length; i++) this.particles[i].velocity.add(acceleration);
// }


// let earthConfig = {mass: 500235, position: [200, 1000], radius: 20, config: {startVelocity: [0, 1.5]}};
// let earthConfig = {mass: 500235, position: [200, 1000], radius: 20, config: {startVelocity: [0, .5]}};
// let earth = new GravParticle(earthConfig); 
// CollisionParticle.call(earth, earthConfig, circleShapeFunction);
// SpinParticle.call(earth, earthConfig);
// earth.update = update;
// // earthGroup.addParticle(earth);
// PhysicsEngine.addParticle(earth);


// // let moonConfig = {mass: 30002, position: [300, 1050], radius: 10, config: {startVelocity: [0, 2]}};
// let moonConfig = {mass: 30002, position: [300, 1050], radius: 10, config: {startVelocity: [0, -.5]}};
// let moon = new GravParticle(moonConfig); 
// CollisionParticle.call(moon, moonConfig, circleShapeFunction);
// SpinParticle.call(moon, moonConfig);
// moon.update = update;
// // earthGroup.addParticle(moon);
// PhysicsEngine.addParticle(moon);


// PhysicsEngine.addParticle(earthGroup);








// new GravParticle({mass: 5035, position: [300, 1120], radius: 5, config: {startVelocity: [.6, 2.45]}}); //moon kinda
// createParticleSet(new Vector([300, 1000]), 5);

function createParticleSet(_position, _spread, _count = 20) {
	// let gg = new GravGroup();
	// gg.update = function() {
	// 	this.updateValues();

	// 	let Fres = this.getGravVector();
	// 	let acceleration = this.applyFres(Fres);

	// 	for (let i = 0; i < this.particles.length; i++) this.particles[i].velocity.add(acceleration);
	// }

	for (let i = 0; i < _count; i++) {
		let radius = 10;
		let mass = 1; //4/3 * Math.PI * Math.pow(radius, 3);
		let config = {position: [
			_position.value[0] - _spread + 2 * _spread * Math.random(), 
			_position.value[1] - _spread + 2 * _spread * Math.random()
		], mass: mass, config: {
			exerciseGravity: false,
			exerciseCollisions: false,
		}};
		g = new GravParticle(config);
		CollisionParticle.call(g, config, createMeshFactory({radius: radius}));

		g.calcPhysics = calcPhysics;

		// gg.addParticle(g);
		PhysicsEngine.addParticle(g);
	}
	// PhysicsEngine.addParticle(gg);
}









































var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(8080, function() {
	console.log("listen?");
});

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});





let Clients = [];
Clients.removeClient = function(_id) {
    for (let i = 0; i < this.length; i++)
    {
        if (this[i].id != _id) continue;
        let client = this.splice(i, 1);
        if (client.connection) client.connection.close();
        return true;
    }
    return false;
};
Clients.broadCast = function(_data) {
	for (let i = 0; i < this.length; i++)
	{
		this[i].send(_data);
	}
}



function _Client(_connection) {
    this.id         = newId();
    this.connection = _connection;

    this.send = function(_str) {
        this.connection.send(_str);
    }

    this.remove = function() {
        Client.removeClient(this.id);
    }
}








// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);


  console.log('[Connect] new client');

  let Client = new _Client(connection);
  Clients.push(Client);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  Client.connection.on('message', function(message) {
  	console.log("Message", message);
  });

  Client.connection.on('close', function(connection) {
    // close user connection
  });
});









Game.update();


