const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const User = require('../models/UserSchema');

router.get('/display',authenticate,(req,res)=>{
    User.findById(req.rootUser._id)
    .then(p=>{
        res.json(p)
    }).catch(err=>{
        console.log(err)
    })
})

// router.put('/editprofile',authenticate,(req,res)=>{
//     User.findByIdAndUpdate(req.rootUser._id,{
//         $set:req.body,
//     },{
//         new:true
//     }.exec((err,result)=>{
//         if(err){
//             return res.status(422).json({errror:err})
//         }else{
//             res.json(result)
//         }
//     })
// )
// })

router.put('/editprofile',authenticate,(req,res) => {
    User.findByIdAndUpdate(req.rootUser._id, {
      $set: req.body
    }, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data)
        console.log('Student updated successfully !')
      }
    })
  })

module.exports = router;