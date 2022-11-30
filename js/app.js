const canvas = document.getElementById("renderCanvas"); 
const scoreElement = document.getElementById("score");
const engine = new BABYLON.Engine(canvas, true); 
var mouseScrollSound; 
var collisionSound; 
var music;
var scrollIndex = 0;
var prevPosX;
var prevPosZ;
var x = 1;
var y = 1;
var z = 1;
var score = 0;
var isGameOver = false;
var xVelocityPos = 3;
var xVelocityNeg = -3;
var zVelocity = 0; 
var isTempObstacleUsed = false;
var obs1 = -30;
var obs2 = -60;
var obs3 = -100;


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

function registerCollision(player, obstacle1, obstacle2, obstacle3) {

    player.physicsImpostor.registerOnPhysicsCollide(obstacle1.physicsImpostor, function(main, collided) { 
        gameOver();
    });
    player.physicsImpostor.registerOnPhysicsCollide(obstacle2.physicsImpostor, function(main, collided) { 
        gameOver();
    });
    player.physicsImpostor.registerOnPhysicsCollide(obstacle3.physicsImpostor, function(main, collided) { 
        gameOver();
    });
}

function registerTempObstacle(tempObstacle, player) {
    player.physicsImpostor.registerOnPhysicsCollide(tempObstacle.physicsImpostor, function(main, collided) { 
        gameOver();
    });
}

function createObstacle1(corners, hole1, obstacleMaterial1, obstacleName, scene) {
    var obstacle_poly1 = new BABYLON.PolygonMeshBuilder(obstacleName, corners, scene);
    obstacle_poly1.addHole(hole1);
    var obstacle1 = obstacle_poly1.build(null, 0);
    obstacle1.position.y = 0;
    obstacle1.position.x = 5;
    obstacle1.position.z = obs1;
    obstacle1.rotation.x = BABYLON.Tools.ToRadians(270);
    obstacle1.rotation.y = BABYLON.Tools.ToRadians(180);

    obstacle1.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle1, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);
    
    obstacle1.material = obstacleMaterial1;

    return obstacle1;
}

function createObstacle2(corners, hole2, obstacleMaterial2, obstacleName, scene) {

    var obstacle_poly2 = new BABYLON.PolygonMeshBuilder(obstacleName, corners, scene);
    obstacle_poly2.addHole(hole2);
    var obstacle2 = obstacle_poly2.build(null, 0);
    obstacle2.position.y = 0;
    obstacle2.position.x = 5;
    obstacle2.position.z = obs2;
    obstacle2.rotation.x = BABYLON.Tools.ToRadians(270);
    obstacle2.rotation.y = BABYLON.Tools.ToRadians(180);

    obstacle2.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle2, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);

    obstacle2.material = obstacleMaterial2;

    return obstacle2;
    
}

function createObstacle3(corners, hole3, obstacleMaterial3, obstacleName, scene) {

    var obstacle_poly3 = new BABYLON.PolygonMeshBuilder(obstacleName, corners, scene);
    obstacle_poly3.addHole(hole3);
    var obstacle3 = obstacle_poly3.build(null, 0);
    obstacle3.position.y = 0;
    obstacle3.position.x = 5;
    obstacle3.position.z = obs3;
    obstacle3.rotation.x = BABYLON.Tools.ToRadians(270);
    obstacle3.rotation.y = BABYLON.Tools.ToRadians(180);

    obstacle3.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle3, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0}, scene);

    obstacle3.material = obstacleMaterial3;

    return obstacle3;
    
}

function gameOver() {

    music.stop(0);
    mouseScrollSound = undefined;
    collisionSound.play();
    isGameOver = true;
}

