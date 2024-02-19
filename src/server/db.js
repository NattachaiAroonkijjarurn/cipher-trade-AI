import mongoose from 'mongoose';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config() ;

const uri = process.env.DATABASE;
const client = new MongoClient(uri)

const connectDB = async() => {

    try {
        await mongoose.connect(process.env.DATABASE);
    }catch(err) {
        console.log(err);
    }

}

export {connectDB, client};