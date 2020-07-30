const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('./models/user');
const bcrypt = require('bcrypt');


router.post('/signup', async(req,res,next)=>{
    const doc = await User.find({ email: req.body.email});
    if(doc){
        return res.status(400).json({
            message: 'USER_ALREADY_EXISTS'
        });
    }
    bcrypt.hash(req.body.password,10, (err,hash)=>{
        if(err){
            return res.status(400).json({
                error: err
            });
        }else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save((err,doc)=>{
                if(err){
                    res.status(409).json({
                        message: err.message
                    });
                }else{
                    res.status(201).json({
                        message: "USER_CREATED_SUCCESFULLY"
                    });
                }
            });
        }
    });
});

router.delete('/:id', (req,res,next)=>{
    User.findByIdAndDelete(req.params.id, (err,doc)=>{
        if(err){
            res.status(400).json({
                error: err
            });
        }else{
            res.status(200).json({
                message: "USER_DELETED"
            })
        }
    });
});

module.exports = router;