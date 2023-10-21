// Importar las bibliotecas y módulos necesarios
import * as THREE from "../libs/three.module.js";
import { OrbitControls } from "../libs/OrbitControls.js";
import { STLLoader } from "../libs/STLLoader.js";
import { GLTFLoader } from "../libs/GLTFLoader.js";
import { FBXLoader } from "../libs/FBXLoader.js";
import { OBJLoader } from "../libs/OBJLoader.js";

document.addEventListener("DOMContentLoaded", function () {
    // Obtener el elemento .image-play
    const imagePlay = document.querySelector('.image-play');

    // Crear una escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#34495E");

    // Crear una cámara de perspectiva
    const columnWidth = imagePlay.clientWidth; // Obtén el ancho de la columna
    const columnHeight = imagePlay.clientHeight; // Obtén el alto de la columna
    
    const camera = new THREE.PerspectiveCamera(
        60,
        columnWidth / columnHeight
    );
    camera.position.set(0, 0, 50);

    // Crea un renderizador WebGL
    const renderer = new THREE.WebGLRenderer();
    const imageWidth = imagePlay.clientWidth;
    const imageHeight = imagePlay.clientHeight;
    renderer.setSize(imageWidth, imageHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Crear luces
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-10, 5, -15);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // PLANO
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "slategrey",
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotateX(-Math.PI / 2);
    plane.position.set(0, -0.5, 0);

    // Función para redimensionar la ventana en caso de cambio de tamaño
    function resize() {
        //const columnWidth = imagePlay.clientWidth; // Obtén el ancho de la columna
        //const columnHeight = imagePlay.clientHeight; // Obtén el alto de la columna
        camera.aspect = columnWidth / columnHeight; // Utiliza las dimensiones de la columna

        //const aspect = window.innerWidth / window.innerHeight;
        //camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(columnWidth, columnHeight);
        renderer.render(scene, camera);
    }

    window.addEventListener("resize", resize);


    ///// JAPANESE
    const loaderGLTF = new GLTFLoader();
    loaderGLTF.load("../Models/Modelos/Japanese_Gate.glb", function (gltf) {
        const obj = gltf.scene;
        obj.scale.set(0.6, 0.6, 0.6);
        obj.position.set(4, 0, -8);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Japanese_vase.glb", function (gltf) {
        const obj = gltf.scene;
        obj.scale.set(0.03, 0.03, 0.03);
        obj.position.set(4, 0, -6);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Japanese_Garden.glb", function (gltf) {
        const obj = gltf.scene;
        obj.scale.set(1, 1, 1);
        obj.position.set(12, 0, -8);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Japanese_Tree.glb", function (gltf) {
        const obj = gltf.scene;
        obj.scale.set(4, 4, 4);
        obj.position.set(-12, 0, -14);
        scene.add(obj);
    });


    loaderGLTF.load("../Models/Modelos/Japanese_lamp.glb", function (gltf) {
        const obj = gltf.scene;
        obj.scale.set(9, 9, 9);
        obj.position.set(4, 0, -8);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Japanese_Beer.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(7, 0, 0);
        obj.scale.set(0.2, 0.2, 0.2);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Japanese_Helmet.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(9, -2, 0);
        obj.scale.set(0.5, 0.5, 0.5);
        obj.rotation.set(0, Math.PI / -2, 0);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Japanese_Lantern.glb", function (gltf) {
        const obj = gltf.scene;
        obj.scale.set(0.02, 0.02, 0.02);
        obj.position.set(2, 0, -8);
        scene.add(obj);
    });


    const loaderOBJ = new OBJLoader();
    loaderOBJ.load("../Models/Modelos/JellyDonut.obj", function (object) {
        object.traverse(function (child) {
        });

        object.position.set(5, 0, 0);
        object.scale.set(0.05, 0.05, 0.05);

        scene.add(object);
    });


    const loaderFBX = new FBXLoader();
    loaderFBX.load("../Models/Modelos/Dark Slime.fbx", function (object) {
        object.traverse(function (child) {
        });
        object.position.set(-1, 0, 0);
        object.scale.set(0.1, 0.1, 0.1);
        scene.add(object);
    });


    loaderFBX.load("../Models/Modelos/Green slime.fbx", function (object) {
        object.traverse(function (child) {
        });
        object.position.set(2, 0, 0);
        object.scale.set(0.1, 0.1, 0.1);

        scene.add(object);
    });

    loaderGLTF.load("../Models/Modelos/Spider.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(3, 0.5, 0);
        obj.scale.set(0.1, 0.1, 0.1);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Ghost.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(-2, 0.5, 0);
        obj.scale.set(0.2, 0.2, 0.2);
        obj.rotation.set(0, Math.PI / 2, 0);
        scene.add(obj);
    });


    loaderFBX.load("../Models/Modelos/Samurai.fbx", function (object) {
        object.traverse(function (child) {
        });
        object.position.set(0, 0, -3);
        object.scale.set(0.01, 0.01, 0.01);

        scene.add(object);
    });


    //MEDIEVAL
    loaderGLTF.load("../Models/Modelos/TreasureChest.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(4, 0, 15);
        obj.scale.set(0.03, 0.03, 0.03);
        obj.rotation.set(0, Math.PI, 0);
        scene.add(obj);
    });


    loaderFBX.load("../Models/Modelos/CaballeroOscuro.fbx", function (object) {
        object.traverse(function (child) {
        });
        object.position.set(6, 0, 12);
        object.scale.set(0.25, 0.25, 0.25);
        object.rotation.set(0, Math.PI, 0);
        scene.add(object);
    });

    loaderGLTF.load("../Models/Modelos/Medieval_Wall.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(4, 0, -30);
        obj.scale.set(3, 3, 3);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Medieval_Tree.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(-10, 0, 20);
        obj.scale.set(2.1, 2.1, 2.1);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Medieval_Tree.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(20, 0, 20);
        obj.scale.set(2.1, 2.1, 2.1);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Medieval_Barrel.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(0, 1, 15);
        obj.scale.set(0.3, 0.4, 0.4);
        scene.add(obj);
    });

    loaderGLTF.load("../Models/Modelos/Medieval_Box.glb", function (gltf) {
        const obj = gltf.scene;
        obj.position.set(10, 0, 15);
        obj.scale.set(1, 1, 1);
        scene.add(obj);
    });

    // Cargar un modelo GLTF
    const loaderGLTF2 = new GLTFLoader();
    loaderGLTF2.load("../Models/GLFT/Mesa/scene.gltf", function (gltf) {
        const obj = gltf.scene;
        obj.scale.set(0.01, 0.01, 0.01);
        obj.position.set(-5, 0, 0);
        scene.add(obj);
    });

    // Cargar un modelo GLTF

    loaderGLTF2.load("../Models/GLFT/Comedero/scene.gltf", function (gltf) {
        const obj = gltf.scene;
        obj.scale.set(3, 3, 3);
        obj.position.set(-10, 0, 0);
        scene.add(obj);
    });

    //Cargar un modelo FBX
    const fbxLoader = new FBXLoader()
    fbxLoader.load(
        '../Models/../Models/FBX/Chancla/ChanclaBlack.fbx',
        (fbx) => {
            fbx.scale.set(.8, .8, .8);
            fbx.position.set(-15, 0, -10);
            fbx.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(fbx)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded Auto FBX')
        },
        (error) => {
            console.log(error)
        }
    );

    //Cargar un modelo FBX
    const fbxLoader2 = new FBXLoader()
    fbxLoader2.load(
        '../Models/FBX/Pergaminos/Pergaminos.fbx',
        (fbx) => {
            fbx.scale.set(0.1, 0.1, 0.1);
            fbx.position.set(20, 0, -10);
            fbx.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(fbx)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded Auto FBX')
        },
        (error) => {
            console.log(error)
        }
    );

    //Cargar un modelo FBX
    const fbxLoader3 = new FBXLoader()
    fbxLoader3.load(
        '../Models/FBX/ramen/ramen_bento.fbx',
        (fbx) => {
            fbx.scale.set(.5, .5, .5);
            fbx.position.set(20, 0,);
            fbx.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(fbx)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded Auto FBX')
        },
        (error) => {
            console.log(error)
        }
    );

    //Cargar un modelo FBX
    const fbxLoader5 = new FBXLoader()
    fbxLoader5.load(
        '../Models/FBX/Bloques/wood.fbx',
        (fbx) => {
            fbx.scale.set(.8, .8, .8);
            fbx.position.set(15, 3, 0);
            fbx.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(fbx)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded Auto FBX')
        },
        (error) => {
            console.log(error)
        }
    );





    // Crear una variable para el mezclador (mixer)
    let mixer;

    // Agregar objetos a la escena
    scene.add(plane);

    // Crear controles de cámara orbitales
    const cameraControl = new OrbitControls(camera, renderer.domElement);

    // Restringir la rotación de la cámara a solo mirar hacia el frente
    //cameraControl.minPolarAngle = Math.PI / 2; // Ángulo mínimo (mirar hacia arriba)
    //cameraControl.maxPolarAngle = Math.PI / 2; // Ángulo máximo (mirar hacia abajo)
    //cameraControl.minAzimuthAngle = 0; // Ángulo mínimo de azimut (rotación)
    //cameraControl.maxAzimuthAngle = 0; // Ángulo máximo de azimut (rotación)

    // Manejo de eventos de teclado para mover la cámara hacia arriba y abajo
    document.addEventListener('keydown', function (event) {
        const speed = 1; // Ajusta la velocidad de movimiento
        if (event.key === 'ArrowUp') {
            camera.position.y += speed;
        } else if (event.key === 'ArrowDown') {
            camera.position.y -= speed;
        }
    });


     //MELANY
     const mixers = [];

     function loadAnimatedFBXModel(path, position, scale, animationPath, rotation) {
       fbxLoader.load(
         path,
         (model) => {
           model.position.set(...position);
           model.scale.set(...scale);
           model.rotation.set(...rotation);
           model.castShadow = true;
 
           const animLoader = new FBXLoader();
           animLoader.load(animationPath, (anim) => {
             const mixer = new THREE.AnimationMixer(model);
             const clip = anim.animations[0];
             const action = mixer.clipAction(clip);
             action.play();
             mixers.push(mixer);
           });
 
           scene.add(model);
         },
         (xhr) => {
           console.log((xhr.loaded / xhr.total) * 100 + `% loaded ${path}`);
         },
         (error) => {
           console.log(error);
         }
       );
     }
 
 

     //-----------------CABALLERO OSCURO-----------------
     loadAnimatedFBXModel(
       '/Models/Animation/CaballeroOscuro/T-Pose.fbx',
       [11, 0, 12],
       [0.25, 0.25, 0.25],
       '/Models/Animation/CaballeroOscuro/dead.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
 
     loadAnimatedFBXModel(
       '/Models/Animation/CaballeroOscuro/T-Pose.fbx',
       [16, 0, 12],
       [0.25, 0.25, 0.25],
       '/Models/Animation/CaballeroOscuro/dead2.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
 
     loadAnimatedFBXModel(
       '/Models/Animation/CaballeroOscuro/T-Pose.fbx',
       [20, 0, 12],
       [0.25, 0.25, 0.25],
       '/Models/Animation/CaballeroOscuro/atack.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
 
     loadAnimatedFBXModel(
       '/Models/Animation/CaballeroOscuro/T-Pose.fbx',
       [24, 0, 12],
       [0.25, 0.25, 0.25],
       '/Models/Animation/CaballeroOscuro/walk.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
 
     //-----------------SAMURAI-----------------
     loadAnimatedFBXModel(
       '/Models/Animation/Samurai/T-Pose.fbx',
       [7, 0, -20],
       [0.01, 0.01, 0.01],
       '/Models/Animation/Samurai/Victory.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
     loadAnimatedFBXModel(
       '/Models/Animation/Samurai/T-Pose.fbx',
       [11, 0, -20],
       [0.01, 0.01, 0.01],
       '/Models/Animation/Samurai/run.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
 
     loadAnimatedFBXModel(
       '/Models/Animation/Samurai/T-Pose.fbx',
       [16, 0, -20],
       [0.01, 0.01, 0.01],
       '/Models/Animation/Samurai/death.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
 
     loadAnimatedFBXModel(
       '/Models/Animation/Samurai/T-Pose.fbx',
       [20, 0, -20],
       [0.01, 0.01, 0.01],
       '/Models/Animation/Samurai/stand.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
 
     loadAnimatedFBXModel(
       '/Models/Animation/Samurai/T-Pose.fbx',
       [24, 0, -20],
       [0.01, 0.01, 0.01],
       '/Models/Animation/Samurai/Taking Item.fbx',
       [0, Math.PI, 0] // Especificar rotación
     );
 
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

    // Crear un objeto jugador samurai
    const samurai = new THREE.Object3D();
    scene.add(samurai);

    const samuraiLoader = new FBXLoader();
    let samuraiMixer; // Variable para el mezclador del samurai

    function loadSamuraiModel() {
        samuraiLoader.load(
            '../Models/Animation/Samurai/T-Pose.fbx',
            (model) => {
                model.position.set(0, 0, 35);
                model.scale.set(0.01, 0.01, 0.01);
                model.rotation.set(0, Math.PI/2, 0); // Especificar rotación
    
                samurai.add(model); // Agrega el modelo del samurai al objeto "samurai"
    
                // Cargar todas las animaciones y configurar el mezclador
                samuraiMixer = new THREE.AnimationMixer(model);
    
                loadSamuraiAnimation('stand.fbx', 'stand', () => {
                    loadSamuraiAnimation('run.fbx', 'run', () => {
                        loadSamuraiAnimation('death.fbx', 'death', () => {
                            loadSamuraiAnimation('Taking Item.fbx', 'takingItem', () => {
                                loadSamuraiAnimation('Victory.fbx', 'victory', () => {
                                    // Después de cargar todas las animaciones, inicia la animación por defecto
                                    const action = samuraiMixer.clipAction('stand');
                                    action.play();
                                });
                            });
                        });
                    });
                });
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + `% loaded Samurai Model`);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    function loadSamuraiAnimation(animationPath, clipName, callback) {
        samuraiLoader.load(
            `../Models/Animation/Samurai/${animationPath}`,
            (anim) => {
                const clip = anim.animations[0];
                if (samuraiMixer) {
                    samuraiMixer.clipAction(clip).play();
                    samuraiMixer.clipAction(clip).paused = true; // Pausar la animación
                }
                if (callback) {
                    callback();
                }
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + `% loaded ${animationPath}`);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    
    loadSamuraiModel();

    // Lógica para reproducir la siguiente animación
    function playNextAnimation(animationName) {
        const action = samuraiMixer.clipAction(animationName);
        action.paused = false; // Reanudar la animación
        action.play();
        action.reset(); // Reiniciar la animación
    }
    // Cuando quieras reproducir la siguiente animación, llamas a playNextAnimation con el nombre de la animación que deseas reproducir.
    const doOnce=false;

    if(doOnce != true){
    playNextAnimation('stand.fbx'); // Ejemplo: reproducir la animación 'run'
    doOnce=true;
    }

    // Controles de movimiento para el jugador
    const speed = 0.5;

 


    //Controles jugador uno
    const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    const cube = new THREE.Mesh( geometry, material ); 
    cube.position.set(5,0,5);
    scene.add( cube );
    
    
    //Controles jugador dos
    const geometry2 = new THREE.BoxGeometry( 1, 1, 1 ); 
    const material2 = new THREE.MeshBasicMaterial( {color: 0x0000ff} ); 
    const cube2 = new THREE.Mesh( geometry2, material2 ); 
    cube2.position.set(-5,0,5);
    scene.add( cube2 );
    

    
    // Variable de control de movimiento para el jugador samurái
    let isSamuraiMovingForward = false;
    let isSamuraiMovingBackward = false;
    let isSamuraiMovingLeft = false;
    let isSamuraiMovingRight = false;
    let isWalking = false;
    
    // Manejo de eventos de teclado 
    document.onkeydown = function (e) {
        if (e.keyCode == 37) {
            cube.position.x -= 1;
            
        }
  
        if (e.keyCode == 39) {
            cube.position.x += 1;
            
        }
  
        if (e.keyCode == 38) {
            cube.position.z -= 1;
        }
  
        if (e.keyCode == 40) {
            cube.position.z += 1;
        }


        // WASD
        if (e.keyCode === 87) { // Tecla W
            // Mover hacia adelante
            // Tu lógica para mover hacia adelante aquí
        } 
        if (e.keyCode === 65) { // Tecla A
            cube2.position.x -= 1;
            isSamuraiMovingLeft = true;
            isSamuraiMovingRight = false;
            
        } 
        if (e.keyCode === 83) { // Tecla S
            // Mover hacia atrás
            // Tu lógica para mover hacia atrás aquí
        } 
        if (e.keyCode === 68) { // Tecla D
            cube2.position.x += 1;
            isSamuraiMovingRight = true;
            isSamuraiMovingLeft = false;
            
        }

        
    };


    function animatePlayerSamurai() {
        // Tu lógica para mover el jugador aquí
        // Por ejemplo:
        if (isSamuraiMovingForward) {
            samurai.position.z -= speed;
        }
        if (isSamuraiMovingBackward) {
            samurai.position.z += speed;
        }
        if (isSamuraiMovingLeft) {
            samurai.position.x -= speed;
            isSamuraiMovingLeft=false;
            
        }
        if (isSamuraiMovingRight) {
            samurai.position.x += speed;
            isSamuraiMovingRight = false;
            
        }


        // Actualizar el mezclador del samurai
        if (samuraiMixer) {
            samuraiMixer.update(0.01);
        }
    }
    
    

    // Función para animar la escena
    function animate() {
        // Llama a la función para controlar el movimiento del jugador samurái
        animatePlayerSamurai();

        renderer.render(scene, camera);
        requestAnimationFrame(animate);

        mixers.forEach((mixer) => {
            mixer.update(0.01);
          });


    }


    animate();
});
