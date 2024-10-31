import * as THREE from 'three';


// three.js code example
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// game code example
const player = {
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  acceleration: new THREE.Vector3(0, 0, 0),
  jumpSpeed: 10,
  gravity: 20,
  friction: 0.9,
  speed: 5,
  jumping: false,
  onGround: false,
  canJump: true,
};

function update() {
  // update player position
  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
  player.position.z += player.velocity.z;

  // update player rotation
  player.rotation.x += player.velocity.x;
  player.rotation.y += player.velocity.y;
  player.rotation.z += player.velocity.z;

    // apply gravity
  if (player.onGround) {
    player.velocity.y = 0;
    player.canJump = true;
  } else {
    player.velocity.y -= player.gravity;
  }

  // apply friction
  player.velocity.x *= player.friction;
  player.velocity.y *= player.friction;
  player.velocity.z *= player.friction;

  // handle input
  if (keyIsDown(38)) { // up
    if (player.canJump) {
      player.velocity.y = player.jumpSpeed;
      player.canJump = false;
    }
  }

  // update camera position
  camera.position.x = player.position.x;
  camera.position.y = player.position.y + 10;
  camera.position.z = player.position.z;
  camera.lookAt(scene.position);

  // render scene
  renderer.render(scene, camera);
}

function keyIsDown(keyCode) {
  return window.navigator.keyboard.isKeyDown(keyCode);
}

function main() {
  requestAnimationFrame(main);
  update();
}

main(); // start game 