const mongoose = require('mongoose')
mongoose.connect(decodeURIComponent(process.env.connect),{
    useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false
})
mongoose.set('useCreateIndex', true);
//'mongodb://127.0.0.1:27017/chat-app-api'

//