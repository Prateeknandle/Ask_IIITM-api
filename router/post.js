const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require("../middleware/authenticate");
require('../db/connection');
const Post = require('../models/PostSchema');

router.get('/post',authenticate,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(posts=>{
        res.json(posts)
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/write',authenticate,async(req,res) =>{
    const{title,body} = req.body;
    if(!title || !body){
        return res.status(422).json({errror : "Fill all the coloumns"});
    }
  // req.rootUser.password = undefined
   //req.rootUser.cpassword = undefined
        const post = new Post({title,body,postedBy:req.rootUser});
       // console.log(req.rootUser);
    await post.save();
     res.status(201).json({message:"done"});
    
} );

router.get('/myprofile',authenticate,(req,res)=>{
    Post.find({postedBy:req.rootUser._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.put('/updatepost',authenticate,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId),{
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

router.delete('/deletepost/:id',authenticate,(req,res)=>{
    Post.findOne({_id:req.params.id})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({errror:err})
        }
        if(post.postedBy._id.toString() === req.rootUser._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.put('/post/like',authenticate,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.rootUser._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({errror:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/post/unlike',authenticate,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.rootUser._id}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({errror:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/post/comment',authenticate,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.rootUser._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({errror:err})
        }else{
            res.json(result)
        }
    })
})


router.get('/post/:id',async (req,res)=>{
        Post.findById(req.params.id)
        .populate("postedBy","_id name")
        .populate("comments.postedBy","id name")
        .then(post=>{
            res.json(post)
        }).catch(err=>{
            console.log(err)
        })
    })

router.get("/c/", async (req, res) => {
    const heading = req.query.heading;
    const catName = req.query.cat;
    try {
      let posts;
      if (heading) {
        posts = await Post.find({ heading });
      } else if (catName) {
        posts = await Post.find({
          categories: {
            $in: [catName],
          },
        });
      } else {
        posts = await Post.find();
      }
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

 module.exports = router;