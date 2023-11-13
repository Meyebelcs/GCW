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
            position = [0, 34, 20];
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

    addEnemyInfo(enemyInfo1);
    addEnemyInfo(enemyInfo2);

    // Llama a la función inicialmente con el primer enemigo
    cargarEnemyModelo(enemies[0], "isStand1", 0);
    cargarEnemyModelo(enemies[1], "isStand2", 0);

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


    //---------------------------------COLISIONES----------------------------------
    function checkCollisions() {

        checkCollisionsEnemy();
    }

    function checkCollisionsEnemy() {

        // Por cada enemigo en el array 'enemies'
        for (const enemyInfo of enemies) {
            // Verifica si la caja de delimitación del samurai colisiona con la del enemigo actual
            const isColliding = samuraiBB.intersectsBox(enemyInfo.enemyBB);

            // Si está colisionando y es la primera vez que se detecta la colisión
            if (isColliding && enemyInfo.firstTimeCollision == false) {
                // Aquí puedes hacer algo si hay colisión y es la primera vez
                console.log('¡Colisión en rango de enemigo!');
                //alert('¡Colisión con enemigo!');

                // Calcula el ángulo hacia el samurai
                const anguloHaciaSamurai = calcularAnguloHaciaSamurai(enemyInfo.enemy, samurai);

                // el enemigo entra en modo persecusión y gira hacia el samurai
                cargarEnemyModelo(enemyInfo, "isAtack2", (anguloHaciaSamurai * -1));

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
        const speed = 1; // Ajusta la velocidad de movimiento

        // Cámara
        if (event.key === 'w') {
            camera.position.y += speed;
        } else if (event.key === 's') {
            camera.position.y -= speed;
        }

        // Almacena la posición actual del samurái
        const tempPosition = samurai.position.clone();
        const tempBB = samuraiBB.clone();

        // Maneja el movimiento y carga de modelos
        if (event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') {
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
        checkCollisions();

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
});