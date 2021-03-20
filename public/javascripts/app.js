


/**
not used!!!
 */
function initChatSystem() {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
    loadData(false);
}

/**
 * given the list of cities created by the user, it will retrieve all the data from
 * the server (or failing that) from the database
 * @param forceReload true if the data is to be loaded from the server
 */
function loadData(forceReload){
    var room_list=JSON.parse(localStorage.getItem('roomNo'));
    room_list=removeDuplicates(room_list);
    retrieveAllCitiesData(room_list, forceReload);
}

/**
 * it cycles through the list of cities and requests the data from the server for each
 * city
 * @param cityList the list of the cities the user has requested
 * @param date the date for the forecasts (not in use)
 * @param forceReload true if the data is to be retrieved from the server
 */
function retrieveAllCitiesData(room_list, forceReload){
    refreshCityList();
    for (let index in room_list)
        loadChatData(room_list[index], forceReload);
}

/**
 * given one city and a date, it queries the server via Ajax to get the latest
 * weather forecast for that city
 * if the request to the server fails, it shows the data stored in the database
 * @param city
 * @param date
 * @param forceReload true if the data is to be retrieved from the server
 */
async function loadChatData(roomID, forceReload){
    // there is no point in retrieving the data from the db if force reload is true:
    // we should not do the following operation if forceReload is true
    // there is room for improvement in this code
    let chatData=await getChatData(roomID);
    if (!forceReload && chatData && chatData.length>0) {
        for (let res of chatData)
            addToResults(res);
    } else {
        const input = JSON.stringify({roomNo: roomID});
        $.ajax({
            url: '/chat_data',
            data: input,
            contentType: 'application/json',
            type: 'POST',
            success: function (dataR) {
                // no need to JSON parse the result, as we are using
                // dataType:json, so JQuery knows it and unpacks the
                // object for us before returning it
                storeChatData(dataR.roomNo, dataR);
                if (document.getElementById('offline_div') != null)
                    document.getElementById('offline_div').style.display = 'none';
            },
            // the request to the server has failed. Let's show the cached data
            error: function (xhr, status, error) {
                showOfflineWarning();
                getChatData(roomNo);
                const dvv = document.getElementById('offline_div');
                if (dvv != null)
                    dvv.style.display = 'block';
            }
        });
    }
    // hide the list of cities if currently shown
    if (document.getElementById('room_list')!=null)
        document.getElementById('room_list').style.display = 'none';
}


///////////////////////// INTERFACE MANAGEMENT ////////////


/**
 * given the forecast data returned by the server,
 * it adds a row of weather forecasts to the results div
 * @param dataR the data returned by the server:
    class chatObject{
 *  constructor (room:int, username:string, msgID:int, msg:string) {
 *
 *    this.room= room;
 *    this.username= username,
 *    this.msgID=msgID;
 *    this.msg= msg;
 *  }
 *
 *}
 */
function addToResults(dataR) {
    if (document.getElementById('roomNo') != null) {
        const row = document.createElement('div');
        // appending a new row
        document.getElementById('roomNo').appendChild(row);
        // formatting the row by applying css classes
        row.classList.add('card');
        row.classList.add('my_card');
        row.classList.add('bg-faded');
        // the following is far from ideal. we should really create divs using javascript
        // rather than assigning innerHTML
        row.innerHTML = "<div class='card-block'>" +
            "<div class='row'>" +
            "<div class='col-xs-2'><h4 class='card-title'>" + dataR.room + "</h4></div>" +
            "<div class='col-xs-2'>" + getUsername(dataR) + "</div>" +
            "<div class='col-xs-2'>" + getMsgID(dataR) + "</div>" +
            "<div class='col-xs-2'>" + getMsg(dataR) + "</div>" +
            "<div class='col-xs-2'></div></div></div>";
    }
}


/**
 * it removes all forecasts from the result div
 */
function refreshCityList(){
    if (document.getElementById('results')!=null)
        document.getElementById('results').innerHTML='';
}


/**
 * it enables selecting the city from the drop down menu
 * it saves the selected city in the database so that it can be retrieved next time
 * @param city
 * @param date
 */
function selectRoom(room) {
    var roomList=JSON.parse(localStorage.getItem('roomNo'));
    if (roomList==null) roomList=[];
    roomList.push(room);
    roomList = removeDuplicates(roomList);
    localStorage.setItem('roomNo', JSON.stringify(roomList));
    retrieveAllCitiesData(roomList, true);
}



/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    loadData(false);
}, false);


function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}


/**
 * it shows the city list in the browser
 */
function showRoomList() {
    if (document.getElementById('room_list')!=null)
        document.getElementById('room_list').style.display = 'block';
}



/**
 * Given a list of cities, it removes any duplicates
 * @param cityList
 * @returns {Array}
 */
function removeDuplicates(roomList) {
    // remove any duplicate
       var uniqueNames=[];
       $.each(roomList, function(i, el){
           if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
       });
       return uniqueNames;
}
