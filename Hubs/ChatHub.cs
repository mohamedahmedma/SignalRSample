using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task SendMessageToAll(string user , string message)
        {
            await Clients.All.SendAsync("MessageRecived", user, message);
        }
        [Authorize]
        public async Task SendMessageToReceiver(string sender ,string reciver , string message)
        {
            var userId = _context.Users.FirstOrDefault(x => x.Email.ToLower() == reciver.ToLower()).Id;
            if(!string.IsNullOrEmpty(userId))
            {
                await Clients.User(userId).SendAsync("MessageRecived", sender , message);
            }
        }
    }
}
