using SignalRSample.Controllers;

namespace SignalRSample.Models.ViewModel
{
    public class ChatVM
    {
        public int MaxRoomAllowed {  get; set; }
        public IList<ChatRoom> Rooms { get; set; }
        public string? UserId {  get; set; }
        public ChatVM() 
        {
            Rooms = new List<ChatRoom>();
        }
        public bool AllowAddRoom => Rooms == null || Rooms.Count < MaxRoomAllowed;
    }
}
