const jwt = require("jsonwebtoken");
const Blog = require("../models/PostSchema");

const PostBlog = async(req,res,next) =>{
try{    
    const token = req.cookies.jwtoken;
    //const token = localStorage.getItem(jwt);
    const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
    const rootBlog = await User.findOne({_id:verifyToken._id,"tokens.token":token});

    if(!rootBlog){throw new Error('Blog not found')}

    
    req.token = token;
    
    req.userid = rootUser._id;
    req.rootBlog = rootBlog;

    next();

}catch(err) {
res.status(401).send('Unauthorized:No token provided');
console.log(err);
}

router.post('/write',authenticate,async(req,res) =>{
    const{title,body} = req.body;
    if(!title || !body){
        return res.status(422).json({errror : "Fill all the coloumns"});
    }
  // req.rootUser.password = undefined
   //req.rootUser.cpassword = undefined
        const post = new Post({title,body});
       // console.log(req.rootUser);
    await post.save();
     res.status(201).json({message:"done"});
    
} );
router.get('/post',authenticate,(req,res)=>{
    Post.find()
    .populate("postedBy","_id username")
    .populate("comments.postedBy","_id username")
    .then(posts=>{
        res.json(posts)
    }).catch(err=>{
        console.log(err)
    })
})

}

module.exports = PostBlog;