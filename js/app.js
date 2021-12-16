const canvas = document.getElementById("renderCanvas"); 
const engine = new BABYLON.Engine(canvas, true); 
var scrollIndex = 0;
var prevPos;

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
    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, 55), scene);

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
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 100}, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9}, scene);

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
        new BABYLON.Vector2(7, 0.5, 10),
        new BABYLON.Vector2(3, 0.5, 10),
        new BABYLON.Vector2(3, 0, 10),
    ];

    var obstacle_poly = new BABYLON.PolygonMeshBuilder("obstacle", corners, scene);
    obstacle_poly.addHole(hole);
    var obstacle = obstacle_poly.build(null, 0);
    obstacle.position.y = 0;
    obstacle.position.x = 5;
    obstacle.position.z = 20;
    obstacle.rotation.x = BABYLON.Tools.ToRadians(270);
    obstacle.rotation.y = BABYLON.Tools.ToRadians(180);

    obstacle.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);

    // var obstacle_poly1 = new BABYLON.PolygonMeshBuilder("obstacle1", corners, scene);
    // obstacle_poly1.addHole(hole1);
    // var obstacle1 = obstacle_poly1.build(null, 0);
    // obstacle1.position.y = 0;
    // obstacle1.position.x = 5;
    // obstacle1.position.z = 0;
    // obstacle1.rotation.x = BABYLON.Tools.ToRadians(270);
    // obstacle1.rotation.y = BABYLON.Tools.ToRadians(180);

    // obstacle1.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle1, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);

    var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 32}, scene);
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9, friction: 0.5}, scene);
    player.physicsImpostor.registerOnPhysicsCollide(obstacle.physicsImpostor, function(main, collided) {
        alert("collided")
    });
    player.position.y = 0;
    player.position.z = 45;


    window.addEventListener("wheel", event => {
        const shapes = ['sphere', 'box', 'cylinder', 'rectangle'];
        scroll(event, shapes);

        if(shapes[scrollIndex] == 'sphere') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }
            player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 32}, scene);
            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9}, scene);
            player.physicsImpostor.registerOnPhysicsCollide(obstacle.physicsImpostor, function(main, collided) {
            
                alert("collided");
            });
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
            player.position = prevPos;
            // player.position.z = 45;  
        } else if(shapes[scrollIndex] == 'box') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }
            player = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0}, scene);
            player.physicsImpostor.registerOnPhysicsCollide(obstacle.physicsImpostor, function(main, collided) {
            
                alert("collided");
            });
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
            player.position = prevPos;

            // player.position.z = 45;
        } else if (shapes[scrollIndex] == 'cylinder') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }

            player = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:2, diameterTop:0.5, diameterBottom:0.5});
            player.rotation.z = BABYLON.Tools.ToRadians(90)
            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0, friction:0}, scene);
            player.physicsImpostor.registerOnPhysicsCollide(obstacle.physicsImpostor, function(main, collided) {
            
                alert("collided");
            });
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
            player.position = prevPos;

        }  else if (shapes[scrollIndex] == 'rectangle') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }

            player = BABYLON.MeshBuilder.CreateBox("rectangle", {width:1, height: 2}, scene);
            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, friction: 0}, scene);
            player.physicsImpostor.registerOnPhysicsCollide(obstacle.physicsImpostor, function(main, collided) {
            
                alert("collided");
            });
            // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
            player.position = prevPos;
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


    scene.onBeforeRenderObservable.add(()=>{

        if(player.position.x > -5 && player.position.x < 5) {
            player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
        } 
        prevPos = player.position;
        camera.position.y = player.position.y+1;
        camera.position.z = player.position.z+7;

        if(inputMap["a"]){
            player.position.x += 0.1;
        }  
        if(inputMap["d"]){
            player.position.x -= 0.1;
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
