// Importar las bibliotecas y módulos necesarios
import * as THREE from "../libs/three.module.js";
import { OrbitControls } from "../libs/OrbitControls.js";
import { GLTFLoader } from "../libs/GLTFLoader.js";
import { FBXLoader } from "../libs/FBXLoader.js";
import { OBJLoader } from "../libs/OBJLoader.js";
import { TransformControls } from '../libs/TransformControls.js';


document.addEventListener("DOMContentLoaded", function () {
    // Obtener el elemento .image-play
    const imagePlay = document.querySelector('.image-play');
    let canShoot = true;
    var enemyCD = true;

    let ramenModel;
    let chanclaModel;
    let chanclaModel2;
    let katanaModel;
    let pergaminoModel;

    var disparoizquierda = false;
    var disparoDerecha = false;

    let timerInterval; // Variable para almacenar el intervalo del temporizador
    let gameTimer = 0; // Contador de tiempo en segundos
    let isJumping = false; // Indica si el personaje está en el aire debido a un salto

    startGameTimer();

    // MENOR CD
    var BuffCD = false;
    // velocidad
    var BuffSpeed = false;
    // NO DMG
    var KatanaBuff = false;

    var speed = 1.0;

    var vida = 3;

    const enemyProjectiles = []; // Array para cubos lanzados por los enemigos
    const playerProjectiles = []; // Array para cubos lanzados por el jugador


    //AUDIOS

    // Crear un objeto Audio
    const LvlMusic = new Audio('../Audios/Music_FirstLevel_Normal.mp3');
    const ShootSound = new Audio('../Audios/shoot_sound.wav');
    const playerShootSound = new Audio('../Audios/player_shoot.wav');
    const playerHurt = new Audio('../Audios/playerhurt.wav');
    const enemyDeath = new Audio('../Audios/enemyDeath.wav');
    const gameOver = new Audio('../Audios/gameOver.mp3');
    const eatingRamen = new Audio('../Audios/eatingRamen.wav');
    const takingSandals = new Audio('../Audios/sandals.wav');
    const win = new Audio('../Audios/win.wav');


    // Función para reproducir el audio después de la interacción del usuario
    function reproducirMusicaNivel() {
        // Reproducir la música de fondo
        LvlMusic.play();
    }

    // Escuchar el evento de interacción del usuario (por ejemplo, un clic)
    document.addEventListener('click', reproducirMusicaNivel);


    // Repetir la música cuando termine
    LvlMusic.addEventListener('ended', function () {
        LvlMusic.currentTime = 0; // Reiniciar la reproducción desde el principio
        LvlMusic.play();
    });

    // Crear una escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#34495E");

    // Crear una cámara de perspectiva
    const columnWidth = imagePlay.clientWidth; // Obtén el ancho de la columna
    const columnHeight = imagePlay.clientHeight; // Obtén el alto de la columna

    const camera = new THREE.PerspectiveCamera(60, columnWidth / columnHeight);
    camera.position.set(0, 40, 80);

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
    directionalLight.position.set(0, 40, 90);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Crear una luz puntual (roja) lava
    // const pointLightred = new THREE.PointLight(0xff0000, 4);
    //scene.add(pointLightred);

    // Crear una luz puntual (azul) hielo
    const pointLightblue = new THREE.PointLight(0x0000ff, 4);
    scene.add(pointLightblue);

    // Crear una luz puntual amarilla intensa
    const goldenAuraLight = new THREE.PointLight(0xffd700, 2);
    goldenAuraLight.position.set(0, 50, 0);

    // Ajustar el rango para que sea más pequeño
    goldenAuraLight.distance = 30; // Ajusta este valor según tus necesidades

    scene.add(goldenAuraLight);

    // Crear una textura para las partículas (un pequeño círculo blanco)
    const particleTexture = new THREE.TextureLoader().load('../Assets/nieve.png');
    // Crear material para las partículas
    const particleMaterial = new THREE.PointsMaterial({
        size: 1, // Tamaño de las partículas
        map: particleTexture, // Textura de las partículas
        transparent: true, // Hacer las partículas transparentes
        blending: THREE.AdditiveBlending, // Mezcla aditiva para un efecto de nieve más realista
        depthWrite: false, // No escribir en el búfer de profundidad para que las partículas no oculten otras cosas
        color: 0xffffff // Color blanco
    });
    // Crear geometría de partículas
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500; // Número de partículas

    // Arrays para almacenar las posiciones de las partículas
    const positions = new Float32Array(particleCount * 3);

    // Inicializar las posiciones de las partículas de manera aleatoria
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200; // Posición X aleatoria
        positions[i + 1] = Math.random() * 100; // Posición Y aleatoria (altura)
        positions[i + 2] = (Math.random() - 0.5) * 200; // Posición Z aleatoria
    }

    // Añadir atributo de posición a la geometría
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Crear objeto de partículas y añadirlo a la escena
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    //------------------------------------

    // PLANO
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "slategrey",
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotateX(-Math.PI / 2);
    plane.position.set(0, -0.5, 0);
    scene.add(plane);

    // Función para redimensionar la ventana en caso de cambio de tamaño
    function resize() {
        camera.aspect = columnWidth / columnHeight; // Utiliza las dimensiones de la columna
        camera.updateProjectionMatrix();
        renderer.setSize(columnWidth, columnHeight);
        renderer.render(scene, camera);
    }

    window.addEventListener("resize", resize);

    //------------------------------ CARGA DE SAMURAI--------------------------------------

    const loaderFBX = new FBXLoader();
    let samurai;
    let samuraiBB;
    let firstTime = true;
    let firstTimeClic = true;

    const mixers = [];

    function loadAnimatedFBXModel(path, position, scale, animationPath, rotation) {
        loaderFBX.load(
            path,
            (model) => {
                samurai = model;

                samurai.position.set(...position);
                samurai.scale.set(...scale);
                samurai.rotation.set(...rotation);
                samurai.castShadow = true;

                const animLoader = new FBXLoader();
                animLoader.load(animationPath, (anim) => {
                    const mixer = new THREE.AnimationMixer(samurai);
                    const clip = anim.animations[0];
                    const action = mixer.clipAction(clip);
                    action.play();
                    mixers.push(mixer);
                });

                // Calcular la caja delimitadora desde la geometría del objeto
                samuraiBB = new THREE.Box3().setFromObject(samurai);

                scene.add(samurai);
            }
        );
    }


    // Función para cargar el modelo del samurái con la animación según el status
    function cargarSamuraiModelo(status, rotationValue) {
        scene.remove(samurai);
        mixers.forEach((mixer) => {
            mixer.stopAllAction();
            mixer.uncacheRoot(samurai);
        });
        mixers.length = 0;

        let position;
        if (firstTime) {
            position = [14, 16, 20];
            firstTime = false;
        } else {
            position = samurai.position; //posicion actual de samurai
        }

        switch (status) {

            case "isStand": {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/stand.fbx',
                    [0, 0, 0]
                );
            } break;

            case "isRunning": {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/run.fbx',
                    [0, rotationValue, 0]// Especificar rotación
                );
            } break;

            case "isDeath": {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/death.fbx',
                    [0, rotationValue, 0] // Especificar rotación
                );
            } break;

            case "isTakingItem": {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/Taking Item.fbx',
                    [0, rotationValue, 0] // Especificar rotación
                );
            } break;

            case "isVictory": {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/Victory.fbx',
                    [0, rotationValue, 0] // Especificar rotación
                );
            } break;

            case "isAtack1": {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/atack1.fbx',
                    [0, rotationValue, 0] // Especificar rotación
                );
            } break;

            case "isAtack2": {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/atack2.fbx',
                    [0, rotationValue, 0] // Especificar rotación
                );
            } break;

            case "isAtack3": {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/atack3.fbx',
                    [0, rotationValue, 0] // Especificar rotación
                );
            } break;

            default: {
                loadAnimatedFBXModel(
                    '../Models/Animation/Samurai/T-Pose.fbx',
                    position,
                    [0.01, 0.01, 0.01],
                    '../Models/Animation/Samurai/stand.fbx',
                    [0, 0, 0]
                );
            }
        }
    }

    // Llama a la función inicialmente
    cargarSamuraiModelo("isStand", 0);

    //------------------------------ CARGA DE ENEMIGO--------------------------------------

    let enemies = [];

    const enemyLoader = new FBXLoader();

    function addEnemyInfo(enemyInfo) { //agrega al enemigo al array
        enemies.push(enemyInfo);
    }

    function loadAnimatedFBXEnemy(enemyInfo, path, animationPath, position, scale, rotation, collisionBoxScaleXZ) {
        enemyLoader.load(
            path,
            (modelenemy) => {

                enemyInfo.enemy = modelenemy;

                modelenemy.position.set(...position);
                modelenemy.scale.set(...scale);
                modelenemy.rotation.set(...rotation);
                modelenemy.castShadow = true;

                const animLoader = new FBXLoader();
                animLoader.load(animationPath, (anim) => {
                    const mixer = new THREE.AnimationMixer(modelenemy);
                    const clip = anim.animations[0];
                    const action = mixer.clipAction(clip);
                    action.play();
                    enemyInfo.mixers.push(mixer);
                });

                // Calcular la caja delimitadora desde la geometría del objeto
                enemyInfo.enemyBB = new THREE.Box3().setFromObject(modelenemy);

                // Ajustar el tamaño de la caja de colisión solo en los ejes X y Z
                enemyInfo.enemyBB.max.x += collisionBoxScaleXZ;
                enemyInfo.enemyBB.min.x -= collisionBoxScaleXZ;
                enemyInfo.enemyBB.max.z += collisionBoxScaleXZ;
                enemyInfo.enemyBB.min.z -= collisionBoxScaleXZ;

                // Ajustar el tamaño de la caja de colisión en el eje Y

                scene.add(modelenemy);

            }
        );
    }

    function cargarEnemyModelo(enemyInfo, status, rotationValue) {
        scene.remove(enemyInfo.enemy);
        enemyInfo.mixers.forEach((mixer) => {
            mixer.stopAllAction();
            mixer.uncacheRoot(enemyInfo.enemy);
        });
        enemyInfo.mixers.length = 0;


        if (enemyInfo.firstTime) {
            enemyInfo.positionEnemy = enemyInfo.initialPosition;
            enemyInfo.firstTime = false;
        } else {
            enemyInfo.positionEnemy = enemyInfo.enemy.position;
        }

        switch (status) {
            case "isStand1":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/stand1.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, 0, 0],
                    70 //el tamaño de la colision
                );
                break;

            case "isStand2":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/stand2.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, 0, 0],
                    70 //el tamaño de la colision
                );
                break;

            case "isStand3":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/stand2.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, 0, 0],
                    70 //el tamaño de la colision
                );
                break;

            case "isWalking":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/Walking.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, rotationValue, 0],
                    70  //el tamaño de la colision
                );
                break;

            case "isAtack":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/atack.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, rotationValue, 0],
                    70//el tamaño de la colision
                );
                break;

            case "isAtack2":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/atack2.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, rotationValue, 0],
                    70  //el tamaño de la colision
                );
                break;

            case "isAtack3":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/atack3.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, rotationValue, 0],
                    70 //el tamaño de la colision
                );
                break;


            case "dead":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/dead.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, rotationValue, 0],
                    70 //el tamaño de la colision
                );
                break;

            case "dead2":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/dead2.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, rotationValue, 0],
                    70 //el tamaño de la colision
                );
                break;

            case "dead3":
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/dead3.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, rotationValue, 0],
                    70 //el tamaño de la colision
                );
                break;


            default:
                loadAnimatedFBXEnemy(enemyInfo,
                    '../Models/Animation/CaballeroOscuro/T-Pose.fbx',
                    '../Models/Animation/CaballeroOscuro/stand1.fbx',
                    enemyInfo.positionEnemy,
                    [0.25, 0.25, 0.25],
                    [0, 0, 0],
                    70  //el tamaño de la colision
                );
                break;
        }
    }


    // añadir información de enemigos al array
    const enemyInfo1 = {
        enemy: null,
        enemyBB: null,
        firstTime: true,
        mixers: [],
        initialPosition: [10, 27, 20],
        positionEnemy: [0, 0, 0],
        firstTimeCollision: false
    };

    const enemyInfo2 = {
        enemy: null,
        enemyBB: null,
        firstTime: true,
        mixers: [],
        initialPosition: [-10, 51, 20],
        positionEnemy: [0, 0, 0],
        firstTimeCollision: false
    };

    const enemyInfo3 = {
        enemy: null,
        enemyBB: null,
        firstTime: true,
        mixers: [],
        initialPosition: [-10, 73, 20],
        positionEnemy: [0, 0, 0],
        firstTimeCollision: false
    };


    const enemyInfo4 = {
        enemy: null,
        enemyBB: null,
        firstTime: true,
        mixers: [],
        initialPosition: [15, 99, 20],
        positionEnemy: [0, 0, 0],
        firstTimeCollision: false
    };

    const enemyInfo5 = {
        enemy: null,
        enemyBB: null,
        firstTime: true,
        mixers: [],
        initialPosition: [11, 136, 20],
        positionEnemy: [0, 0, 0],
        firstTimeCollision: false
    };

    const enemyInfo6 = {
        enemy: null,
        enemyBB: null,
        firstTime: true,
        mixers: [],
        initialPosition: [14, 159, 20],
        positionEnemy: [0, 0, 0],
        firstTimeCollision: false
    };

    const enemyInfo7 = {
        enemy: null,
        enemyBB: null,
        firstTime: true,
        mixers: [],
        initialPosition: [15, 188, 20],
        positionEnemy: [0, 0, 0],
        firstTimeCollision: false
    };

    const enemyInfo8 = {
        enemy: null,
        enemyBB: null,
        firstTime: true,
        mixers: [],
        initialPosition: [15, 218, 20],
        positionEnemy: [0, 0, 0],
        firstTimeCollision: false
    };




    addEnemyInfo(enemyInfo1);
    addEnemyInfo(enemyInfo2);
    addEnemyInfo(enemyInfo3);
    addEnemyInfo(enemyInfo4);
    addEnemyInfo(enemyInfo5);
    addEnemyInfo(enemyInfo6);
    addEnemyInfo(enemyInfo7);
    addEnemyInfo(enemyInfo8);

    // Llama a la función inicialmente con el primer enemigo
    cargarEnemyModelo(enemies[0], "isStand1", 0);
    cargarEnemyModelo(enemies[1], "isStand2", 0);
    cargarEnemyModelo(enemies[2], "isStand1", 0);
    cargarEnemyModelo(enemies[3], "isStand2", 0);
    cargarEnemyModelo(enemies[4], "isStand1", 0);
    cargarEnemyModelo(enemies[5], "isStand2", 0);
    cargarEnemyModelo(enemies[6], "isStand1", 0);
    cargarEnemyModelo(enemies[7], "isStand2", 0);
    //--------------------------------- CARGA MODELOS ESCENARIO CON COLISION ----------------------------------

    let objects = [];
    let boxes = [];

    function cargarModeloFBX(path, scale, position, rotation = [0, 0, 0]) {
        loaderFBX.load(path, function (loadedObject) {
            const object = loadedObject;
            object.scale.set(scale[0], scale[1], scale[2]);
            object.position.set(position[0], position[1], position[2]);
            object.rotation.set(rotation[0], rotation[1], rotation[2]);

            const boxCollision = new THREE.Box3().setFromObject(object);
            scene.add(object);

            objects.push(object);
            boxes.push(boxCollision);


        });
    }




    cargarModeloFBX("../Models/Torre/Hielo/paredIzq.fbx", [2, 2, 2], [0, 0, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/paredDer.fbx", [2, 2, 2], [0, 0, 0]);

    /* ===================ESCENARIO DE HIELO===================== */
    cargarModeloFBX("../Models/Torre/Hielo/base.fbx", [2, 2, 2], [0, 0, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b1.fbx", [2, 2, 2], [0, 0, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b2.fbx", [2, 2, 2], [0, 0, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b3.fbx", [2, 2, 2], [0, 0, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b4.fbx", [2, 2, 2], [0, 0, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b3.fbx", [2, 2, 2], [0, 23, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b4.fbx", [2, 2, 2], [0, 23, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b1.fbx", [2, 2, 2], [0, 58, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b2.fbx", [2, 2, 2], [0, 60, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b3.fbx", [2, 2, 2], [0, 60, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b4.fbx", [2, 2, 2], [0, 60, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b2.fbx", [2, 2, 2], [0, 84, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b1.fbx", [2, 2, 2], [0, 108, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b2.fbx", [2, 2, 2], [0, 110, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b3.fbx", [2, 2, 2], [0, 120, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b4.fbx", [2, 2, 2], [0, 123, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b1.fbx", [2, 2, 2], [0, 160, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b4.fbx", [2, 2, 2], [0, 152, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b1.fbx", [2, 2, 2], [0, 190, 0]);
    cargarModeloFBX("../Models/Torre/Hielo/b4.fbx", [2, 2, 2], [0, 182, 0]);


    // OBJETOS


    // cargarModeloFBX2("../Models/FBX/Pergaminos/Pergaminos.fbx", [0.3, 0.3, 0.3], [-10, 233, 20], [0, 0, 0]);

    //Cargar un modelo FBX
    const ramenLoader = new FBXLoader()
    ramenLoader.load(
        '../Models/FBX/ramen/ramen_bento.fbx',
        (ramen) => {
            ramenModel = ramen;
            ramenModel.scale.set(.8, .8, .8);
            ramenModel.position.set(13, 62, 20);
            ramenModel.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(ramenModel)
        }
    );

    //Cargar un modelo FBX
    const chanclaLoader = new FBXLoader()
    chanclaLoader.load(
        '../Models/FBX/Chancla/ChanclaBlack.fbx',
        (chancla) => {
            chanclaModel = chancla;
            chanclaModel.scale.set(0.4, 0.4, 0.4);
            chanclaModel.position.set(-10, 102, 20);
            chanclaModel.rotation.set(0, 90, 90);
            chanclaModel.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(chanclaModel)
        }
    );

    const katanaLoader = new FBXLoader()
    katanaLoader.load(
        '../Models/FBX/Katana/Katana.fbx',
        (katana) => {
            katanaModel = katana;
            katanaModel.scale.set(0.02, 0.02, 0.02);
            katanaModel.position.set(-15, 203, 20);
            katanaModel.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(katanaModel)
        }
    );


    const chanclaLoader2 = new FBXLoader()
    chanclaLoader2.load(
        '../Models/FBX/Chancla/ChanclaBlack.fbx',
        (chancla) => {
            chanclaModel2 = chancla;
            chanclaModel2.scale.set(0.4, 0.4, 0.4);
            chanclaModel2.position.set(-10, 152, 20);
            chanclaModel2.rotation.set(0, 90, 90);
            chanclaModel2.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(chanclaModel2)
        }
    );


    const pergaminoLoader = new FBXLoader()
    pergaminoLoader.load(
        '../Models/FBX/Pergaminos/Pergaminos.fbx',
        (pergamino) => {
            pergaminoModel = pergamino;
            pergaminoModel.scale.set(0.2, 0.2, 0.2);
            pergaminoModel.position.set(-10, 233, 20);
            pergaminoModel.rotation.set(0, 90, 0);
            pergaminoModel.castShadow = true; // Habilitar sombras para el objeto FBX
            scene.add(pergaminoModel)
        }
    );




    //---------------------------------COLISIONES----------------------------------
    function checkCollisions() {
        getCollisionItems();
        checkCollisionsEnemy();
    }

    function checkCollisionsEnemy() {


        // Por cada enemigo en el array 'enemies'
        for (const enemyInfo of enemies) {
            // Verifica si la caja de delimitación del samurái colisiona con la del enemigo actual
            const isColliding = samuraiBB.intersectsBox(enemyInfo.enemyBB);


            if (isColliding) {
                if (enemyCD) {
                    ShootSound.play();
                    launchCube(enemyInfo.enemy, enemyCD);
                }
            }



            // Si está colisionando y es la primera vez que se detecta la colisión
            if (isColliding && enemyInfo.firstTimeCollision == false) {

                // Aquí puedes hacer algo si hay colisión y es la primera vez
                console.log('¡Colisión en rango de enemigo!');
                // Calcula el ángulo hacia el samurai
                const anguloHaciaSamurai = calcularAnguloHaciaSamurai(enemyInfo.enemy, samurai);
                // el enemigo entra en modo persecusión y gira hacia el samurai
                cargarEnemyModelo(enemyInfo, "isAttack2", (anguloHaciaSamurai * -1));
                // Lanza el cubo desde el enemigo hacia el jugador
                // Marcar que ya se ha registrado la colisión
                enemyInfo.firstTimeCollision = true;

                return;
            }

            // Si no está colisionando pero ya se había detectado la colisión anteriormente
            if (!isColliding && enemyInfo.firstTimeCollision == true) {
                // Aquí puedes hacer algo si el samurai sale del rango de colisión
                console.log('Samurai salió del rango de colisión con enemigo');
                //alert('Samurai salió del rango de colisión con enemigo');

                //el enemigo está tranquilo
                cargarEnemyModelo(enemies[0], "isStand1", 0);
                cargarEnemyModelo(enemies[1], "isStand2", 0);


                // Restablecer la bandera para detectar futuras colisiones
                enemyInfo.firstTimeCollision = false;

                return;
            }
        }
    }

    function calcularAnguloHaciaSamurai(enemigo, samurai) {
        const deltaX = samurai.position.x - enemigo.position.x;
        const deltaY = samurai.position.z - enemigo.position.z;

        // Calcula el ángulo en radianes
        const radianes = Math.atan2(deltaY, deltaX);

        // Convierte el ángulo a grados y ajusta para Three.js (donde 0 grados está en el eje Z)
        const grados = THREE.MathUtils.radToDeg(radianes) - 90;

        return grados;
    }

    //--------------------------MOVIMIENTO--------------------------------------



    document.addEventListener('keydown', function (event) {


        if (event.key === 'z') {
            getPlayerPosition(); // Llama a la función para obtener la posición del jugador
        }

        // Cámara
        if (event.key === 'w') {
            camera.position.y += speed;
        } else if (event.key === 's') {
            camera.position.y -= speed;
        }

        if (event.key === 'k') {
            handleShoot();
        }


        // TODO: HACER QUE LA ANIMACION DE ATAQUE SEA HACIA LA DERECHA O HACIA LA IZQUIERDA. 
        if (event.key === 'a') {
            if (canShoot) {
                disparoizquierda = true;
                disparoDerecha = false;
            }
        }

        if (event.key === 'd') {
            if (canShoot) {
                disparoizquierda = false;
                disparoDerecha = true;
            }
        }

        // Almacena la posición actual del samurái
        const tempPosition = samurai.position.clone();
        const tempBB = samuraiBB.clone();

        // Maneja el movimiento y carga de modelos

        if (event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') {

           //Saber si la persona esta saltando
           if (event.key === 'w' && !isJumping) {
            // Inicia el salto si no está en el aire
            isJumping = true;
            //jumpVelocity = 0.5; // Ajusta según sea necesario
        }
           
            handleMovement(event, tempPosition, tempBB, speed);
        } else if ((event.key === 'e' || event.key === 'q') && firstTimeClic) {
            handleAttack(event);
        }

        // Verifica la colisión con boxCollision de torre
        const canMove = checkCollisionTower(tempBB);

        // Si no hay colisión, asigna la nueva posición
        if (canMove) {
            samurai.position.copy(tempPosition);
            samuraiBB.copy(tempBB);
        }
    });


    document.addEventListener('keyup', function (event) {
 

        switch (event.key) {
            case 'w':
                    //Saber si la persona esta saltando
                    if (event.key === 'w' && isJumping) {
                        // Inicia el salto si no está en el aire
                        isJumping = false;
                        //jumpVelocity = 0.5; // Ajusta según sea necesario
                    }
                break;
            case 's':
                //moveBackward = true;
                break;
            case 'a':
               // moveLeft = true;
                break;
            case 'd':
               // moveRight = true;
                break;
        }



    });


    function keepFall (){
        const tempPosition2 = samurai.position.clone();
        const tempBB2 = samuraiBB.clone();

        tempPosition2.y -= 0.1;
        tempBB2.translate(new THREE.Vector3(0, -0.1, 0));

        // Verifica la colisión con boxCollision de torre
        const canMove = checkCollisionTower(tempBB2);

        // Si no hay colisión, asigna la nueva posición
        if (canMove) {
            samurai.position.copy(tempPosition2);
            samuraiBB.copy(tempBB2);
        }
        camera.position.y = samurai.position.y;
    }


    function handleMovement(event, position, boundingBox, speed) {
        // Mueve hacia arriba
        if (event.key === 'w') {
            position.y += speed;
            boundingBox.translate(new THREE.Vector3(0, speed, 0));
        }
        // Mueve hacia abajo
        else if (event.key === 's') {
            position.y -= speed;
            boundingBox.translate(new THREE.Vector3(0, -speed, 0));
        }
        // Mueve hacia la izquierda o derecha
        else if (event.key === 'a' || event.key === 'd') {
            // Solo carga el modelo la primera vez que se presiona una tecla 
            if (firstTimeClic) {
                cargarSamuraiModelo("isRunning", (event.key === 'a') ? -Math.PI / 2 : Math.PI / 2);
                firstTimeClic = false;
            }
            // Mueve hacia la izquierda o derecha según la tecla presionada
            position.x += (event.key === 'a') ? -speed : speed;
            boundingBox.translate(new THREE.Vector3((event.key === 'a') ? -speed : speed, 0, 0));
        }
    }

    function handleAttack(event) {
        // Encuentra el enemigo con el que colisiona actualmente
        const collidedEnemy = getCollidedEnemy();

        // Calcula el ángulo hacia el enemigo, o usa 0 si no hay colisión
        const anguloHaciaEnemigo = collidedEnemy ? calcularAnguloHaciaSamurai(collidedEnemy.enemy, samurai) : 0;

        // Determina la animación de ataque según la tecla presionada
        const animacionAtaque = event.key === 'e' ? "isAtack2" : "isAtack3";

        // Carga el modelo del samurái con la animación de ataque y la rotación hacia el enemigo
        cargarSamuraiModelo(animacionAtaque, anguloHaciaEnemigo);
        firstTimeClic = false;
    }

    function checkCollisionTower(boundingBox) {
        // Verifica la colisión con boxCollision
        for (let i = 0; i < boxes.length; i++) {
            if (boundingBox.intersectsBox(boxes[i])) {
                return false;
            }
        }
        return true;
    }


    // Agregar este bloque para manejar el evento de soltar las teclas
    document.addEventListener('keyup', function (event) {

        if (event.key === 'a' || event.key === 'd' || event.key === 'e' || event.key === 'q') {

            cargarSamuraiModelo("isStand", [0, 0, 0]);// Marcamos que el personaje ya no está en movimiento
            firstTimeClic = true; // Restaurar el valor para la próxima vez que se presione una tecla de flecha
        }
    });

    //funcion para saber con cual enemigo colisiona y asi girar el samurai en el ataque
    function getCollidedEnemy() {
        // Por cada enemigo en el array 'enemies'
        for (const enemyInfo of enemies) {
            // Verifica si la caja de delimitación del samurái colisiona con la del enemigo actual
            const isColliding = samuraiBB.intersectsBox(enemyInfo.enemyBB);

            // Si está colisionando, devuelve el enemigo actual
            if (isColliding) {
                return enemyInfo;
            }
        }

        // Si no hay colisión con ningún enemigo, devuelve null
        return null;
    }

    // Crear controles de cámara orbitales
    const cameraControl = new OrbitControls(camera, renderer.domElement);

    // Restringir la rotación de la cámara a solo mirar hacia el frente
    cameraControl.minPolarAngle = Math.PI / 2; // Ángulo mínimo (mirar hacia arriba)
    cameraControl.maxPolarAngle = Math.PI / 2; // Ángulo máximo (mirar hacia abajo)
    cameraControl.minAzimuthAngle = 0; // Ángulo mínimo de azimut (rotación)
    cameraControl.maxAzimuthAngle = 0; // Ángulo máximo de azimut (rotación)

    // Función para animar la escena
    function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        if(!isJumping){
            keepFall();
        }
        checkCollisions();
        CheckVida();

        // Animar las partículas moviéndolas hacia abajo (simulando la caída de la nieve)
        particleGeometry.attributes.position.array.forEach((position, index) => {
            particleGeometry.attributes.position.array[index + 1] -= 0.1; // Ajusta la velocidad de caída según tus necesidades
            if (particleGeometry.attributes.position.array[index + 1] < 0) {
                particleGeometry.attributes.position.array[index + 1] = 100; // Reiniciar posición si la partícula llega al suelo
            }
        });
        particleGeometry.attributes.position.needsUpdate = true;

        // Actualizar la posición de la luz para que siga a la cámara
        //pointLightred.position.copy(camera.position);
        pointLightblue.position.copy(camera.position);

        if (samurai) {
            goldenAuraLight.position.copy(samurai.position);
        }

        if (BuffCD == true) {
            LessCD();
        }

        if (BuffSpeed == true) {
            MoreSpeed();
        }

        if (KatanaBuff == true) {
            EnemyCantAttack();
        }


        mixers.forEach((mixer) => {
            mixer.update(0.02);
        });
        // Actualiza los mezcladores de los enemigos
        enemies.forEach((enemyInfo) => {
            enemyInfo.mixers.forEach((mixer) => {
                mixer.update(0.01);
            });
        });


    }

    animate();




    function launchCube(enemigo) {

        enemyCD = false;
        const cubeGeometry = new THREE.SphereGeometry(1, 32, 32); // Geometría de una esfera (bolita)
        const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        enemyProjectiles.push(cube)

        const cubeYOffset = 5; // Valor para ajustar la posición vertical del cubo
        cube.position.copy(enemigo.position).add(new THREE.Vector3(0, cubeYOffset, 0));

        // Calcula la dirección hacia el jugador
        // Calcula la dirección horizontal hacia el jugador
        const playerX = samurai.position.x;
        const enemyX = enemigo.position.x;
        const directionX = Math.sign(playerX - enemyX);

        // Define la velocidad del cubo solo en el eje X
        const speedX = 0.2;

        // Actualiza la posición del cubo solo en el eje X en cada cuadro de animación
        function updateCube() {
            const distanceX = directionX * speedX;
            cube.position.x += distanceX;
        }
        // Agrega el cubo a la escena
        scene.add(cube);

        // Elimina el cubo después de un tiempo determinado (ejemplo: 3 segundos)
        setTimeout(() => {
            scene.remove(cube);
            enemyCD = true;
        }, 1500);

        // Llama a la función 'updateCube' en cada cuadro de animación
        function animateCube() {
            updateCube();
            renderer.render(scene, camera);
            requestAnimationFrame(animateCube);
            handleProjectileCollision();
        }

        animateCube();
    }




    function handleShoot() {
        if (!canShoot) {
            return; // Evita disparos continuos
        }

        playerShootSound.play();
        canShoot = false; // Evita disparos consecutivos

        // Código para crear y lanzar la bolita de disparo
        // Crear la geometría de la bolita (esfera)
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

        // Crear el material de la bolita con color blanco y sombreado detallado
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.5 });

        // Crear la bolita
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        playerProjectiles.push(sphere);

        const sphereYOffset = 5; // Valor para ajustar la posición vertical de la bolita
        sphere.position.copy(samurai.position).add(new THREE.Vector3(0, sphereYOffset, 0));

        // Código para lanzar la bolita
        const speedZ = 0.2;
        function updateSphere() {
            if (disparoizquierda)
                sphere.position.x -= speedZ;
            else if (disparoDerecha) {
                sphere.position.x += speedZ;
            }
        }

        scene.add(sphere);


        if (BuffCD == true) {
            setTimeout(() => {
                canShoot = true; // Permite disparos nuevamente después de un cierto período de tiempo
            }, 300);

            setTimeout(() => {
                scene.remove(sphere);
            }, 1500);
        }
        else {
            setTimeout(() => {
                scene.remove(sphere);
                canShoot = true; // Permite disparos nuevamente después de un cierto período de tiempo
            }, 1500);
        }


        function animateSphere() {
            updateSphere();
            renderer.render(scene, camera);
            requestAnimationFrame(animateSphere);
            handleProjectileCollision();
        }

        animateSphere();
    }


    function handleProjectileCollision() {
        // Verificar colisiones de cubos lanzados por los enemigos con el samurái
        for (const projectile of enemyProjectiles) {
            const distanceX = Math.abs(projectile.position.x - samurai.position.x);
            const distanceY = Math.abs(projectile.position.y - samurai.position.y);
            if (distanceX < 1 && distanceY < 5) {
                // alert('¡El cubo lanzado por el enemigo ha chocado con el samurái!');
                scene.remove(projectile);
                enemyProjectiles.splice(enemyProjectiles.indexOf(projectile), 1);
                // SONIDO DE DAÑO

                if (KatanaBuff != true) {
                    playerHurt.play();
                    vida = vida - 1;
                    if (vida <= 0) {
                        GameOver();
                    }
                }
                else {
                }

                return;
            }
        }

        // Verificar colisiones de cubos lanzados por el jugador con los enemigos
        for (const projectile of playerProjectiles) {
            for (const enemyInfo of enemies) {
                const distanceX = Math.abs(projectile.position.x - enemyInfo.enemy.position.x);
                const distanceY = Math.abs(projectile.position.y - enemyInfo.enemy.position.y);
                if (distanceX < 1 && distanceY < 5) {
                    // SONIDO DE DAÑO
                    enemyDeath.play();
                    // el enemigo entra en modo persecusión y gira hacia el samurai
                    scene.remove(projectile);
                    playerProjectiles.splice(playerProjectiles.indexOf(projectile), 1);
                    const enemyIndex = enemies.indexOf(enemyInfo);
                    if (enemyIndex !== -1) {
                        // Elimina el enemigo de la escena y del array de enemigos
                        scene.remove(enemyInfo.enemy);
                        enemies.splice(enemyIndex, 1);
                    }


                    return;
                }
            }
        }
    }

    function GameOver() {
        gameOver.play();
        alert("Haz muerto, yiyi papa");
        // ANIMACION MORIR

    }

    function CheckVida() {
        // TODO RELACIONADO A LA VIDA EN EL CANVAS
    }

    function MoreSpeed() {

        speed = 1.5;

        const particlesCount = 1; // Cantidad de partículas
        const offsetY = 3.0; // Desplazamiento vertical de las partículas
        const separation = 3.0 // Separación entre las partículas

        // Crear una geometría de puntos (partículas)
        const particlesGeometry = new THREE.BufferGeometry();

        // Crear un array con las posiciones de las partículas
        const positions = [];
        for (let i = 0; i < particlesCount; i++) {
            const x = samurai.position.x + (Math.random() - 0.5) * separation; // Coordenada X aleatoria
            const y = samurai.position.y + offsetY + (Math.random() - 0.5) * separation; // Coordenada Y aleatoria con desplazamiento vertical
            const z = samurai.position.z + 2 + (Math.random() - 0.5) * separation; // Coordenada Z aleatoria
            positions.push(x, y, z);
        }
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        // Crear el material de las partículas
        const particlesMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1, transparent: true });

        // Crear los puntos (partículas) utilizando la geometría y el material
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);

        // Agregar los puntos a la escena
        scene.add(particles);

        function animateParticles() {
            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        setTimeout(() => {
            scene.remove(particles); // Eliminar las partículas después de 5 segundos
            speed = 1.0;
            BuffSpeed = false; // Desactivar el efecto de disminución del tiempo de enfriamiento después de 5 segundos
        }, 7000);

    }

    function LessCD() {
        const particlesCount = 1; // Cantidad de partículas
        const offsetY = 3.0; // Desplazamiento vertical de las partículas
        const separation = 3.0 // Separación entre las partículas

        // Crear una geometría de puntos (partículas)
        const particlesGeometry = new THREE.BufferGeometry();

        // Crear un array con las posiciones de las partículas
        const positions = [];
        for (let i = 0; i < particlesCount; i++) {
            const x = samurai.position.x + (Math.random() - 0.5) * separation; // Coordenada X aleatoria
            const y = samurai.position.y + offsetY + (Math.random() - 0.5) * separation; // Coordenada Y aleatoria con desplazamiento vertical
            const z = samurai.position.z + 2 + (Math.random() - 0.5) * separation; // Coordenada Z aleatoria
            positions.push(x, y, z);
        }
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        // Crear el material de las partículas
        const particlesMaterial = new THREE.PointsMaterial({ color: 0xffff00, size: 0.1, transparent: true });

        // Crear los puntos (partículas) utilizando la geometría y el material
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);

        // Agregar los puntos a la escena
        scene.add(particles);



        function animateParticles() {
            //updateParticlesPositions();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        setTimeout(() => {
            scene.remove(particles); // Eliminar las partículas después de 5 segundos
            BuffCD = false; // Desactivar el efecto de disminución del tiempo de enfriamiento después de 5 segundos
        }, 5000);
    }

    function EnemyCantAttack() {
        const particlesCount = 1; // Cantidad de partículas
        const offsetY = 3.0; // Desplazamiento vertical de las partículas
        const separation = 3.0 // Separación entre las partículas

        // Crear una geometría de puntos (partículas)
        const particlesGeometry = new THREE.BufferGeometry();

        // Crear un array con las posiciones de las partículas
        const positions = [];
        for (let i = 0; i < particlesCount; i++) {
            const x = samurai.position.x + (Math.random() - 0.5) * separation; // Coordenada X aleatoria
            const y = samurai.position.y + offsetY + (Math.random() - 0.5) * separation; // Coordenada Y aleatoria con desplazamiento vertical
            const z = samurai.position.z + 2 + (Math.random() - 0.5) * separation; // Coordenada Z aleatoria
            positions.push(x, y, z);
        }
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        // Crear el material de las partículas
        const particlesMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1, transparent: true });

        // Crear los puntos (partículas) utilizando la geometría y el material
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);

        // Agregar los puntos a la escena
        scene.add(particles);



        function animateParticles() {
            //updateParticlesPositions();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        setTimeout(() => {
            scene.remove(particles); // Eliminar las partículas después de 5 segundos
            KatanaBuff = false; // Desactivar el efecto de disminución del tiempo de enfriamiento después de 5 segundos
        }, 8000);
    }

    function Win() {
        win.play();
        stopGameTimer();
        alert(`¡Has ganado en ${gameTimer} segundos!`);
    }

    function startGameTimer() {
        timerInterval = setInterval(() => {
            gameTimer++;
        }, 1000); // Intervalo de 1 segundo (1000 milisegundos)
    }


    function stopGameTimer() {
        clearInterval(timerInterval);
    }

    function getCollisionItems() {

        if (ramenModel) {
            const ramenBB = new THREE.Box3().setFromObject(ramenModel);
            const isCollidingRamen = samuraiBB.intersectsBox(ramenBB);

            if (isCollidingRamen) {
                eatingRamen.play();
                BuffCD = true;
                scene.remove(ramenModel);
                ramenModel = null;
            }
        }

        if (chanclaModel) {
            const chanclaBB = new THREE.Box3().setFromObject(chanclaModel);
            const isCollidingChancla = samuraiBB.intersectsBox(chanclaBB);

            if (isCollidingChancla) {
                takingSandals.play();
                BuffSpeed = true;
                scene.remove(chanclaModel);
                chanclaModel = null;
            }
        }

        if (chanclaModel2) {
            const chanclaBB2 = new THREE.Box3().setFromObject(chanclaModel2);
            const isCollidingChancla2 = samuraiBB.intersectsBox(chanclaBB2);

            if (isCollidingChancla2) {
                takingSandals.play();
                BuffSpeed = true;
                scene.remove(chanclaModel2);
                chanclaModel2 = null;
            }
        }

        if (katanaModel) {
            const katanaBB = new THREE.Box3().setFromObject(katanaModel);
            const isCollidingKatana = samuraiBB.intersectsBox(katanaBB);

            if (isCollidingKatana) {
                KatanaBuff = true;
                scene.remove(katanaModel);
                katanaModel = null;
            }
        }


        if (pergaminoModel) {
            const pergaminoBB = new THREE.Box3().setFromObject(pergaminoModel);
            const isCollidingPergamino = samuraiBB.intersectsBox(pergaminoBB);

            if (isCollidingPergamino) {
                scene.remove(pergaminoModel);
                pergaminoModel = null;
                Win();
            }
        }

    }


    function getPlayerPosition() {
        const playerPosition = samurai.position; //
        const playerX = playerPosition.x.toFixed(2); // Redondea el valor de x a 2 decimales
        const playerY = playerPosition.y.toFixed(2); // Redondea el valor de y a 2 decimales
        const playerZ = playerPosition.z.toFixed(2); // Redondea el valor de z a 2 decimales

        // Muestra una alerta con la posición del jugador
        alert(`Posición del jugador: X: ${playerX}, Y: ${playerY}, Z: ${playerZ}`);
    }

    // Escucha el evento de presionar una tecla
    document.addEventListener('keydown', function (event) {

    });



     // Función para inicializar un botón de control
     function initializeControlButton(buttonId, muteImage, unmuteImage, unmuteImage2) {
        const button = document.getElementById(buttonId);
        let isMuted = false;

        function toggleMute() {
            isMuted = !isMuted;
            button.src = isMuted ? muteImage : unmuteImage;
        }

        button.addEventListener('click', toggleMute);

        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
            if (!isMuted) {
                button.src = unmuteImage2;
            }
        });

        button.addEventListener('mouseout', () => {
            if (!isMuted) {
                button.src = unmuteImage;
                button.style.transform = 'scale(1)';
            } else {
                button.style.transform = 'scale(1)';
            }

        });
    }

    // Inicializar el botón de volumen
    initializeControlButton('volume-button', 'Assets/btn_NoVolume.png', 'Assets/btn_volume1.png', 'Assets/btn_volume2.png');

    // Inicializar el botón de música
    initializeControlButton('music-button', 'Assets/btn_NoMusic.png', 'Assets/btn_music1.png', 'Assets/btn_music2.png');
    // Manejar la pulsación de la tecla "P"
    document.addEventListener('keydown', function (event) {
        if (event.key === 'p' || event.key === 'P') {
            if (document.getElementById('settingsPage').style.display != 'block') {
                togglePausePage();
            }

            
        }
    });
    // Función para mostrar u ocultar la página de pausa al presionar "P"
    function togglePausePage() {
        var pausePage = document.getElementById('pausePage');
        if (pausePage.style.display === '' || pausePage.style.display === 'none') {
            pausePage.style.display = 'block';
        } else {
            pausePage.style.display = 'none';

        }
    }
    document.getElementById('resumepause').addEventListener('click', function () {
        togglePausePage(); // Ocultar la página de pausa
    });

    // Mostrar la página de settings al hacer clic en "Settings" en la página de pausa
    document.getElementById('settingsPause').addEventListener('click', function () {
        document.getElementById('settingsPage').style.display = 'block';

        togglePausePage(); // Ocultar la página de pausa
    });

    // Ocultar la página de settings al hacer clic en "Resume" en la página de settings
    document.getElementById('resumeSettings').addEventListener('click', function () {
        document.getElementById('settingsPage').style.display = 'none';
    });



    


});