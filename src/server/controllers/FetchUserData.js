import { client } from "../db.js"

const dbName = client.db('CipherTrade')
const user_collection = dbName.collection('account_users')

const getUserData = async(req, res) => {

    try {
        const username = req.session.username
        const user = await user_collection.findOne({"username": username})

        const {_id, ...cleanedUserData} = user

        res.send(cleanedUserData)
    } catch(err) {
        res.send(err)
    }
  
}

export { getUserData }