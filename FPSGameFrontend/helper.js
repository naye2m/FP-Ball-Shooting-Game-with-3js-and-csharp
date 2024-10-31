import * as THREE from "three";
import {  /* renderer,  sphereGeometry, sphereMaterial, clock, stats */ } from "./main";
console.log("running");
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from "three/examples/jsm/math/Octree.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
window.dat ??= {};
const dat = window.dat;
window.dat.iscalled ??= {};

dat.player ??= {}
dat.Octree ??= {};
dat.player ??= {};
dat.player.Obj ??= {};
dat.player.collider ??= {};
dat.controls ??= {};
dat.playerF ??= {};
dat.camera ??= {};
dat.color ??= {}
dat.Ball ??= {};

dat.v3dZero = new THREE.Vector3(0, 0, 0);
dat.isTesting = true;
dat.isUiCon = true;
dat.safeStagg = new THREE.Vector3(0, 0, 0);
dat.fogStartDisInPlayGroundViwe = 50;
dat.player.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
dat.player.camera.rotation.order = 'YXZ';
dat.GRAVITY = 30;
dat.NUM_SPHERES = 10;
dat.MAX_SPHERES = 50;
dat.SPHERE_RADIUS = 0.2;
dat.STEPS_PER_FRAME = 5;
dat.Octree.world = new Octree();
dat.player.collider.type = "Capsule";
dat.player.collider.height = 0.65;
dat.player.collider.radius = 0.35;
dat.player.collider.startingPoint = new THREE.Vector3(0, 3, 0);
dat.player.Obj.velocity = new THREE.Vector3();
dat.player.Obj.direction = new THREE.Vector3();
dat.controls.eventOn = 'keydown';
dat.tmp = [];
dat.playerF.speedOnFloor = 25;
dat.playerF.speedOnSky = 8;
dat.playerF.jumpHeight = 15;
dat.camera.MovementSpeedByKeyControl = 5 / 100;
dat.sensitivity = 100;
dat.max_sensitivity = 200;
dat.isUidebug = false;
dat.color.skyColor = 0x88ccee;
dat.color.white = 0xffffff;
dat.color.black = 0x000000 || 0;
dat.color.red = 0xff0000;
dat.color.green = 0x00ff00;
dat.color.blue = 0x0000ff;
dat.color.Ball = 0xdede8d;

dat.Ball.color = dat.color.Ball;
dat.Ball.opacity = 1;
dat.Ball.transparent = false;
dat.Ball.castShadow = true;
dat.Ball.receiveShadow = true;
dat.Ball.placeToStack = new THREE.Vector3(0, - 100, 0);
dat.Ball.velocityMulti = 1; // spee;
dat.Ball.roundness = 3;
dat.player.collider.legORstart = dat.player.collider.startingPoint.clone();
dat.player.collider.getEndByStart = (startV, height) => startV
    .clone()
    .add({
        x: 0,
        y: height,
        z: 0
    });
dat.player.collider.faceORend = dat.player.collider.getEndByStart(
    dat.player.collider.legORstart, dat.player.collider.height
);

dat.player.Obj.collider = new Capsule(dat.player.collider.legORstart.clone(), dat.player.collider.faceORend.clone(), dat.player.collider.radius);


export function callOnecce(func, ...args) {
    window.dat ??= {};
    window.dat.iscalled ??= {};
    if (!window.dat.iscalled[func.name]) {
        queueMicrotask(() => func(...args));
    }
    window.dat.iscalled[func.name] = true;
}




export const vector1 = new THREE.Vector3();
export const vector2 = new THREE.Vector3();
export const vector3 = new THREE.Vector3();
export const scene = new THREE.Scene();
// #region setting_vars

