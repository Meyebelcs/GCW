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

    // Obtén la imagen con la clase "image-play"
    const imagePlay = document.querySelector('.image-play');
    // Obtiene el ancho y alto de la imagen
    const imageWidth = imagePlay.clientWidth;
    const imageHeight = imagePlay.clientHeight;
    // Crea un renderizador WebGL
    const renderer = new THREE.WebGLRenderer();
    // Establece el tamaño del renderizador con las dimensiones de la imagen
    renderer.setSize(imageWidth, imageHeight);
    renderer.shadowMap.enabled = true;
    // Agrega el renderizador al elemento DOM
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

    // Crear controles de cámara orbitales
    const cameraControl = new OrbitControls(camera, renderer.domElement);

    // Función para animar la escena
    function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
});
