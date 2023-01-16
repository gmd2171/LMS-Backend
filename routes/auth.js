const router= require('express').Router();
const User = require('../models/User');
var CryptoJS = require("crypto-js");
const jwt= require('jsonwebtoken');

//Authentication
//Signup
console.log("I am working");
router.post("/signup",async (req,resp)=>{
    const newuser = new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY).toString()
    });
    try{
        const user = await  newuser.save();
        resp.json(user);   
    }
    catch (err){
        resp.status(500).json(err);
    }
   
});


//Assigntoken
//Login
router.post("/login",async (req,resp)=>{
    try{
               const user = await User.findOne({email:req.body.email});
               console.log(user);
               if (!user){
                resp.status(401).send("Wrong password or username");
               }
               else {
                const bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
                const orignalpassword = bytes.toString(CryptoJS.enc.Utf8);
                console.log(orignalpassword);
                if(orignalpassword!==req.body.password){
                    resp.status(401).send("Wrong password or username");
                }else{
                    console.log(user);
                    const accesstoken=jwt.sign(
                        {id:user._id ,role:user.role},
                        process.env.SECRET_KEY,
                        {expiresIn:"1d"} //logout
                    );
                    const {password, ...otherDetails} = user._doc;
                    resp.status(200).send({...otherDetails,accesstoken});
                }
               }

    }catch(err){
        resp.status(500).json(err);

    }
})

module.exports=router;