let name = null;
let roomNo = null;
let socket = io();
const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
const apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
let base64Info = "";
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    //@todo here is where you should initialise the socket operations as described in teh lectures (room joining, chat message receipt etc.)
    initSocket();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
    }
    loadData(false);


}

function widgetInit(){
    let type= document.getElementById("myType").value;
    if(type){
        let config = {
            'limit': 10,
            'languages': ['en'],
            'types': [type],
            'maxDescChars': 100,
            'selectHandler': selectItem,
        }

        KGSearchWidget(apiKey, document.getElementById("myInput"), config);
        document.getElementById('typeSet').innerHTML= 'of type: '+type;
        document.getElementById('widget').style.display='block';
        document.getElementById('typeForm').style.display= 'none';
    }else {
        alert('Set the type please');
        document.getElementById('widget').style.display='none';
        document.getElementById('resultPanel').style.display='none';
        document.getElementById('typeSet').innerHTML= '';
        document.getElementById('typeForm').style.display= 'block';
    }


}

function selectItem(event){
    let row= event.row;
    //document.getElementById('resultImage').src= row.json.image.url;
    document.getElementById('resultId').innerText= 'id: '+row.id;
    document.getElementById('resultName').innerText= row.name;
    document.getElementById('resultDescription').innerText= row.rc;
    document.getElementById("resultUrl").href= row.qc;
    document.getElementById('resultPanel').style.display= 'block';
    //document.getElementById('resultPanel').innerHTML= '<PRE>'+JSON.stringify(row, null, 4)+'</PRE>';

}

function initSocket(){

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId){

        if (userId == name){
            //it enters the chat
            hideLoginInterface(room, userId);
        } else {
            //notifies that someone has joined the room
            writeOnHistory('<b>' + userId + '</b>' + 'joined room ' + room);
        }
    });
    //called when a message is received
    socket.on('chat', function (room, userId, chatText){
        let who = userId
        if(userId == name) who = 'Me ';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });

}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    // @todo send the chat message
    if (chatText.indexOf(".png") != -1 || chatText.indexOf(".jpg") != -1){
        changeImg(chatText,roomNo,name);
    }
    socket.emit('chat', roomNo, name, chatText);
    createMsgID(roomNo,name,chatText);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    let imageUrl= document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();
    //@todo join the room
    socket.emit('create or join', roomNo, name);
    initCanvas(socket, imageUrl );
    hideLoginInterface(roomNo, name);
    PrintHistoryMsg(roomNo);
}

/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnHistory(text) {
    if (text==='') return;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById('chat_input').value = '';
}
function cleartext() {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById('chat_input').value = '';
}
/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}
function imgChange(event){
    console.info(event.target.files[0]);// picture file
    var dom = $("input[id='picBase64']")[0];
    // console.info(dom.value);//path
    // console.log(event.target.value);// path
    var reader = new FileReader();
    reader.onload = (function (file){
        return function (event){
            // console.info(this.result);//base64
            var sss = $("#showImage");
            base64Info = this.result;
            $("#showImage")[0].src = this.result;
            // $("#base64Data")[0].content = this.result;

        };
    })(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0])
    document.getElementById('showImage').style.display = 'block'
}



/**
 * it sends an Ajax query using JQuery
 * @param url the url to send to
 * @param data the data to send (e.g. a Javascript structure)
 */
function sendAjaxQuery(url,data) {
    $.ajax({
        url: url ,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            var ret = dataR;
            // in order to have the object printed by alert
            // we need to JSON.stringify the object

        },
        error: function (xhr, status, error) {
            // the error structure we passed is in the field responseText
            // it is a string, even if we returned as JSON
            // if you want o unpack it you must do:
            // const dataR= JSON.parse(response.responseText)
            alert ('Error: '+ error.message);
        }
    });
}

/**
 * called when the submit button is pressed
 * @param event the submission event
 */

function onSubmit(url) {

    let formArray= $("#upForm").serializeArray();
    formArray.push({"name": "BaseCode", "value":base64Info});
    console.log(formArray);

    let data={};
    for (let index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());
    console.log(data);
    // data.push({"baseCode": "easf"});
    // console.log(data);
    // console.log(base64Info)
    sendAjaxQuery(url, data);
    event.preventDefault();
}
function gohome()
{
    window.location.href=".."
}

