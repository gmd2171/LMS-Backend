const router = require('express').Router();
const User = require('../models/User');
var CryptoJS = require("crypto-js");
const verify = require('./verify');

//Verification Has Been Used In Middleware
//EditUser
router.put('/:id', verify, async (req, resp) => {
    try {
        if (req.user.id === req.params.id || req.user.role==="Student") {
            if (req.body.password) {
                req.body.password = CryptoJS.AES.encrypt(
                    req.body.password,
                    process.env.SECRET_KEY).toString()
            }
            console.log(req.body);
            const updateduser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true }
            );
            console.log(updateduser);
            resp.status(200).send("sdokfmd");
        } else {
            resp.status(404).send("You can only update your account");
        }

    } catch (error) {
        resp.status(404).send("You can only update your account");
    }
})

//DeleteUser
router.delete('/delete', verify, async (req, resp) => {
    try {
        if (req.user.role==="Admin") {
            console.log(req.body);
            const deleteuser = await User.findByIdAndDelete(req.body.id);
            console.log(deleteuser);
            resp.status(200).send("User has been Deleted");
        } else {
            resp.status(404).send("You can only update your account");
        }

    } catch (error) {
        resp.status(404).send("Account can't be deleted");
    }
})

//GetAllUsers 
router.get('/all',verify, async (req, resp) => {
    console.log("all users");
     try {
             const users = await User.find();
             resp.status(200).send(users);    
         } catch (error) {
         resp.status(404).send("Account can't be ");
     }
 })




//ViewProfileByName
router.delete('/profile', verify, async (req, resp) => {
    try {
        if (req.user.role==="Admin") {
            console.log(req.body);
            const findUser = await User.find(req.body.name);
            console.log(findUser);
            resp.status(200).send("Your User");
        } else {
            resp.status(404).send("Your can't access user");
        }

    } catch (error) {
        resp.status(404).send("Soory your role isn't suuficent");
    }
})

//GetAllTEachers
router.get('/teacher', verify, async (req, resp) => {
    try {
        if (req.user.role==="Head") {
            console.log(req.body);
            console.log(req.body.role);
            const findTeacher = await User.find({role : req.body.role});
            console.log(findTeacher);
            resp.status(200).send("Your Teachers");
        } else {
            resp.status(404).send("Your can't access Teachers");
        }

    } catch (error) {
        resp.status(404).send("Soory your role isn't suuficent");
    }
})

module.exports = router;