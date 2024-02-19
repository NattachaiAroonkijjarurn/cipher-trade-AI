import { client } from '../db.js'

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