var connectionChat = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat").withAutomaticReconnect([0, 1000, 5000, null])
    .build();

connectionChat.on("ReceiveUserConnected", function (userid, username) {
        addMessage(`${username} is online`);
});
connectionChat.on("ReceiveUserDisConnected", function (userid, username) {
        addMessage(`${username} is offline`);
});
connectionChat.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, username) {

    addMessage(`${username} has created room ${roomName}`);
    fillRoomDropDown();

});
connectionChat.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, username) {

    addMessage(`${username} has Deleted room ${roomName}`);
    fillRoomDropDown();

});

connectionChat.on("ReceivepublicMessage", function (roomId, UserId, username, message, roomName) {
    addMessage(`[Public Message - ${roomName}]${username} says ${message}`)
});

connectionChat.on("ReceivePrivateMessage", function (SenderId, sendername, reciverId, message, chatId, reciverName){
    addMessage(`[Private Message to ${reciverName}] ${sendername} says ${message}`);
});


function sendPublicMessage(){
    let inputMsg = document.getElementById('txtPublicMessage');
    let ddlSelRoom = document.getElementById('ddlSelRoom');

    let roomId = ddlSelRoom.value;
    let roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text;
    let message = inputMsg.value;

    connectionChat.send("SendPublicMessage", Number(roomId), message, roomName);
    inputMsg.value = '';
}

function sendPrivateMessage() {
    let inputMsg = document.getElementById('txtPrivateMessage');
    let ddlSelUser = document.getElementById('ddlSelUser');

    let reciverId = ddlSelUser.value;
    let reciverName = ddlSelRoom.options[ddlSelUser.selectedIndex].text;
    let message = inputMsg.value;

    connectionChat.send("SendPrivateMessage", reciverId, message, reciverName);
    inputMsg.value = '';

}

function addMessage(msg) {
    if (msg == null || msg == '') {
        return;
    }
    let ui = document.getElementById('messagesList');
    let li = document.createElement("li");
    li.innerHTML = msg;
    ui.appendChild(li);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function addnewRoom(maxRoom) {

    let createRoomName = document.getElementById('createRoomName');

    var roomName = createRoomName.value;

    if (roomName == null && roomName == '') {
        return;
    }

    /*POST*/
    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connectionChat.send("SendAddRoomMessage", maxRoom, json.id, json.name);
            createRoomName.value = '';


        },
        error: function (xhr) {
            alert('error');
        }
    })



}
function DeleteRoom(){

    let ddlDelRoom = document.getElementById('ddlDelRoom');

    var roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;

    let text = `Do you want to delete Chat Room ${roomName}?`;

    if (confirm(text) == false) {
        return;
    }

    if (roomName == null && roomName == '') {
        return;
    }

    let roomId = ddlDelRoom.value;

    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json;',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connectionChat.send("SendDeleteRoomMessage", json.deleted, json.selected, roomName);
            fillRoomDropDown();

        },
        error: function (xhr) {
            alert('error');
        }
    })



}


document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
})


function fillUserDropDown() {

    $.getJSON('/ChatRooms/GetChatUser')
        .done(function (json) {

            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;//item.whateverProperty
                newOption.value = item.id;
                ddlSelUser.add(newOption);


            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}

function fillRoomDropDown() {

    $.getJSON('/ChatRooms/GetChatRoom')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);


                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);

            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}

//////////////////////////////////////////////////////////////////////////////////////////////////

connectionChat.start();