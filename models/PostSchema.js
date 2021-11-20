const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
     likes:[{type:mongoose.Schema.Types.ObjectId,ref:"USER"}],
     comments:[{
         text:String,
         postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"USER"}
     }],
   postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    }
    //,categories: [{ type: String, required: true }]
})

const Post = module.exports = mongoose.model('POST', PostSchema);
module.exports = Post;
