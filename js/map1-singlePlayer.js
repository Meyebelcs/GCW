// Importar las bibliotecas y módulos necesarios
import * as THREE from "../libs/three.module.js";
import { OrbitControls } from "../libs/OrbitControls.js";
import { STLLoader } from "../libs/STLLoader.js";
import { GLTFLoader } from "../libs/GLTFLoader.js";
import { FBXLoader } from "../libs/FBXLoader.js";
import { OBJLoader } from "../libs/OBJLoader.js";

document.addEventListener("DOMContentLoaded", function () {
    // Crear una escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#34495E");

    // Crear una cámara de perspectiva
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight
    );
    camera.position.set(0, 0, 10);

    // Crea un renderizador WebGL
    const renderer = new THREE.WebGLRenderer();
    const imagePlay = document.querySelector('.image-play');
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
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "slategrey",
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotateX(-Math.PI / 2);
    plane.position.set(0, -0.5, 0);

    // Función para redimensionar la ventana en caso de cambio de tamaño
    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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
        obj.position.set(4, 0, 20);
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

    // Cargar el modelo FBX Animado
    fbxLoader.load(
        '../Models/Animation/akai_e_espiritu.fbx', // Cargar el modelo FBX en pose T
        (fbx2) => {
            fbx2.scale.set(0.03, 0.03, 0.03);
            fbx2.position.set(-5, 0, -10);
            fbx2.castShadow = true; // Habilitar sombras para el objeto FBX

            // Cargar la animación de Mixamo sin piel
            const animLoader = new FBXLoader();
            animLoader.load('../Models/Animation/Rifle Run.fbx', (anim) => {
                // Crear un mezclador para el modelo FBX y asignar la animación
                mixer = new THREE.AnimationMixer(fbx2);
                const clip = anim.animations[0];
                const action = mixer.clipAction(clip);
                action.play();
            });

            scene.add(fbx2);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded akai FBX');
        },
        (error) => {
            console.log(error);
        }
    );


    // Agregar objetos a la escena
    scene.add(plane);

    // Crear controles de cámara orbitales
    const cameraControl = new OrbitControls(camera, renderer.domElement);

    // Restringir la rotación de la cámara a solo mirar hacia el frente
    cameraControl.minPolarAngle = Math.PI / 2; // Ángulo mínimo (mirar hacia arriba)
    cameraControl.maxPolarAngle = Math.PI / 2; // Ángulo máximo (mirar hacia abajo)
    cameraControl.minAzimuthAngle = 0; // Ángulo mínimo de azimut (rotación)
    cameraControl.maxAzimuthAngle = 0; // Ángulo máximo de azimut (rotación)

    // Manejo de eventos de teclado para mover la cámara hacia arriba y abajo
    document.addEventListener('keydown', function (event) {
        const speed = 1; // Ajusta la velocidad de movimiento
        if (event.key === 'ArrowUp') {
            camera.position.y += speed;
        } else if (event.key === 'ArrowDown') {
            camera.position.y -= speed;
        }
    });

    // Función para animar la escena
    function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);

        if(mixer){
            mixer.update(0.01);
        }
    }

    animate();
});
