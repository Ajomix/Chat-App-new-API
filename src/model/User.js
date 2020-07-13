const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
 

const userSchema = new mongoose.Schema({
    displayname:{
        require:true , 
        type:String , 
        trim:true ,
        validate:input=>{
            if(input.length < 6 ) throw new Error('Display name need to be > 6 character ')
        } 
    },
    username:{
        type:String ,
        unique:true,
        require:true ,
        trim:true, 
        validate:(input)=>{
            if(input.length < 8){
                throw new Error('Username need to be > 8 char')
            }
        }
    }
    ,
    email:{
        type:String, 
        require:true, 
        trim:true, 
        lowercase:true, 
        validate: input =>{
            if(!validator.isEmail(input)){
                throw new Error('That is not email')
            }
            if(input.includes(' ')){
                throw new Error('Dont need space in that form  ')
            }
        }
    }
    ,
    password:{
        type:String , 
        require:true , 
        validate:input=>{
            if(input.length<5){
                throw new Error('Password is so weak')
            }
        }
    },avatar:{
        type:Buffer
    },
    imgSendeds:[{
        imgSend:{
            type:Buffer
        },
        timestamp:{
            type:String
        }
      }
    ],
    friends:[{
        friend:{
            type:mongoose.Schema.Types.ObjectId ,
            ref:'Users'
        } 
    }],
    tokens:[{
        token:{
            type:String, 
            require:true,
        }
    }]
    
},{
    timestamps:true
})
 
userSchema.virtual('allfr',{
    ref:'Users',
    localField: 'friends.friend', // Find people where `localField`
    foreignField: '_id' // is equal to `foreignField`
})
userSchema.methods.toJSON = function(){
    const user  = this 
    const userObject = user.toObject()

    delete userObject._id
    delete userObject.tokens
    delete userObject.password
    
    return userObject
   
}
userSchema.methods.generateToken = async function(){
    const user = this 
    const token = await jwt.sign({_id:user._id},process.env.jwtVerify)
    if(!token) return {error:'Cant generate token'}
    user.tokens = user.tokens.concat({token})
    //user.save().then(() =>console.log('Realease token success')).catch(e=> console.log(e))
    return token
} 

userSchema.statics.criteriaLogin = async (username,password)=>{   
    const user = await User.findOne({username})
    const check = bcrypt.compareSync(password , user.password)
    if(!user) return 
    if(!check) return
    return user
}
 
userSchema.pre('save',async function(next){
    const user = this 
    if(user.isModified('password') )user.password = await bcrypt.hash(user.password,8)
    next()
})
const User = mongoose.model('Users' , userSchema)
module.exports = User