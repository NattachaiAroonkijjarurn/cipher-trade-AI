import { client } from '../db.js'

const dbName = client.db('CipherTrade')
const collection_account_mt = dbName.collection('account_metaTrade')

const getAccountMT = async (req, res) => {
  try {
    const { user_id } = req.query;
    // Use .find() to get a cursor for documents with matching user_id
    const account_mt_users = await collection_account_mt.find({ "user_id": user_id }).toArray();
    if (account_mt_users.length > 0) {
      res.json(account_mt_users);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetch account error' });
  }
};

const sendAccountMT = async (req, res) => {
  try {
    const result = await collection_account_mt.insertOne(req.body); // Store the result of the insertion
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "can't send account MT to db" });
  }
};

const changeStatusBot = async (req, res) => {
  try {
    const { user_id, username_mt5, model_name, status } = req.body;
    await collection_account_mt.updateOne({
      "username_mt5": username_mt5,
      "user_id" : user_id,
      "bots.model_name": model_name
    }, {
      "$set": {
        "bots.$.status": status
      }
    });
    res.status(201).json({message : "change status successful"})
  } catch (error) {
    res.status(500).json({message: "can't change status bot"})
  }
}

const editAccountMT = async (req, res) => {
  try {
    const {name_account, user_id, old_username_mt5, username_mt5, password_mt5, server} = req.body;
    await collection_account_mt.updateOne({
      "user_id" : user_id,
      "username_mt5" : old_username_mt5
    }, {
      "$set" : {
        "name_account" : name_account,
        "username_mt5" : username_mt5,
        "password_mt5" : password_mt5,
        "server" : server
      }
    })
    res.status(201).json({message : "edit account successful"})
  } catch (error) {
    res.status(500).json({message: "can't edit account"})
  }
}

const deleteAccountMT = async (req, res) => {
  try {
    const {username_mt5, user_id} = req.body;
    await collection_account_mt.deleteOne({
      "username_mt5" : username_mt5,
      "user_id" : user_id
    })
    res.status(201).json({message : "delete account successful"})
  } catch (error) {
    res.status(500).json({message: "can't delete account", error : error})
  }
}

export {getAccountMT, sendAccountMT, changeStatusBot, editAccountMT, deleteAccountMT}