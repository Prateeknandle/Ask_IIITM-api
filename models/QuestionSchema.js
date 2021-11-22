const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    qtitle:{
        type:String,
        required:true
    },
    descofq:{
        type:String,
        required:true
    },
    // pic:{
    //     type:String,
    //     default:"no photo"
    // },
    answers:[
        {
            answer:{
                type:String
            },
            likes:[{type:mongoose.Schema.Types.ObjectId,ref:"USER"}],
            // picofa:{
            //     type:String,
            //     default:"no photo"
            // },
            postedBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"USER"
            }
        }
    ],
    postedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "USER"
     }
    //  categories: [{ type: String, required: true }]
})

const Question = module.exports = mongoose.model('QUESTION', QuestionSchema);
module.exports = Question;