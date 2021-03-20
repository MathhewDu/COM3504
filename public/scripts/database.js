////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';


/** class chatObject{
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
let db;

const CHAT_DB_NAME= 'db_chat_1';
const CHAT_STORE_NAME= 'store_chat';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(CHAT_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(CHAT_STORE_NAME)) {
                    let ChatDB = upgradeDb.createObjectStore(CHAT_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    ChatDB.createIndex('room', 'room', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;
/**
 * it saves the chat data for a room in localStorage
 * @param room
 * @param chatObject
 */
async function storeChatData(room,chatObject) {
    console.log('inserting: '+JSON.stringify(chatObject));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(CHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            await store.put(chatObject);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(chatObject));
        } catch(error) {
            localStorage.setItem(room, JSON.stringify(chatObject));
        };
    }
    else localStorage.setItem(room, JSON.stringify(chatObject));
}
window.storeChatData= storeChatData;

/**
 * it retrieves the histories chat data for a room from the database
 * @param room
 */
async function getChatData(room) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching: ' + room);
            let tx = await db.transaction(CHAT_STORE_NAME, 'readonly');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('room');
            let histories = await index.getAll(IDBKeyRange.only(room));
            await tx.complete;
            return histories;
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log('IndexedDB not available');
    }
}
window.getChatData= getChatData;

function getUsername(dataR) {
    if (dataR.username == null && dataR.username === undefined)
        return "unavailable";
    else return dataR.username;
}
window.getUsername=getUsername;

function getMsgID(dataR) {
    if (dataR.msgID == null && dataR.msgID === undefined)
        return "unavailable";
    else return dataR.msgID;
}
window.getMsgID=getMsgID;

function getMsg(dataR) {
    if (dataR.msg == null && dataR.msg === undefined)
        return "unavailable";
    else return dataR.msg;
}
window.getMsg=getMsg;