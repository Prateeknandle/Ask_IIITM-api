const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//require('../db/connection');  
const User = require('../models/UserSchema');


router.post('/signup',async(req,res) =>{
    const {name,email,password,cpassword} = req.body;
    
    if(!name ||!email || !password ||!cpassword){
        return res.status(422).json({errror : "Fill all the credentials"});
    }

    try{
        const userExist = await User.findOne({email:email})
        if(userExist){
            return res.status(422).json({error:"email is same"});
        }else if( password != cpassword){
            return res.status(422).json({error:"password not same"});
        }else{
            bcrypt.hash(password,12)
            .then(hashedpass=>{
                const user = new User({name,email,password:hashedpass});
                 user.save();
                res.status(201).json({message:"done"});
            }) 
        }
    }catch(err){
        console.log(err);
    }
        });

        router.post('/login',async(req,res)=>{
            const {email,password} = req.body;

            if(!email || !password){
                return res.status(422).json({error:"Fill all the credentials"})
            }
            try{
                const user = await User.findOne({email:email})
                if(user){
                    const isMatch = await bcrypt.compare(password,user.password);
                    if(!isMatch){
                        return res.json({error:"user error"});
                     }else{
                        //return res.json({message:"done"});  
                        const token = jwt.sign({_id:user._id},process.env.SECRET_KEY)
                        res.json({token})
                     } 
                }
            }catch(err){
                console.log(err)
            }
        })

module.exports = router;