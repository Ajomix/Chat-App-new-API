const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    me:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    friend:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
})

const Room = mongoose.model('Room',RoomSchema)
module.exports = Room