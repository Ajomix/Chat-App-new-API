//App require
const express               = require('express')
const app                   = express()
const path                  = require('path')
const hbs                   = require('hbs')
const passport              = require('passport')
const session               = require('express-session')
const bodyParser            = require('body-parser')
const axios                 = require('axios')
const { generateMessage }   = require('./ultils/generateMessage')
 
//MongoDB database
require('./db/mongoose')

// Set up PATHS views
const viewsPath       =  path.join(__dirname,'../template/views')
const partialsPath    =  path.join(__dirname, '../template/partial')
const publicDirectory = path.join(__dirname , '../public')
const PORT            =  process.env.PORT || 3000

// Set up views
app.use(express.static(publicDirectory))
app.set('view engine' ,'hbs')
app.set('views' ,viewsPath)
hbs.registerPartials(partialsPath)

//Set Up parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Set up Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    SameSite :true,
    Secure :true
}))

//Config Passprt 
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

//Router to request 
app.use((req,res,next)=>{
    if(req.isAuthenticated()){
        io.use((socket,next)=>{             
            socket.handshake.user = req.user
            next()
    })    
    }
    
    next()
})
app.use(require('./router/user'))

// Create Server
const server = require("http").Server(app)

//Create Socket.io
const io     = require('socket.io')(server)
// Connect to socket io 
io.on('connection',(socket)=>{

    socket.on('id',idGeneral=>{
        
        const isMatch = socket.handshake.user.friends.find(val=>val._id+''===idGeneral+'')
        if(isMatch){
            socket.handshake.user.idGeneral = idGeneral
            socket.join(socket.handshake.user.idGeneral)        
        }
    })
    if(socket.handshake.user.displayname){
        io.to(socket.handshake.user.idGeneral).emit('message',generateMessage('Hello',socket.handshake.user.displayname))
    }

    socket.on('message',({message,idGeneral},cb)=>{ 
        io.to(socket.handshake.user.idGeneral).emit('message',generateMessage(message,socket.handshake.user.displayname,socket.handshake.user.avatar.toString('base64')))
        cb()
    })
     

})

//Server listening 
server.listen(PORT,()=>{
    console.log('server is running')
})



 