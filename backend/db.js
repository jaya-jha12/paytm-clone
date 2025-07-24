import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
};


const { Schema }=mongoose;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:40
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstname:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    lastname:{
        type:String,
        trim:true,
        maxLength:50
    }
})

const accountSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    balance:{
        type:Number,
        required:true
    }
})

export const User=mongoose.model('User',userSchema);
export const Account=mongoose.model('Account',accountSchema);

