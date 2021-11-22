const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require("../middleware/authenticate");
require('../db/connection');
const Question = require('../models/QuestionSchema');

router.get('/questions',authenticate,(req,res)=>{
    Question.find()
    .populate("postedBy","_id name")
    .then(questions=>{
        res.json(questions)
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/writequestion',authenticate,async(req,res)=>{
    const{qtitle,descofq} = req.body;
    if(!qtitle||!descofq){
        return res.status(422).json({error:"Fill all the fields"})
    }
    const question = new Question({qtitle,descofq,postedBy:req.rootUser})
    await question.save();
    res.status(201).json({message:"done"});
})

router.put('/editquestion',authenticate,(req,res)=>{
    Question.findByIdAndUpdate(req.body.questionId),{
        $set:req.body,
    },{
        new:true
    }.exec((err,result)=>{
        if(err){
            return res.status(422).json({errror:err})
        }else{
            res.json(result)
        }
    })
})

    router.post('/answer/:id',authenticate,(req,res)=>{
    Question.findById(req.params.id).then(question=>{
        question.answers.push({ answer: req.body.answer,postedBy:req.rootUser});
         question.save()
         .then(result=>{
            res.json(result)
        }).catch(err=>{
            res.status(400).send(err);
        })
    }).catch(err=>{
        res.status(200).send(err);
   })
})


router.delete('/deletequestion/:id',authenticate,(req,res)=>{
    Question.findOne({_id:req.params.id})
    .populate("postedBy","_id")
    .exec((err,question)=>{
        if(err || !question){
            return res.status(422).json({errror:err})
        }
        if(question.postedBy._id.toString() === req.rootUser._id.toString()){
            question.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.get('/question/:id',authenticate,(req,res)=>{
    Question.findById(req.params.id)
    .populate("postedBy","_id name")
    .populate("answers.postedBy","_id name")
    .then(ques=>{
        res.json(ques)
    }).catch(err=>{
        res.status(400).send(err);
    })
})

// router.put('/answer/like',authenticate,(req,res)=>{
//     Question.answers.answer.findByIdAndUpdate(req.body.ansId,{
//         $push:{likes:req.rootUser._id}
//     },{
//         new:true
//     }).exec((err,result)=>{
//         if(err){
//             return res.status(422).json({errror:err})
//         }else{
//             res.json(result)
//         }
//     })
// })
// router.put('/answer/like',authenticate,(req,res)=>{
//     Question.findById(req.body.quesId).then(question=>{
//         question.answers.findByIdAndUpdate(req.body.ansId,{
//             $push:{likes:req.rootUser._id}
//         },{
//             new:true
//          })
// }).then(result=>{
//     res.json(result)
// }).catch(err=>{
//     res.status(400).send(err);
// })
// })

// router.put('/answer/unlike',authenticate,(req,res)=>{
//     Question.findById(req.body.quesId).then(question=>{
//         question.answers.findByIdAndUpdate(req.body.ansId,{
//             $pull:{likes:req.rootUser._id}
//         },{
//             new:true
//         }).exec((err,result)=>{
//             if(err){
//                 return res.status(422).json({errror:err})
//             }else{
//                 res.json(result)
//             }
//         })
         
// })
// })
// router.put('/answer/unlike',authenticate,(req,res)=>{
//     Question.answers.answer.findByIdAndUpdate(req.body.ansId,{
//         $pull:{likes:req.rootUser._id}
//     },{
//         new:true
//     })
//     .exec((err,result)=>{
//         if(err){
//             return res.status(422).json({errror:err})
//         }else{
//             res.json(result)
//         }
//     })
// })

module.exports = router;