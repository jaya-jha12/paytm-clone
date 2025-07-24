import express from 'express';
import jwt from 'jsonwebtoken';
import zod from 'zod';
import bcrypt from 'bcrypt';
import { User,Account} from '../db.js';
import {authmiddleware} from '../middlewares.js'
import dotenv from 'dotenv';
dotenv.config();

const router=express.Router();

const signupBody=zod.object({
    username:zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string()
})

router.post('/signup',async (req,res)=>{
    const { success }=signupBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect input"
        })
    }
    const existingUser=await User.findOne({
        username:req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            message:"Email already taken"
        })
    }
    try{
        const hashed= await bcrypt.hash(req.body.password,10);
        const user=await User.create({
            username:req.body.username,
            password:hashed,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
        })
        const userId=user._id;
        await Account.create({
            userId:userId,
            balance:1+Math.random()*10000000
        })

        const token = jwt.sign({
            userId
        }, process.env.JWT_SECRET);

        res.json({
            message:"User created successfully",
            token: token
        })
    }catch(err){
        console.error("Signup Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }

})

const signinBody=zod.object({
    username:zod.string(),
    password:zod.string()
})

router.post('/signin',async (req,res)=>{
    const { success }=signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }
    const user=await User.findOne({
        username:req.body.username
    })
    if(!user){
        return res.status(411).json({
            message:"user not found!!"
        })
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Wrong password" });
    }
    const token =jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET);
    res.json({
        token:token
    });
})

const updateBody=zod.object({
    password:zod.string().optional(),
    firstname:zod.string().optional(),
    lastname:zod.string().optional()
})

router.put('/',authmiddleware, async (req,res)=>{
    const { success }=updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }
    if (req.body.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hashedPassword;
    }
    await User.updateOne({
        _id: req.userId
    },req.body)
    res.json({
        message: "Updated successfully"
    })
})

router.get('/bulk',async (req,res)=>{
    const filter=req.query.filter || '';
    const users=await User.find({
        $or:[{
            firstname:{ "$regex" :filter}
        },{
            lastname:{ "$regex" :filter}
        }
        ]
    })
    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }
    res.json({
        user: users.map(user=> ({
            username:user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})

export default router;