using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using System.Security.Claims;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public override Task OnConnectedAsync()
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(UserId))
            {
                var username = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", UserId, username);
                HubConnections.AddUserConnection(UserId, Context.ConnectionId);
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(HubConnections.HasUserConnection(UserId , Context.ConnectionId))
            {
                var UserConnections = HubConnections.Users[UserId];
                UserConnections.Remove(Context.ConnectionId);
                HubConnections.Users.Remove(UserId);
                if (UserConnections.Any())
                {
                    HubConnections.Users.Add(UserId, UserConnections);
                }
            }
            if (!string.IsNullOrEmpty(UserId))
            {
                var username = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserDisConnected", UserId, username);
                HubConnections.AddUserConnection(UserId, Context.ConnectionId);
            }
            return base.OnDisconnectedAsync(exception);
        }
        public async Task SendAddRoomMessage(int maxRoom , int roomId , string roomName)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var username = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;
            await Clients.All.SendAsync("ReceiveAddRoomMessage" ,maxRoom , roomId , roomName , username  );
        }

        public async Task SendDeleteRoomMessage(int deleted, int selected, string roomName)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var username = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;
            await Clients.All.SendAsync("ReceiveDeleteRoomMessage", deleted, selected, roomName, username);
        }

        public async Task SendPublicMessage(int roomId , string message, string roomName)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var username = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;
            await Clients.All.SendAsync("ReceivepublicMessage", roomId, UserId, username , message ,roomName );
        }
        public async Task SendPrivateMessage(string reciverId, string message, string reciverName)
        {
            var SenderId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var sendername = _context.Users.FirstOrDefault(u => u.Id == SenderId).UserName;

            var users = new string[] { SenderId, reciverId };


            await Clients.Users(users).SendAsync("ReceivePrivateMessage", SenderId, sendername, reciverId , message , Guid.NewGuid() ,reciverName );
        }

        public async Task SendOpenPrivateChat(string receiverId)
        {
            var username = Context.User.FindFirstValue(ClaimTypes.Name);
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            await Clients.User(receiverId).SendAsync("ReceiveOpenPrivateChat", userId, username);
        }

        public async Task SendDeletePrivateChat(string chartId)
        {
            await Clients.All.SendAsync("ReceiveDeletePrivateChat", chartId);
        }

        //public async Task SendMessageToAll(string user , string message)
        //{
        //    await Clients.All.SendAsync("MessageRecived", user, message);
        //}
        //[Authorize]
        //public async Task SendMessageToReceiver(string sender ,string reciver , string message)
        //{
        //    var userId = _context.Users.FirstOrDefault(x => x.Email.ToLower() == reciver.ToLower()).Id;
        //    if(!string.IsNullOrEmpty(userId))
        //    {
        //        await Clients.User(userId).SendAsync("MessageRecived", sender , message);
        //    }
        //}

    }
}