export const spheres = [];
dat.BallsObj = spheres;
export const clock = new THREE.Clock();
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const stats = new Stats();
// const { STEPS_PER_FRAME: dat.STEPS_PER_FRAME, GRAVITY: dat.GRAVITY, NUM_SPHERES: dat.NUM_SPHERES, SPHERE_RADIUS: dat.SPHERE_RADIUS } = dat;
export const sphereGeometry = new THREE.IcosahedronGeometry(dat.SPHERE_RADIUS, dat.Ball.roundness); // geometry(rad , roundness)
// const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xdede8d });
export const sphereMaterial = new THREE.MeshLambertMaterial({
    color: dat.Ball.color,
    opacity: dat.Ball.opacity,
    transparent: dat.Ball.transparent
});
export const loader = new GLTFLoader().setPath('./models/gltf/');
let sphereIdx = 0;
// #endregion setting_vars

export function throttle(fn, limit) {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall >= limit) {
            lastCall = now;
            return fn(...args);
        }
    };
}

export class BallSphere {
    constructor(geometry, material, scene, initialPosition, radius) {
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = dat.Ball.castShadow;
        this.mesh.receiveShadow = dat.Ball.receiveShadow;

        this.collider = new THREE.Sphere(initialPosition.clone(), radius);
        this.velocity = new THREE.Vector3();

        this.scene = scene;
        this.scene.add(this.mesh);
    }
    removeWhenIdlefor(timeotINms = 500) {
        if (this.isValocityZero()) {
            this.remove();
        } else {
            setTimeout(() => this.removeWhenIdlefor(timeotINms), timeotINms);
        }

    }
    moveToSafeStagg() {
        /*
         
         */
        this.mesh.position.copy(dat.safeStagg);
        this.collider.center.copy(dat.safeStagg);
        this.velocity.copy(dat.v3dZero);

    }

    // Update the position of the sphere based on its velocity
    // todo not using still now
    updatePosition() {
        this.collider.center.add(this.velocity);
        this.mesh.position.copy(this.collider.center);
    }


    // Remove sphere if velocity is zero
    removeIfv0() {
        if (this.isValocityZero()) {
            this.remove();
        }
    }

    isValocityZero() {
        return Math.abs(this.velocity.x) < 0.001 && Math.abs(this.velocity.y) < 0.1 && Math.abs(this.velocity.z) < 0.001;
        // return this.velocity.equals(dat.v3dZero);
    }

    // Removes the sphere from the scene and array
    remove() {
        // this.moveToSafeStagg();
        // return;
        this.removeFromArray();
        this.removeFromView();
    }

    // Properly dispose of the mesh and remove from the scene
    removeFromView() {
        if (this.mesh) {
            this.scene.remove(this.mesh); // Remove from scene
            this.mesh.geometry.dispose(); // Dispose geometry
            this.mesh.material.dispose(); // Dispose material
            this.mesh = null; // Clear reference
        }
    }

    // Remove sphere from array
    removeFromArray() {
        const currIndex = dat.BallsObj.indexOf(this);
        if (currIndex === -1) {
            console.error("sphere not found in array");
            return;
        }
        dat.BallsObj.splice(currIndex, 1); // Remove from array
    }

    // Reset position of the sphere
    resetPos() {
        if (this.mesh) {
            this.mesh.position.copy(dat.safeStagg);
            this.collider.center.copy(dat.safeStagg);
            this.velocity.copy(dat.v3dZero);
        }
        this.remove(); // Immediately remove after resetting
    }
}

