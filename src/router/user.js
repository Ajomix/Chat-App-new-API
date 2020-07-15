const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const User = require('../model/User')
const Room = require('../model/Room')
const Message = require('../model/Message')
const passport = require('passport')
const multer = require('multer')
const auth = require('../config/auth')
const fs = require('fs')
const path = require('path')
const { sendWellcome, sendCancledUser} = require('../email/account')
//Get Profile
router.get('/profile/me',(req,res)=>{
    if(req.isAuthenticated()){
         
        return res.render('profile',{
            displayname:req.user.displayname,
            username:req.user.username, 
            email:req.user.email, 
            id:req.user._id,
            avatar:req.user.avatar.toString('base64')
        })
    }
    return res.redirect('/login')
}) 
// ALL request 
router.get('/',async(req,res)=>{
    if(req.isAuthenticated()){
        
        return res.redirect('/myfriend')
    }
    return res.redirect('/login')
})

//chat Private Page
router.get('/chat/:id',async(req,res)=>{
    if(req.isAuthenticated()){
        try{
            const id = req.params.id
             

            const idGeneral = req.user.friends.find(val=>val._id+'' === id+'')
             

            if(idGeneral){

                const user = await User.find({'friends._id':id})
                let allMessage = await Message.findOne({_id:id})
                allMessage = allMessage.message
                let usermain 
    
                user.forEach(val=>{
                    if (val.username!==req.user.username){
                        usermain = val
                    }
                })
        
                allMessage.forEach(mess=>{
                    if(mess._id+''===req.user._id+''){
                        mess.avatar = req.user.avatar.toString('base64')
                    }else{
                        mess.avatar = usermain.avatar.toString('base64')
                    }
                })

                return res.render('chatPage',{
                    idGeneral:id,
                    avatarUsermain:usermain.avatar.toString('base64'),
                    displaynames: usermain.displayname,
                    _id: usermain._id,
                    allMessage ,
                    displayname2:req.user.displayname,
                    username:req.user.username,
                    avatar:req.user.avatar.toString('base64')
                })

            }else {
                return res.redirect('/myfriend')
            }

            
             
        }catch{
            res.status(400).send()
        }
    }
    return res.redirect('/login')
})

//login page 
router.get('/login',(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/myfriend')
    }
     
    return res.render('login')
})
// Register Page 
router.get('/register',(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/myfriend')
    }
    return res.render('register')
})

//friend page 
router.get('/myfriend',async(req,res)=>{
    if(req.isAuthenticated()){
         
        await req.user.populate({
            path:'allfr',
            select:['displayname','_id' ,'avatar']
        }).execPopulate()
        //save token in cookie
        req.session.cookie.token = req.user.tokens

        req.user.allfr.forEach(async(val,index)=>{
            val.idGeneral = req.user.friends[index]._id   
            val.avatar = await val.avatar.toString('base64')
        })
        return res.render('showFriend',{
            
            friend:req.user.allfr,
            displayname:req.user.displayname, 
            username:req.user.username, 
            avatar:await req.user.avatar.toString('base64')
        })
    }
    return res.redirect('/login') 
})

router.get('/user/me',(req,res)=>{
    if(req.isAuthenticated()){
        res.send(req.user)
    }
    res.status(401).send({err:'check authorization'})
})

//Get User Opponent 
router.get('/user/:id',async(req,res)=>{
    try{
        const _id = req.params.id
        const user = await User.findOne({_id})
        res.status(200).send(user)
    }catch{
        res.status(404).send()
    }
    
})
router.get('/logout',auth, async(req, res)=>{
    req.logout();
    res.redirect('/');
});
// all request 
router.get('/*',(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/myfriend')
    }
    res.redirect('/login')

})  
//--------------------------------------------------------------
//avatar upload 
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload accurate file PNG or JPG or JPEG'))
        }
        cb(undefined,true)
    }
})
router.post('/user/avatar/me',auth ,upload.single('avatar'), async(req,res)=>{
    try{
        req.user.avatar = req.file.buffer
        await req.user.save()
        res.send()
    }catch{ 
        res.status(400).send()
    }
})
//save Message 
router.post('/user/message',async(req, res)=>{
    if(req.isAuthenticated()){
        let message = await Message.findOne({_id:req.body.idGeneral})
        if(message.message.length !== 0){
            if(message.message[message.message.length - 1].displayname === req.user.displayname  ){
                message.message[message.message.length-1].textMessage += ' \n' + req.body.message
                 await message.save()
                 return res.send()
            }
        }
        
        
        message.message = message.message.concat({_id:req.user._id,displayname:req.user.displayname,avatar:req.user.avatar,textMessage:req.body.message,timeCreate:req.body.timestampe})
        await message.save()
        return res.send()
    }
    res.status(401).send()
})

// Add friend 
router.post('/user/add/:username',async(req,res)=>{
    if(req.isAuthenticated()){
        try{

            const idGeneral = mongoose.Types.ObjectId();

            const userAdd = await User.findOne({username:req.params.username})
            const idUserAdd = userAdd._id
            const check = req.user.friends.find(friend=>{
                if(friend.friend+'' === idUserAdd+''){
                    return true
                }
            })
            
            if(!check && userAdd.username !== req.user.username){
                const message = new Message({_id:idGeneral})
                req.user.friends = req.user.friends.concat({_id:idGeneral,friend:idUserAdd})
                userAdd.friends  = userAdd.friends.concat({_id:idGeneral,friend:req.user._id})
    
                await message.save()
                await req.user.save()
                await userAdd.save() 
    
                return res.send('Add friend success')   
            }
            
        }catch(e){
            console.log(e)
            return res.status(400).send({error:'Cant add Friend '})
        }
      
    }
    return res.status(401).send()
})

//Login "POST"
router.post('/user/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/chat',
        failureRedirect:'/login'
    })(req,res,next)
})

//Register "POST"
router.post('/user/register',async(req,res)=>{
    if(!req.body){
        console.log(req.body)
        return res.status(400).send({error: 'need enough request '})
    }
    try{

        //default avatar
        req.body.avatar = await fs.readFileSync(path.join(__dirname,'../extends/default.jpg'))
        
        const user = new User(req.body)
        const token = await user.generateToken()
        const check = await user.save()

         

        if(!user || !check ) console.log('error')
        res.status(201).send({user,token})
        
    }catch(e){
        console.log(e)
        res.status(400).send('Cant not create User ')
    }
})
module.exports = router