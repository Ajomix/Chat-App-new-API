const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dungbn1234567:Dungbn123@cluster0.rjtjs.mongodb.net/new-api-chat-app?retryWrites=true&w=majority',{
    useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false
})
mongoose.set('useCreateIndex', true);
//'mongodb://127.0.0.1:27017/chat-app-api'