// const sphere = new BallSphere(
export const keyStates = {};
export function oneTimeControl(event) {

    // console.log(event);
    // dat.tmp.push(event)
    //. Holdable
    switch (event.code) {
        case "KeyE":
        case "shoot":
            throwBallWithThrottle();
            return;
            break;
    }
    //. UNHOLDABLE 
    if (!event.repeat)
        switch (event.code) {
            // case "KeyE": 291
            // case "shoot":
            //     throwBallWithThrottle();
            //     return;
            // case value:
            //     return;
            default:
                break;
        }


    //. HOLDABLE 
    // repeaded event goes here
    // diff bitween this and controls that is delayed delta time
    switch (event.code) {
        case "KeyE":
            break;

        // case value:
        //     break;
        default:
            break;
    }

}
export function cameraMove(X = 0, Y = 0) {
    dat.player.camera.rotation.y -= X / (5 * ((dat.max_sensitivity + 1) - dat.sensitivity));
    dat.player.camera.rotation.x -= Y / (5 * ((dat.max_sensitivity + 1) - dat.sensitivity));

    // bound camera
    if (dat.player.camera.rotation.x > 0.5 * Math.PI)
        dat.player.camera.rotation.x = (0.5 * Math.PI) * 0.999;
    else if (dat.player.camera.rotation.x < -0.5 * Math.PI)
        dat.player.camera.rotation.x = (-0.5 * Math.PI) * 0.999;
    dat.player.camera.rotation.y %= Math.PI * 2;

}
export const throwBallWithThrottle = throttle(throwBall, 100);
export function handleMouseDown(event) {
    // dat.tmp.push(event);
    event.stopPropagation();
    document.body.requestPointerLock();
    if (locals.fullScreenable && locals.isAutoFullScreen)
        document.body.requestFullscreen();
    // todo important performance.now();
    mouseTime = performance.now();

}
export function onWindowResize() {

    dat.player.camera.aspect = window.innerWidth / window.innerHeight;
    dat.player.camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
export function throwBall() {
    // Create a new instance of the Sphere class
    // const sphere = false ? spheres[sphereIdx] : (
    // const sphere = spheresLen > 0 ? spheres[sphereIdx] : (
    //     new BallSphere(
    //         sphereGeometry,  // Geometry for the sphere
    //         sphereMaterial,  // Material for the sphere
    //         scene,           // THREE.js scene
    //         dat.Ball.placeToStack,  // Initial position for the sphere
    //         dat.SPHERE_RADIUS  // Radius of the sphere collider
    //     )
    // );
    let spheresLen = spheres.length;
    const sphere = spheresLen > dat.MAX_SPHERES ? spheres[Math.min(spheresLen - 1, spid)] : (
        new BallSphere(
            sphereGeometry, // Geometry for the sphere
            sphereMaterial, // Material for the sphere
            scene, // THREE.js scene
            dat.Ball.placeToStack, // Initial position for the sphere
            dat.SPHERE_RADIUS // Radius of the sphere collider
        )
    );
    spheresLen = spheres.length;
    spheres.push(sphere);
    // console.log(spheresLen);
    dat.player.camera.getWorldDirection(dat.player.Obj.direction);

    sphere.collider.center.copy(dat.player.Obj.collider.end).addScaledVector(dat.player.Obj.direction, dat.player.Obj.collider.radius * 1.5);

    // throw the ball with more force if we hold the button longer, and if we move forward
    const impulse = 15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.001));
    sphere.velocity.copy(dat.player.Obj.direction).multiplyScalar(impulse * dat.Ball.velocityMulti);
    sphere.velocity.addScaledVector(dat.player.Obj.velocity, 2);
    sphere.removeWhenIdlefor(500);
    //? sphereIdx = (sphereIdx + 1) % spheres.length;
}
function playerCollisions() {

    const result = dat.Octree.world.capsuleIntersect(dat.player.Obj.collider);
    // dat.tmp.push({depth:result.depth,...result.normal})
    // console.log(`    const result = dat.Octree.world.capsuleIntersect(dat.player.Obj.collider);`,result);
    playerOnFloor = false;

    if (result) {

        playerOnFloor = result.normal.y > 0;

        // alert("he he")
        if (!playerOnFloor) {
            // alert("he he")
            dat.player.Obj.velocity.addScaledVector(result.normal, -result.normal.dot(dat.player.Obj.velocity));

        }

        dat.player.Obj.collider.translate(result.normal.multiplyScalar(result.depth));

    }

}
function updatePlayer(deltaTime) {

    let damping = Math.exp(-4 * deltaTime) - 1;

    if (!playerOnFloor) {

        dat.player.Obj.velocity.y -= dat.GRAVITY * deltaTime;

        // small air resistance
        damping *= 0.1;

    }

    dat.player.Obj.velocity.addScaledVector(dat.player.Obj.velocity, damping);

    const deltaPosition = dat.player.Obj.velocity.clone().multiplyScalar(deltaTime);
    dat.player.Obj.collider.translate(deltaPosition);

    playerCollisions();

    dat.player.camera.position.copy(dat.player.Obj.collider.end);

}
function playerSphereCollision(sphere) {

    const center = vector1.addVectors(dat.player.Obj.collider.start, dat.player.Obj.collider.end).multiplyScalar(0.5);

    const sphere_center = sphere.collider.center;

    const r = dat.player.Obj.collider.radius + sphere.collider.radius;
    const r2 = r * r;

    // approximation: player = 3 spheres
    for (const point of [dat.player.Obj.collider.start, dat.player.Obj.collider.end, center]) {

        const d2 = point.distanceToSquared(sphere_center);

        if (d2 < r2) {

            // todo count kill if player touch enemy's ball 
            const normal = vector1.subVectors(point, sphere_center).normalize();
            const v1 = vector2.copy(normal).multiplyScalar(normal.dot(dat.player.Obj.velocity));
            const v2 = vector3.copy(normal).multiplyScalar(normal.dot(sphere.velocity));

            dat.player.Obj.velocity.add(v2).sub(v1);
            sphere.velocity.add(v1).sub(v2);

            const d = (r - Math.sqrt(d2)) / 2;
            sphere_center.addScaledVector(normal, -d);

        }

    }

}
function spheresCollisions() {

    for (let i = 0, length = spheres.length; i < length; i++) {

        const s1 = spheres[i];

        for (let j = i + 1; j < length; j++) {

            const s2 = spheres[j];

            const d2 = s1.collider.center.distanceToSquared(s2.collider.center);
            const r = s1.collider.radius + s2.collider.radius;
            const r2 = r * r;

            if (d2 < r2) {

                const normal = vector1.subVectors(s1.collider.center, s2.collider.center).normalize();
                const v1 = vector2.copy(normal).multiplyScalar(normal.dot(s1.velocity));
                const v2 = vector3.copy(normal).multiplyScalar(normal.dot(s2.velocity));

                s1.velocity.add(v2).sub(v1);
                s2.velocity.add(v1).sub(v2);

                const d = (r - Math.sqrt(d2)) / 2;

                s1.collider.center.addScaledVector(normal, d);
                s2.collider.center.addScaledVector(normal, -d);

            }

        }

    }

}
function updateSpheres(deltaTime) {

    spheres.forEach(sphere => {

        sphere.collider.center.addScaledVector(sphere.velocity, deltaTime);

        const result = dat.Octree.world.sphereIntersect(sphere.collider);

        if (result) {

            sphere.velocity.addScaledVector(result.normal, -result.normal.dot(sphere.velocity) * 1.5);
            sphere.collider.center.add(result.normal.multiplyScalar(result.depth));

        } else {

            sphere.velocity.y -= dat.GRAVITY * deltaTime;

        }

        const damping = Math.exp(-1.5 * deltaTime) - 1;
        sphere.velocity.addScaledVector(sphere.velocity, damping);

        playerSphereCollision(sphere);

    });

    spheresCollisions();

    for (const sphere of spheres) {

        sphere.mesh?.position.copy(sphere.collider.center);

    }

}
function getForwardVector() {

    dat.player.camera.getWorldDirection(dat.player.Obj.direction);
    dat.player.Obj.direction.y = 0;
    dat.player.Obj.direction.normalize();

    return dat.player.Obj.direction;

}
function getSideVector() {

    dat.player.camera.getWorldDirection(dat.player.Obj.direction);
    dat.player.Obj.direction.y = 0;
    dat.player.Obj.direction.normalize();
    dat.player.Obj.direction.cross(dat.player.camera.up);

    return dat.player.Obj.direction;

}
function controls(deltaTime) {
    // controls for continus intergretion
    // gives a bit of air control
    const speedDelta = deltaTime * (playerOnFloor ? dat.playerF.speedOnFloor : dat.playerF.speedOnSky);


    // add buttons from UI
    // move4,CameraMove4(hammer.js or pointerLock),jump,shoot
    if (keyStates['KeyW'] || keyStates["joystick_f"]) {

        dat.player.Obj.velocity.add(getForwardVector().multiplyScalar(speedDelta));

    }

    if (keyStates['KeyS'] || keyStates["joystick_b"]) {

        dat.player.Obj.velocity.add(getForwardVector().multiplyScalar(-speedDelta));

    }

    if (keyStates['KeyA'] || keyStates["joystick_l"]) {

        dat.player.Obj.velocity.add(getSideVector().multiplyScalar(-speedDelta));

    }

    if (keyStates['KeyD'] || keyStates["joystick_r"]) {

        dat.player.Obj.velocity.add(getSideVector().multiplyScalar(speedDelta));

    }

    // cameramove
    if (keyStates['ArrowUp'] || keyStates["camera_f"]) {

        cameraMove(0, -dat.camera.MovementSpeedByKeyControl * dat.sensitivity);
    }
    if (keyStates['ArrowDown'] || keyStates["camera_b"]) {
        cameraMove(0, dat.camera.MovementSpeedByKeyControl * dat.sensitivity);
    }
    if (keyStates['ArrowLeft'] || keyStates["camera_l"]) {
        cameraMove(-dat.camera.MovementSpeedByKeyControl * dat.sensitivity, 0);
    }
    if (keyStates['ArrowRight'] || keyStates["camera_r"]) {
        cameraMove(dat.camera.MovementSpeedByKeyControl * dat.sensitivity, 0);
    }






    // if (playerOnFloor || true) {
    //     if (keyStates['Space']) {
    //         playerVelocity.y = 5;
    //     }
    // }
    if (playerOnFloor) {

        if (keyStates['Space'] || keyStates["jump"]) {

            dat.player.Obj.velocity.y = dat.playerF.jumpHeight;

        }

    }

}
let posSet = [
    {
        pos: { x: 23.661017192389693, y: -0.7554966401229372, z: -31.162805934097523 },
        rotation: { _order: "YXZ", isEuler: true, x: 0.031683168316831545, y: -3.2653465346534682, z: 0 }
    },
    {
        pos: { x: 20.873841028601536, y: -1.5723478036131546, z: -8.316618074658306 },
        rotation: { _order: "YXZ", isEuler: true, x: 0.4737666238245985, y: 1.3445544554455442, z: 0 }
    },
    {
        pos: { x: 5.3506729029775775, y: 1.484998181920272, z: -8.485696607422817 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.013362089046688697, y: 0.10693069306930528, z: 0 }
    },
    {
        pos: { x: 6.623347623182647, y: -0.5561729978934672, z: -31.651668901831247 },
        rotation: { _order: "YXZ", isEuler: true, x: 1.521291376299847, y: -3.1603960396039645, z: 0 }
    },
    {
        pos: { x: -8.868475811943897, y: 1.484998181920268, z: -4.991661532706159 },
        rotation: { _order: "YXZ", isEuler: true, x: 0.08564781194341031, y: 1.7366506537142343, z: 0 }
    },
    {
        pos: { x: -31.67331482542394, y: -0.5465727149645059, z: -6.232647798569989 },
        rotation: { _order: "YXZ", isEuler: true, x: 0.08564781194341031, y: -1.4316661779689364, z: 0 }
    },
    {
        pos: { x: -8.322759629153875, y: -1.5723478036129608, z: -21.04384800337178 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.11237199003678786, y: -3.015824593810522, z: 0 }
    },
    {
        pos: { x: -30.69163327744746, y: -0.7554966401221281, z: -23.359890058008595 },
        rotation: { _order: "YXZ", isEuler: true, x: 0.1351527624384598, y: -1.542506296034153, z: 0 }
    },
    {
        pos: { x: -6.66165085456044, y: 1.4849981819208102, z: 8.660227577228289 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.21138189102688693, y: -3.0276548108856387, z: 0 }
    },
    {
        pos: { x: -6.875875887906048, y: -0.5520351172621766, z: 31.66100414896102 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.4094016930070851, y: -0.11080613736942169, z: 0 }
    },
    {
        pos: { x: -21.04086593460042, y: -1.5723478036124148, z: 8.753836910132685 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.2608868415219365, y: -1.6454596027159574, z: 0 }
    },
    {
        pos: { x: -23.95382669319947, y: -0.7554966401218175, z: 29.845370288555323 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.21138189102688687, y: 0.0832702589190708, z: 0 }
    },
    {
        pos: { x: 10.195196951225924, y: 1.4849981819211167, z: 5.979488780368451 },
        rotation: { _order: "YXZ", isEuler: true, x: 0.036142861448360646, y: -1.4058216616241208, z: 0 }
    },
    {
        pos: { x: 32.054972170868965, y: -0.37724670122178977, z: 6.51623386166707 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.06286703954173838, y: -4.72265334479244, z: 0 }
    },
    {
        pos: { x: 8.571751535403223, y: -1.572347803612087, z: 21.029618830625456 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.06286703954173838, y: -0.271151205929687, z: 0 }
    },
    {
        pos: { x: 29.57130388496834, y: -1.405496640122942, z: 24.131132984735313 },
        rotation: { _order: "YXZ", isEuler: true, x: -0.09653040587837175, y: -4.722755286879829, z: 0 }
    }
];
function viwePlaces(intervalForChengeLocation = 1000) {
    let interval;
    interval = setInterval(() => {
        if (!posSet.length)
            return clearInterval(interval);
        let { pos, rotation } = posSet.pop();
        // let camRotation = {
        //     x: rotation.x,
        //     y: rotation.y,
        //     z: rotation.z,
        // }
        let camRotation = [
            rotation.x,
            rotation.y,
            rotation.z,
        ];

        let end = dat.player.collider.getEndByStart(pos, dat.player.collider.height);
        return teleportPlayer(pos, end, end, camRotation);
    }, intervalForChengeLocation);
}
// viwePlaces(1000)
function teleportPlayerIfOob() {

    if (dat.player.camera.position.y <= -25) {

        // player.collider.start.set(0, 0.35, 0);
        // player.collider.end.set(0, 1, 0);
        // player.collider.radius = 0.35;
        teleportPlayer(
            dat.player.collider.legORstart.clone(),
            dat.player.collider.faceORend.clone(),
            dat.player.collider.faceORend.clone(),
            [0, 0, 0]
        );

    }

}
function teleportPlayer(collStart, collEnd, camPos, camRotation, radius = false) {
    // todo: set start end based on calc instead of Hard code
    dat.player.Obj.collider.start.copy(collStart);
    dat.player.Obj.collider.end.copy(collEnd);

    dat.player.camera.position.copy(camPos);
    dat.player.camera.rotation.set(...camRotation);
    if (radius)
        dat.player.Obj.collider.radius = dat.player.collider.radius;

}
let _deltaTime = () => Math.min(0.05, clock.getDelta()) / dat.STEPS_PER_FRAME;
let FrameUpdateLoop = [];
export function addToFrameUpdateLoop(func) { return FrameUpdateLoop.push(func); }
;
export function animate() {
    let deltaTime = _deltaTime();


    // we look for collisions in substeps to mitigate the risk of
    // an object traversing another too quickly for detection.
    for (let i = 0; i < dat.STEPS_PER_FRAME; i++) {

        controls(deltaTime);

        updatePlayer(deltaTime);

        updateSpheres(deltaTime);

        FrameUpdateLoop.forEach(func => func(deltaTime));

        teleportPlayerIfOob();

    }

    renderer.render(scene, dat.player.camera);

    stats.update();

    requestAnimationFrame(animate);

}
export let playerOnFloor = false;
export let mouseTime = 0;
export let spid = 0;


