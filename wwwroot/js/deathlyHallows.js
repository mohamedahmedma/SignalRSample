var spanstone = document.getElementById("stoneCounter");
var spanwand = document.getElementById("wandCounter");
var spancloak = document.getElementById("cloakCounter");

//create connection
var connectionDeathlyHallows = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Trace)
    .withUrl("/hubs/deathyhallows" , signalR.HttpTransportType.WebSockets).build();
//connect to methods that hub invokes aka receive notfications from hub
connectionDeathlyHallows.on("updateDealthyHallowsCount", (cloak ,stone,wand) => {
    spancloak.innerText = cloak.toString();
    spanstone.innerText = stone.toString();
    spanwand.innerText = wand.toString();
});
//invoke hub methods aka send notification to hub

//start connection
function fulfilled() {
    connectionDeathlyHallows.invoke("GetRaceStatus").then((raceCounter) => {
        spancloak.innerText = raceCounter.cloak.toString();
        spanstone.innerText = raceCounter. stone.toString();
        spanwand.innerText = raceCounter. wand.toString();
    })
    console.log("Connection to User Hub Successful");

}
function rejected() {

}
connectionDeathlyHallows.start().then(fulfilled, rejected);