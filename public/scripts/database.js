////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';


/** class chatObject{
 *  constructor (id:int,room:int, username:string, msgID:int, msg:string) {
 *    this.id = id;
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
                    let imageDB = upgradeDb.createObjectStore(CHAT_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    imageDB.createIndex('room', 'room', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;
/**
 * it saves the forecasts for a city in localStorage
 * @param chat
 * @param chatObject
 */
async function storeCachedData(image, forecastObject) {
    console.log('inserting: '+JSON.stringify(forecastObject));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(CHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            await store.put(forecastObject);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(forecastObject));
        } catch(error) {
            localStorage.setItem(image, JSON.stringify(forecastObject));
        };
    }
    else localStorage.setItem(image, JSON.stringify(forecastObject));
}
window.storeCachedData= storeCachedData;

/**
 * it retrieves the forecasts data for a city from the database
 * @param city
 * @param date
 * @returns {*}
 */
async function getCachedData(city, date) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching: ' + city);
            let tx = await db.transaction(FORECAST_STORE_NAME, 'readonly');
            let store = await tx.objectStore(FORECAST_STORE_NAME);
            let index = await store.index('location');
            let readingsList = await index.getAll(IDBKeyRange.only(city));
            await tx.complete;
            let finalResults=[];
            if (readingsList && readingsList.length > 0) {
                let max;
                for (let elem of readingsList)
                    if (!max || elem.date > max.date)
                        max = elem;
                if (max)
                    finalResults.push(max);
                return finalResults;
            } else {
                const value = localStorage.getItem(city);
                if (value == null)
                    return finalResults;
                else finalResults.push(value);
                return finalResults;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        const value = localStorage.getItem(city);
        let finalResults=[];
        if (value == null)
            return finalResults;
        else finalResults.push(value);
        return finalResults;
    }
}
window.getCachedData= getCachedData;

/**
 * given the server data, it returns the value of the field precipitations
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getPrecipitations(dataR) {
    if (dataR.precipitations == null && dataR.precipitations === undefined)
        return "unavailable";
    return dataR.precipitations
}
window.getPrecipitations=getPrecipitations;

/**
 * given the server data, it returns the value of the field wind
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getWind(dataR) {
    if (dataR.wind == null && dataR.wind === undefined)
        return "unavailable";
    else return dataR.wind;
}
window.getWind=getWind;

/**
 * given the server data, it returns the value of the field temperature
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getAuthor(dataR) {
    if (dataR.author == null && dataR.author === undefined)
        return "unavailable";
    else return dataR.author;
}
window.getTemperature=getTemperature;

/**
 * the server returns the forecast as a n integer. Here we find out the
 * string so to display it to the user
 * @param forecast
 * @returns {string}
 */
function getForecast(forecast) {
    if (forecast == null && forecast === undefined)
        return "unavailable";
    switch (forecast) {
        case CLOUDY:
            return 'Cloudy';
        case CLEAR:
            return 'Clear';
        case RAINY:
            return 'Rainy';
        case OVERCAST:
            return 'Overcast';
        case SNOWY:
            return 'Snowy';
    }
}
window.getForecast=getForecast;
