import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config() ;

const uri = process.env.DATABASE;

const client = new MongoClient(uri)
const dbName = client.db('CipherTrade')
const collection_model = dbName.collection('models')


const getModel = async(req, res) =>{
    try {
        const models = await collection_model.find({}).toArray();
        // console.log(models)
        return res.send(models)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Server Error' });
    }
}

export {getModel}