var createScene = function () {
    
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 2, 55), scene);

    camera.setTarget(new BABYLON.Vector3(0, 0, 0));

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = 1.5;

    Ammo().then(() => {scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin())});

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 50}, scene);
    ground.scaling = new BABYLON.Vector3(1, 1, -50);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9}, scene);
    
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial");
    // groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grassn.png", scene);   
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/road-min.jpg", scene);   
    
    ground.material = groundMaterial;

    var skyboxMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
    skyboxMaterial.backFaceCulling = false;

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0,  scene);
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

    const hole1 = [ new BABYLON.Vector3(4, 0, 10),
        new BABYLON.Vector3(4, 1.5, 10),
        new BABYLON.Vector3(2, 1.5, 10),
        new BABYLON.Vector3(2, 0, 10),
    ];
    

    const hole2 = [ new BABYLON.Vector2(7, 0, 10),
        new BABYLON.Vector2(7, 0.7, 10),
        new BABYLON.Vector2(3, 0.7, 10),
        new BABYLON.Vector2(3, 0, 10),
    ];

    const hole3 = [ new BABYLON.Vector3(7.5, 0, 10),
        new BABYLON.Vector3(7.5, 3, 10),
        new BABYLON.Vector3(6.5, 3, 10),
        new BABYLON.Vector3(6.5, 0, 10),
    ];

    const obstacleMaterial1 = new BABYLON.StandardMaterial("obstacleMaterial1");
    obstacleMaterial1.diffuseColor = new BABYLON.Color3(1, 1, 0);

    const obstacleMaterial2 = new BABYLON.StandardMaterial("obstacleMaterial2");
    obstacleMaterial2.diffuseColor = new BABYLON.Color3(0, 1, 1);

    const obstacleMaterial3 = new BABYLON.StandardMaterial("obstacleMaterial3");
    obstacleMaterial3.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
    
    const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial");
    sphereMaterial.diffuseTexture = new BABYLON.Texture("textures/rock.png", scene); 

    const boxMaterial = new BABYLON.StandardMaterial("boxMaterial");
    boxMaterial.diffuseTexture = new BABYLON.Texture("textures/bloc.jpg", scene); 

    const cylindricalMaterial = new BABYLON.StandardMaterial("cylindricalMaterial");
    cylindricalMaterial.diffuseTexture = new BABYLON.Texture("textures/sand.jpg", scene); 

    const rectangleMaterial = new BABYLON.StandardMaterial("rectangleMaterial");
    rectangleMaterial.diffuseTexture = new BABYLON.Texture("textures/lavalite.jpg", scene); 
 
    mouseScrollSound = new BABYLON.Sound("mouseScrollSound", "sound/mouse-scroll.wav", scene); 
    collisionSound = new BABYLON.Sound("collisionSound", "sound/collision.wav", scene);   
    music = new BABYLON.Sound("music", "sound/bg.mp3", scene, null, { loop: true, autoplay: true, volume:0.05 });
    
    var obstacle1 = createObstacle1(corners, hole1, obstacleMaterial1, "obstacle1", scene);

    var obstacle2 = createObstacle2(corners, hole2, obstacleMaterial2, "obstacle2", scene);

    var obstacle3 = createObstacle3(corners, hole3, obstacleMaterial3, "obstacle3", scene);

    var tempObstacle = createObstacle1(corners, hole1, obstacleMaterial1, "tempObstacle", scene);
    tempObstacle.position.z = 30;


    var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1.2, segments: 32}, scene);
    player.material = sphereMaterial;

    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9, friction: 0.5}, scene);
    registerCollision(player, obstacle1, obstacle2, obstacle3);
    registerTempObstacle(tempObstacle, player);

    player.position.y = 1/2;
    player.position.z = 0;
    player.position.x = 0;

    window.addEventListener("wheel", event => {
        
        if(mouseScrollSound != undefined) {
            mouseScrollSound.play();
        }
        const shapes = ['sphere', 'box', 'cylinder' ,'rectangle'];
        scroll(event, shapes);

        if(shapes[scrollIndex] == 'sphere') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }
            player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1.2, segments: 32}, scene);
            player.material = sphereMaterial;

            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9}, scene);
            registerCollision(player, obstacle1, obstacle2, obstacle3);
            registerTempObstacle(tempObstacle, player);
            
            player.position.x = prevPosX;
            player.position.z = prevPosZ;
            player.position.y = 1/2;

        } else if(shapes[scrollIndex] == 'box') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }
            player = BABYLON.MeshBuilder.CreateBox("box", {size: 1.2}, scene);
            player.material = boxMaterial;

            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0}, scene);
            registerCollision(player, obstacle1, obstacle2, obstacle3);
            registerTempObstacle(tempObstacle, player);

            player.position.x = prevPosX;
            player.position.z = prevPosZ;
            player.position.y = 0;

        } else if (shapes[scrollIndex] == 'cylinder') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }

            player = BABYLON.MeshBuilder.CreateBox("box", {height: 1/2, width: 3}, scene);
            player.material = cylindricalMaterial;

            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0}, scene);
            registerCollision(player, obstacle1, obstacle2, obstacle3);
            registerTempObstacle(tempObstacle, player);

            player.position.x = prevPosX;
            player.position.z = prevPosZ;
            player.position.y = 0;

        }  else if (shapes[scrollIndex] == 'rectangle') {
            if(player != undefined) {
                player.dispose();
                player = undefined;
            }

            player = BABYLON.MeshBuilder.CreateBox("rectangle", {width:0.5, height: 2}, scene);
            player.material = rectangleMaterial;
            player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, friction: 0}, scene);
            registerCollision(player, obstacle1, obstacle2, obstacle3);
            registerTempObstacle(tempObstacle, player);

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

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var button = BABYLON.GUI.Button.CreateSimpleButton("but", "let's go");
    button.width = "300px"
    button.height = "100px";
    button.color = "white";
    button.cornerRadius = 20;
    button.background = "gray";
    button.fontSize = "40px";
    button.onPointerUpObservable.add(function() {
        button.dispose();
        zVelocity = -5;
    });
    advancedTexture.addControl(button);  



    scene.onBeforeRenderObservable.add(()=>{

        scoreElement.innerText = score;

        if((score+1) % 5 == 0 && score < 15) {
            zVelocity -= 0.02;
            xVelocityPos += 0.005;
            xVelocityNeg -= 0.005;

        }

        var relativePos = Math.abs(tempObstacle.position.z) - Math.abs(player.position.z);
        if(relativePos < 5 && relativePos > 0) {
            isTempObstacleUsed = false;
            // alert("temp obstacle passed");
            
        }

        if(player.position.x > -5 && player.position.x < 5) {
            player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, zVelocity));
        } else {
            // camera.position.y = player.position.y
            gameOver();
        }


        if(Math.abs(player.position.z) > [Math.abs(obs1) + 5]) {

            var random = 1 + Math.floor(Math.random() * 3);
            
            obs1 = -[(x*100)+30];
            score++;
            x++;
            if(random == 2 && !isTempObstacleUsed) {
                // alert("renderring obstacle2 after passing obstacle1");
                tempObstacle = createObstacle2(corners, hole2, obstacleMaterial2, "tempObstacle", scene);
                tempObstacle.position.z = obs1;
                isTempObstacleUsed = true;
                registerTempObstacle(tempObstacle, player);
            
            } else if(random == 3 && !isTempObstacleUsed) {
                // alert("renderring obstacle3 after passing obstacle1");
                tempObstacle = createObstacle3(corners, hole3, obstacleMaterial3, "tempObstacle", scene);
                tempObstacle.position.z = obs1;
                isTempObstacleUsed = true;
                registerTempObstacle(tempObstacle, player);
            
            } else {
                // alert("renderring obstacle1 after passing obstacle1");
                obstacle1.position.z = obs1;
            }

        } else if(Math.abs(player.position.z) > [Math.abs(obs2) + 5]) {

            var random = 1 + Math.floor(Math.random() * 3);

            obs2 = -[(y*100)+60];
            score++;
            y++;

            if(random == 1 && !isTempObstacleUsed) {
                // alert("renderring obstacle1 after passing obstacle2");
                tempObstacle = createObstacle1(corners, hole1, obstacleMaterial1, "tempObstacle", scene);
                tempObstacle.position.z = obs2;
                isTempObstacleUsed = true;
                registerTempObstacle(tempObstacle, player);

            } else if(random == 3 && !isTempObstacleUsed) {
                // alert("renderring obstacle3 after passing obstacle2");
                tempObstacle = createObstacle3(corners, hole3, obstacleMaterial3, "tempObstacle", scene);
                tempObstacle.position.z = obs2;
                isTempObstacleUsed = true;
                registerTempObstacle(tempObstacle, player);

            } else {
                // alert("renderring obstacle2 after passing obstacle2");
                obstacle2.position.z = obs2;
            }

        } else if(Math.abs(player.position.z) > [Math.abs(obs3) + 5]) {

            var random = 1 + Math.floor(Math.random() * 3);

            obs3 = -[(z*100)+100];
            score++;
            z++;

            if(random == 1 && !isTempObstacleUsed) {
                // alert("renderring obstacle1 after passing obstacle3");
                tempObstacle = createObstacle1(corners, hole1, obstacleMaterial1, "tempObstacle", scene);
                tempObstacle.position.z = obs3;
                isTempObstacleUsed = true;
                registerTempObstacle(tempObstacle, player);

            } else if(random == 2 && !isTempObstacleUsed) {
                // alert("renderring obstacle2 after passing obstacle3");
                tempObstacle = createObstacle2(corners, hole2, obstacleMaterial2, "tempObstacle", scene);
                tempObstacle.position.z = obs3;
                isTempObstacleUsed = true;
                registerTempObstacle(tempObstacle, player);

            } else {
                // alert("renderring obstacle3 after passing obstacle3");
                obstacle3.position.z = obs3;
            }

        }

        prevPosX = player.position.x;
        prevPosZ = player.position.z;
        camera.position.z = player.position.z+7;
        // camera.position.x = player.position.x;

        if(inputMap["a"]) {
            // player.position.x += 0.1;
            player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(xVelocityPos, 0, zVelocity));
        }  
        if(inputMap["d"]) {
            // player.position.x -= 0.1;
            player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(xVelocityNeg, 0, zVelocity));
        }

    });


    return scene;
};


const scene =  createScene(); 

// scene.render();

engine.runRenderLoop(function () {

    if(!isGameOver) {
        scene.render();
    
    } else if(isGameOver) {
        document.getElementById("start").style.display = "block"; 
        var style = "top:10%;left:40%;font-size:20px;background-color:#2A2F30; hover:background: #2FA2C4; width: 300px; height:100px; border-radius: 40px;";
        document.getElementById("scoreCard").style.cssText = style;
        document.getElementById("score").innerText = "Score: " + score;
        document.getElementById("score").style.cssText = "color:#fff;font-size: 30px;text-align:center;";
        
    }

});


window.addEventListener("resize", function () {
    engine.resize();
});
