let mongoose = require('../database/db-connect');

let Schema = mongoose.Schema;

let ChatSchema = new Schema(
    {
        ImageTitle: {type: String, max: 20},//required: true,
        Description: {type: String, max: 100},//required: true,
        Author: {type: String},
        BaseCode:{type: String}
        // whatever: {type: String} //any other field
    }
    // {
    //     name: {type: String, max: 100},//required: true,
    //     room: {type: String, max: 100},//required: true,
    //     URL: {type: String},
    //     // whatever: {type: String} //any other field
    // }
);

// Virtual for a character's age
// Character.virtual('age')
//     .get(function () {
//         const currentDate = new Date().getFullYear();
//         const result= currentDate - this.dob;
//         return result;
//     });

// Character.set('toObject', {getters: true, virtuals: true});

//model for do action on database
let chatModel = mongoose.model('Chat', ChatSchema, 'chat' );

module.exports = chatModel;