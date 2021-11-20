const mongoose = require('mongoose');

const OppSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    ld:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    postedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "USER"
     }
})

const Opp = module.exports = mongoose.model('OPP', OppSchema);
module.exports = Opp;
