const canvas = document.getElementById("renderCanvas"); 
const engine = new BABYLON.Engine(canvas, true); 
var scrollIndex = 0;
var prevPosX;
var prevPosZ;

function scroll(event, array) { 
    const sign = Math.sign(event.deltaY);
    if(sign < 0) {
        if(scrollIndex == 0) {
            scrollIndex = array.length - 1;
        } else {
            scrollIndex = scrollIndex - 1;
        }
    } else if(sign > 0) {
        scrollIndex = (scrollIndex + 1) % array.length;
    }

}

function gameOver() {
    alert("Game Over");
}

var createScene = function () {
    
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 2, 55), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    // camera.setTarget(new BABYLON.Vector3(0, 0, 0));


    // This attaches the camera to the canvas
    // camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin());	


    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 50}, scene);
    ground.scaling = new BABYLON.Vector3(1, 1, -30);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9}, scene);
	
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial");
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grassn.png", scene);   
       
    ground.material = groundMaterial;

    var skyboxMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
    skyboxMaterial.backFaceCulling = false;

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    skybox.material = skyboxMaterial;
	
	var setSkyConfig = function (property, from, to) {
		var keys = [
            { frame: 0, value: from },
			{ frame: 100, value: to }
        ];
		
		var animation = new BABYLON.Animation("animation", property, 100, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		animation.setKeys(keys);
		
		scene.stopAnimation(skybox);
		scene.beginDirectAnimation(skybox, [animation], 0, 100, false, 1);
	};

	// Set to Day
	setSkyConfig("material.inclination", skyboxMaterial.inclination, 0);

    const corners = [ new BABYLON.Vector3(10, 0, 10),
        new BABYLON.Vector3(10, 7, 10),
        new BABYLON.Vector3(0, 7, 10),
        new BABYLON.Vector3(0, 0, 10),
  ];

    const hole = [ new BABYLON.Vector3(6, 0, 10),
        new BABYLON.Vector3(6, 1.5, 10),
        new BABYLON.Vector3(4, 1.5, 10),
        new BABYLON.Vector3(4, 0, 10),
    ];
    

    const hole1 = [ new BABYLON.Vector2(7, 0, 10),
        new BABYLON.Vector2(7, 0.7, 10),
        new BABYLON.Vector2(3, 0.7, 10),
        new BABYLON.Vector2(3, 0, 10),
    ];

    var obs1 = -20;
    var obs2 = -50;
    // var obstacle_poly3 = new BABYLON.PolygonMeshBuilder("obstacle3", corners, scene);
    // obstacle_poly3.addHole(hole);
    // var obstacle3 = obstacle_poly3.build(null, 0);
    // obstacle3.position.y = 0;
    // obstacle3.position.x = 5;
    // obstacle3.position.z = obs3;
    // obstacle3.rotation.x = BABYLON.Tools.ToRadians(270);
    // obstacle3.rotation.y = BABYLON.Tools.ToRadians(180);

    // obstacle3.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle3, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);

    const obstacleMaterial = new BABYLON.StandardMaterial("obstacleMaterial");
    obstacleMaterial.emissiveTexture = obstacleMaterial.diffuseTexture = new BABYLON.Texture("textures/rock.png", scene); 
    
    const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial");
    sphereMaterial.diffuseTexture = new BABYLON.Texture("textures/rock.png", scene); 

    const boxMaterial = new BABYLON.StandardMaterial("boxMaterial");
    boxMaterial.diffuseTexture = new BABYLON.Texture("textures/bloc.jpg", scene); 

    const cylindricalMaterial = new BABYLON.StandardMaterial("cylindricalMaterial");
    cylindricalMaterial.diffuseTexture = new BABYLON.Texture("textures/floor_bump.png", scene); 

    const rectangleMaterial = new BABYLON.StandardMaterial("rectangleMaterial");
    rectangleMaterial.diffuseTexture = new BABYLON.Texture("textures/lavalite.jpg", scene); 

    var obstacle_poly1 = new BABYLON.PolygonMeshBuilder("obstacle1", corners, scene);
    obstacle_poly1.addHole(hole1);
    var obstacle1 = obstacle_poly1.build(null, 0);
    obstacle1.position.y = 0;
    obstacle1.position.x = 5;
    obstacle1.position.z = obs1;
    obstacle1.rotation.x = BABYLON.Tools.ToRadians(270);
    obstacle1.rotation.y = BABYLON.Tools.ToRadians(180);

    obstacle1.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle1, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);
       
    obstacle1.material = obstacleMaterial;

    var obstacle_poly2 = new BABYLON.PolygonMeshBuilder("obstacle2", corners, scene);
    obstacle_poly2.addHole(hole1);
    var obstacle2 = obstacle_poly2.build(null, 0);
    obstacle2.position.y = 0;
    obstacle2.position.x = 5;
    obstacle2.position.z = obs2;
    obstacle2.rotation.x = BABYLON.Tools.ToRadians(270);
    obstacle2.rotation.y = BABYLON.Tools.ToRadians(180);

    obstacle2.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle2, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);

    obstacle2.material = obstacleMaterial;


    var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 32}, scene);
    player.material = sphereMaterial;

    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9, friction: 0.5}, scene);
    player.physicsImpostor.registerOnPhysicsCollide(obstacle1.physicsImpostor, function(main, collided) {
        alert("collided")
    });
    player.position.y = 1/2;
    player.position.z = -1;

    


    window.addEventListener("wheel", event => {
        const shapes = ['sphere', 'box', 'cylinder' ,'rectangle'];
        scroll(event, shapes);

        if(shapes[scrollIndex] == 'sphere') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }
            player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 32}, scene);
            player.material = sphereMaterial;

            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9}, scene);
            player.physicsImpostor.registerOnPhysicsCollide(obstacle1.physicsImpostor, function(main, collided) {
            
                alert("collided");
            });
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
            player.position.x = prevPosX;
            player.position.z = prevPosZ;
            player.position.y = 1/2;

            // player.position.z = 45;  
        } else if(shapes[scrollIndex] == 'box') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }
            player = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
            player.material = boxMaterial;

            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0}, scene);
            player.physicsImpostor.registerOnPhysicsCollide(obstacle1.physicsImpostor, function(main, collided) {
            
                alert("collided");
            });
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
            player.position.x = prevPosX;
            player.position.z = prevPosZ;
            player.position.y = 0;
            // player.position.z = 45;
        } else if (shapes[scrollIndex] == 'cylinder') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }

            player = BABYLON.MeshBuilder.CreateBox("box", {height: 1/2, width: 3}, scene);
            player.material = cylindricalMaterial;

            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0}, scene);
            player.physicsImpostor.registerOnPhysicsCollide(obstacle1.physicsImpostor, function(main, collided) {
            
                alert("collided");
            });

            // player = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:2, diameterTop:0.5, diameterBottom:0.5});
            // player.rotation.z = BABYLON.Tools.ToRadians(90)
            // player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0, friction:0}, scene);
            // player.physicsImpostor.registerOnPhysicsCollide(obstacle1.physicsImpostor, function(main, collided) {
            
            //     alert("collided");
            // });
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
            player.position.x = prevPosX;
            player.position.z = prevPosZ;
            player.position.y = 0;

        }  else if (shapes[scrollIndex] == 'rectangle') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }

            player = BABYLON.MeshBuilder.CreateBox("rectangle", {width:1, height: 2}, scene);
            player.material = rectangleMaterial;
            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, friction: 0}, scene);
            player.physicsImpostor.registerOnPhysicsCollide(obstacle1.physicsImpostor, function(main, collided) {
            
                alert("collided");
            });
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
            player.position.x = prevPosX;
            player.position.z = prevPosZ;
            player.position.y = 1;
        }
    });


   

    var inputMap ={};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {								
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));


    var pos = 20;
    scene.onBeforeRenderObservable.add(()=>{

        if(player.position.x > -5 && player.position.x < 5) {
            player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
        } else {
            camera.position.y = player.position.y
        }
    

        // if(player.position.z < obs1) {
        //     obstacle1.dispose();
        //     obstacle_poly1 = new BABYLON.PolygonMeshBuilder("obstacle1", corners, scene);
        //     obstacle_poly1.addHole(hole);
        //     obstacle1 = obstacle_poly1.build(null, 0);
        //     obstacle1.position.y = 0;
        //     obstacle1.position.x = 5;
        //     obstacle1.position.z = obs1 - 60;
        //     obstacle1.rotation.x = BABYLON.Tools.ToRadians(270);
        //     obstacle1.rotation.y = BABYLON.Tools.ToRadians(180);
        //     obstacle1.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle1, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);

        //     player.physicsImpostor.registerOnPhysicsCollide(obstacle1.physicsImpostor, function(main, collided) {
            
        //         alert("collided");
        //     });
        // }

        // if(player.position.z < obs2) {
        //     obstacle2.dispose();
        //     obstacle_poly2 = new BABYLON.PolygonMeshBuilder("obstacle2", corners, scene);
        //     obstacle_poly2.addHole(hole1);
        //     obstacle2 = obstacle_poly2.build(null, 0);
        //     obstacle2.position.y = 0;
        //     obstacle2.position.x = 5;
        //     obstacle2.position.z = obs2 - 60;
        //     obstacle2.rotation.x = BABYLON.Tools.ToRadians(270);
        //     obstacle2.rotation.y = BABYLON.Tools.ToRadians(180);
        //     obstacle2.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle2, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);

        //     player.physicsImpostor.registerOnPhysicsCollide(obstacle2.physicsImpostor, function(main, collided) {
            
        //         alert("collided");
        //     });
        //}

        prevPosX = player.position.x;
        prevPosZ = player.position.z;
        // camera.position.y = player.position.y+1;
        camera.position.z = player.position.z+7;

        if(inputMap["a"]) {
            player.position.x += 0.1;
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(3, 0, -5));
        }  
        if(inputMap["d"]) {
            player.position.x -= 0.1;
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-3, 0, -5));
        }

    });



    return scene;
};


const scene =  createScene(); 

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});