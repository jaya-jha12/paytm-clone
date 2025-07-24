import express from 'express';
import mongoose from 'mongoose';
import { authmiddleware } from '../middlewares.js';
import { Account } from '../db.js';

const router=express.Router();
console.log("account.js router loaded");


router.get('/balance', authmiddleware,async (req,res)=>{
    const account=  await Account.findOne({
        userId:req.userId
    })
    res.json({
        balance: account.balance
    })
})

router.post('/transfer', authmiddleware, async (req, res) => {
  console.log(" /transfer route hit");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { amount, to } = req.body;

    //  Step 1: Check if receiver exists
    const receiver = await Account.findOne({ userId: to }).session(session);
    if (!receiver) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Receiver account not found" });
    }

    // Step 2: Atomically deduct balance only if sender has enough
    const sender = await Account.findOneAndUpdate(
      {
        userId: req.userId,
        balance: { $gte: amount } //greater than and equal to
      },
      {
        $inc: { balance: -amount }
      },
      {
        session,
        new: true
      }
    );

    if (!sender) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount }},
      {
        session
      }
    )

    await session.commitTransaction();
    res.status(200).json({ message: "Transfer successful!" });

  } catch (err) {
    await session.abortTransaction();
    console.error(" Transfer failed:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
});


export default router;