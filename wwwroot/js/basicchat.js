var connectionChat = new signalR.HubConnectionBuilder().withUrl("/hubs/basicchat").build();

document.getElementById("sendMessage").disabled = true;

connectionChat.on("MessageRecived", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} - ${message}`;
} );

document.getElementById("sendMessage").addEventListener("click", function (event) {
    var sender = document.getElementById("senderEmail").value;
    var message = document.getElementById("chatMessage").value;
    var reciver = document.getElementById("receiverEmail").value;

    if (reciver.length > 0) {
        connectionChat.invoke("SendMessageToReceiver", sender, reciver, message).catch(function (err) {
            return console.error(err.tostring());
        });
    }
    else {
        //send message to all of the users
        connectionChat.send("SendMessageToAll", sender, message).catch(function (err) {
            return console.error(err.tostring());
        });
    }
    event.preventDefault();
});

connectionChat.start().then(function () {
    document.getElementById("sendMessage").disabled = false;
});
