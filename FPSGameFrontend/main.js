"use strict";
console.log("main.js");

import * as THREE from 'three';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';




import { } from "./games_fps.js"
import { localSettings } from "./games_fps_settings.js"
import {
    addToFrameUpdateLoop,
    animate,
    cameraMove,
    handleMouseDown,
    keyStates,
    oneTimeControl,
    onWindowResize,
    throwBallWithThrottle,
    spheres,
    /* clock, */
    renderer,
    stats,
    /* sphereGeometry, */
    /* sphereMaterial, */
    callOnecce,

    loader,
    scene
} from './helper.js';
// import * as helper from './helper.js';
import { } from "./setting.jsx";

// test import { default as test } from './tests.js';
// test test();
console.log("running");
callOnecce(Main);
console.log((new Error("loading main.js multiple times")).stack);
// todos
// add box for shot that increase or decrease factors like speed, gravity etc
// add life etc
// add effects for player with ball
// UI for most kill etc
// add lastThrow for player for controlling shoting rate
// make high ping player visible and shilded so noone can interect with him and also he is unable to do anything
// connect player with server with control send by player and every component updated by derver and send to player

function Main() {
    // #region setting_dat
    // todo make dat as local veriable
    window.dat ??= {}
    const dat = window.dat;
    window.locals ??= {}
    locals.fullScreenable = true;
    locals.isAutoFullScreen = false
    dat ??= window.dat;
    // todo understand
    // todo understand
    // console.log(dat.player.camera.rotation.order); // xyz 
    // 
    // controls for onetime intergretion
    // #endregion setting_dat

    scene.background = new THREE.Color(dat.color.skyColor);
    scene.fog = new THREE.Fog(dat.color.skyColor, 6, dat.fogStartDisInPlayGroundViwe); // fog(color,blur or something else todo ,startingdistanse)


    const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);// (envlight,bounce/shadow reflection,strenth)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);// colorOFlight, strenth
    const container = document.getElementById('container');
    fillLight1.position.set(2, 1, 1);
    scene.add(fillLight1);
    directionalLight.position.set(-5, 25, -1);
    directionalLight.castShadow = true;
    // Set up shadow properties

    const shadow = directionalLight.shadow;
    const camera = shadow.camera;
    camera.near = 0.01;
    camera.far = 500;
    camera.left = -30;
    camera.right = 30;
    camera.top = 30;
    camera.bottom = -30;
    shadow.mapSize.set(1024, 1024);
    shadow.radius = 4;
    shadow.bias = -0.00006;
    scene.add(directionalLight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    console.log("rendering webglrenderer");
    container.appendChild(renderer.domElement);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    document.addEventListener('keydown', event => keyStates[event.code] = true);
    document.addEventListener('keyup', event => keyStates[event.code] = false);
    // document.addEventListener(dat.controls.eventOn, e => dat.tmp.push(e));
    document.addEventListener(dat.controls.eventOn, oneTimeControl);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('load', onWindowResize);
    window.dat.localSettings = new localSettings();
    loader.load('world_using.glb', (gltf) => {
        scene.add(gltf.scene);
        dat.Octree.world.fromGraphNode(gltf.scene);
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.map) {
                    child.material.map.anisotropy = 4;
                }
            }
        });
        if (dat.isTesting && dat.isUidebug) {
            const helper = new OctreeHelper(dat.Octree.world);
            helper.visible = false;
            scene.add(helper);
            const gui = new GUI({ width: 200 });
            gui.add({ debug: false }, 'debug')
                .onChange(function (value) {
                    helper.visible = value;
                });
            gui.add({ cleanBalls: false }, 'cleanBalls')
                .onChange(function (value) {
                    spheres.forEach(e => {
                        e.collider.set(dat.Ball.placeToStack.clone(), dat.SPHERE_RADIUS);
                        e.velocity.multiplyScalar(0);
                    });
                });
            // let datkeys = 'fogStartDisInPlayGroundViwe,GRAVITY,NUM_SPHERES,SPHERE_RADIUS,STEPS_PER_FRAME,sensitivity,max_sensitivity,playerF'.split(",");
            // todo see this
            let datkeys = 'fogStartDisInPlayGroundViwe,GRAVITY,NUM_SPHERES,SPHERE_RADIUS,STEPS_PER_FRAME,sensitivity,max_sensitivity'.split(",");
            datkeys.forEach(e => {
                let ob = {};
                ob[e] = dat[e];
                gui.add(ob, e)
                    .onChange(function (val) {
                        dat[e] = val;
                    });
            })
            datkeys = Object.keys(dat['playerF']);
            datkeys.forEach(e => {
                let ob = {};
                ob[e] = dat.playerF[e];
                gui.add(ob, e)
                    .onChange(function (val) {
                        dat.playerF[e] = val;
                    });
            })
        }
        animate();
    });
    // loader.load('Xbot.glb', function (gltf) {
    //     dat._player ??= {};
    //     dat._player.Obj ??= {};
    //     dat._player.Obj.velocity = new THREE.Vector3();
    //     dat._player.Obj.direction = new THREE.Vector3();

    //     dat._player.Obj.collider = new Capsule(
    //         dat.player.collider.legORstart.clone(),
    //         dat.player.collider.faceORend.clone(),
    //         dat.player.collider.radius
    //     );


    //     console.log(gltf);
    //     const model = gltf.scene;
    //     dat._player.Obj.mesh = model;
    //     dat._player.Obj.mesh.position.copy(dat.player.collider.legORstart.clone());
    //     // gltf.scene.scale.set(.01, .01, .01);
    //     // Initialize the animation mixer
    //     const mixer = new THREE.AnimationMixer(gltf.scene);
    //     const animationActions = [];
    //     for (let i = 0; i < gltf.animations.length; i++) {
    //         const animationAction = mixer.clipAction(gltf.animations[i]);
    //         animationActions.push(animationAction);
    //     }
    //     // for playing from console in browser developer mode
    //     // Play the first animation by default (for testing purposes)
    //     // Assuming you have already initialized the animation actions
    //     function animate(action) {
    //         action.setLoop(THREE.LoopOnce);  // Set loop mode to play once
    //         action.clampWhenFinished = true;  // Stop the animation at the last frame
    //         action.reset().play();  // Reset the action and start playing
    //     }
    //     console.log("animationActions", animationActions, animate); ur
    //     animationActions.forEach(animate);
    //     // Store player-related data
    //     // Add the loaded model to the player object
    //     scene.add(dat._player.Obj.mesh);
    //     // Position the model at the correct place in the scene
    //     // Set up custom collider (you can still use a Capsule or other collider around the model)
    //     // Initialize velocity and direction vectors
    //     // Main update/render loop
    //     function update(deltaTime) {
    //         // Update the animation mixer
    //         mixer.update(deltaTime);
    //         // Update the player's position based on velocity
    //         dat._player.Obj.mesh.position.add(dat._player.Obj.velocity);
    //     }
    //     // Start the animation loop with an initial delta time
    //     addToFrameUpdateLoop(update);
    // }, undefined, function (error) {
    //     console.error('An error occurred loading the GLB model', error);
    // });
    document.addEventListener('mouseup', (event) => {
        event.stopPropagation();
        if (document.pointerLockElement !== null) throwBallWithThrottle();
    });
    document.body.addEventListener('mousemove', (event) => {
        if (document.pointerLockElement === document.body)
            cameraMove(event.movementX, event.movementY)
    });
}
// if (!window?.iscalled?.Main) {
//     window.iscalled ??= {};
//     window.iscalled.Main = true;
//     // console.log((new Error("is loading main.js multiple times?")).stack);
//     Main();
// }
// console.log(helper.callOnecce, callOnecce);
