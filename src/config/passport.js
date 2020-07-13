const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../model/User');
 

module.exports = function(passport){
    passport.use(new localStrategy(
        async(username, password,done)=>{
          try{
            const user = await User.criteriaLogin(username,password);
            const token = await user.generateToken();
            console.log('dang chay den day ne');
            await user.save();
            return done(null, user);
          }catch{
            
            return done(null,false);
          }
           
           
        }
    ));

    passport.serializeUser((user, done) =>{

        done(null, user.id);
    });
      
      passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user) =>{
          done(err, user);
        });
      });
}