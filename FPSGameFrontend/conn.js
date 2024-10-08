// const connection = new signalR.HubConnectionBuilder()
//     .withUrl("/gamehub")
//     .build();

connection.on("PlayerJoined", (playerId) => {
    console.log("Player joined: " + playerId);
});

connection.on("PlayerMoved", (playerId, x, y, z, rotation) => {
    updatePlayerPosition(playerId, x, y, z, rotation);
});

connection.on("PlayerShoot", (playerId, x, y, z) => {
    spawnProjectile(playerId, x, y, z);
});

// Start the connection
connection.start().then(() => {
    console.log("Connected to server.");
}).catch(err => console.error(err.toString()));

// Send player movement
function sendPlayerMovement(x, y, z, rotation) {
    connection.invoke("SyncPlayerMovement", "player123", x, y, z, rotation);
}

// Send player shoot event
function sendPlayerShoot(x, y, z) {
    connection.invoke("PlayerShoot", "player123", x, y, z);
}


import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://your-backend-url/gamehub') // Replace with your backend URL
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Start the connection
connection.start()
    .then(() => {
        console.log('Connected to the game hub.');
    })
    .catch(err => console.error('Connection error: ', err));

// Handle connection close
connection.onclose(async () => {
    await start();
});
