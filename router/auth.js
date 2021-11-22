const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
require('../db/connection');  
const User = require("../models/UserSchema");


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
            const user = new User({name,email,password});
            await user.save();
             res.status(201).json({message:"done"});
        }
    }catch(err){
        console.log(err);
    }
        });

        router.post('/login',async(req,res)=>{
            try{
                const{email,password} = req.body;
                if(!email||!password){
                    return res.status(400).json({error:"Invalid credentials"});
                }

                const userlogin = await User.findOne({email:email});
                if(userlogin){
                    const isMatch = await bcrypt.compare(password,userlogin.password);
                    const token = await userlogin.genrateAuthToken();
                        console.log(token);
                        const {_id,name,email} = userlogin
                        return res.json({token,user:{_id,name,email}})
                    //      res.cookie("jwtoken",token,{
                    //     expires:new Date(Date.now()+25892000000),
                    //     httpOnly:true
                    // })
                    

                    if(!isMatch){
                       return res.json({error:"user error"});
                    }else{
                       return res.json({message:"done"});  
                    }
                }else{
                   return res.json({message:"done"});
                }
                

            }catch(err){
                console.log(err);
            }
        });

module.exports = router;