public class Player2
{
    public string PlayerId { get; set; }
    public string Name { get; set; }
    public float Score { get; set; }
    public float Health { get; set; }
    public async Task SavePlayerData(Player player)
    {
        // _context.Players.Update(player);
        // await _context.SaveChangesAsync();
    }

}
public class Player
{
    public string PlayerId { get; set; }
    public string Name { get; set; }
    public float Health { get; set; }
    public float Score { get; set; }
    public float PositionX { get; set; }
    public float PositionY { get; set; }
    public float PositionZ { get; set; }
    public float Rotation { get; set; }
}



// {
//     "playerId": "12345",
//     "position": { "x": 10, "y": 5, "z": 0 },
//     "rotation": 45,
//     "health": 100,
//     "action": "shoot"
// }

