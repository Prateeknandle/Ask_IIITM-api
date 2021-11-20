const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require("../middleware/authenticate");
require('../db/connection');
const Opp = require('../models/OppSchema');

router.get('/opportunity',authenticate,(req,res)=>{
    Opp.find({})
    .populate("postedBy","_id name")
    .then(opps=>{
        res.json(opps)
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/writeopp',authenticate,async(req,res)=>{
    const{title,desc,location,experience,ld} = req.body;
    if(!title||!desc||!location||!experience||!ld){
        return res.status(422).json({error:"Fill all the fields"})
    }
    const opp = new Opp({title,desc,location,experience,ld,postedBy:req.rootUser})
    await opp.save();
    res.status(201).json({message:"done"});
})

router.put('/editopp',authenticate,(req,res)=>{
    Post.findByIdAndUpdate(req.body.oppId),{
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

router.delete('/deleteopp/:id',authenticate,(req,res)=>{
    Post.findOne({_id:req.params.id})
    .populate("postedBy","_id")
    .exec((err,opp)=>{
        if(err || !opp){
            return res.status(422).json({errror:err})
        }
        if(opp.postedBy._id.toString() === req.rootUser._id.toString()){
            opp.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router;