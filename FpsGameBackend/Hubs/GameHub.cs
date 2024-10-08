using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class GameHub : Hub
{
    // Player joins the game
    public async Task JoinGame(string playerId)
    {
        await Clients.All.SendAsync("PlayerJoined", playerId);
    }

    // Sync player movement with all clients
    public async Task SyncPlayerMovement(string playerId, float x, float y, float z, float rotation)
    {
        await Clients.Others.SendAsync("PlayerMoved", playerId, x, y, z, rotation);
    }

    // Player shoots a projectile
    public async Task PlayerShoot(string playerId, float x, float y, float z)
    {
        await Clients.All.SendAsync("PlayerShoot", playerId, x, y, z);
    }

    // Handle player disconnections
    public override async Task OnDisconnectedAsync(Exception exception)
    {
        string playerId = Context.ConnectionId;
        await Clients.All.SendAsync("PlayerLeft", playerId);
        await base.OnDisconnectedAsync(exception);
    }
}
