const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    tokens:[
        {
            token:{
                type: String,
                 required: true
            }
        }
    ]
})

UserSchema.methods.genrateAuthToken = async function (){
    try{
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}

const User = module.exports = mongoose.model('USER', UserSchema);
module.exports = User;