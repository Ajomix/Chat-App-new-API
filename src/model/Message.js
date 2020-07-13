const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
        
        message:[{
            own:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Users'
            },
            displayname:{
                type:String
            },
            textMessage:{
                type:String
            }
            ,timeCreate :{
                type:String
            }
        }]
})
 

const Message = mongoose.model('Message',MessageSchema)
module.exports = Message