import { client } from '../db.js'

const dbName = client.db('CipherTrade')
const collection_account_mt = dbName.collection('account_metaTrade')

const getAccountMT = async (req, res) => {
  try {
    const { user_id } = req.query;
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
    const newAccountMT = req.body

    newAccountMT.username_mt5 = parseInt(newAccountMT.username_mt5, 10);

    if (isNaN(newAccountMT.username_mt5)) {
      return res.status(400).json({ message: "Username MT5 must be a numeric value." });
    }

    const existingBotNameAccount = await collection_account_mt.findOne({
      user_id : newAccountMT.user_id,
      name_account : newAccountMT.name_account
    })
    if (existingBotNameAccount) {
      return res.status(400).json({ message: "Name account already exists." });
    }

    const existingBotUsername_MT = await collection_account_mt.findOne({
      user_id : newAccountMT.user_id,
      username_mt5 : newAccountMT.username_mt5
    })
    if (existingBotUsername_MT) {
      return res.status(400).json({ message: "Username MT5 already exists." });
    }
    const result = await collection_account_mt.insertOne(newAccountMT); // Store the result of the insertion
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

const insertBotInAccountMT = async (req, res) => {
  try {
    const { user_id, username_mt5, bot } = req.body;
    const model_name = bot.model_name;

    bot.lotsize = parseFloat(bot.lotsize)
    if (isNaN(bot.lotsize)) {
      return res.status(400).json({ message: "lot size must be a numeric value."});
    }

    const existingBot = await collection_account_mt.findOne({
      "username_mt5": username_mt5,
      "user_id": user_id,
      "bots.model_name": model_name 
    });

    if (existingBot) {
      return res.status(400).json({ message: "Bot with this model_name already exists." });
    }

    const result = await collection_account_mt.updateOne({
        "username_mt5": username_mt5,
        "user_id": user_id
      }, {
        $push: { "bots": bot }
      }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Account not found." });
    }

    res.status(201).json({ message: "Insert bot in account MT successful" });
  } catch (error) {
    res.status(500).json({ message: "Can't insert bot in account MT", error: error });
  }
};

const deleteBotInAccountMT = async (req, res) => {
  try {
    const { user_id, username_mt5, model_name } = req.body;
    const result = await collection_account_mt.updateOne({
      "username_mt5": username_mt5,
      "user_id": user_id
    }, {
      "$pull": { "bots": { "model_name": model_name } }
    });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Bot not found or already deleted." });
    }
    res.status(200).json({ message: "Delete bot in account MT successful" });
  } catch (error) {
    res.status(500).json({ message: "Can't delete bot in account MT", error: error });
  }
};

const updateDetailAccountMT = async (req, res) => {
  try {
    const {username_mt5, leverage, company, balance} = req.body
    const user_id = req.session.user_id
    const result = await collection_account_mt.updateOne({
      "username_mt5": username_mt5,
      "user_id": user_id
    }, {
      "$set": { 
        "leverage": leverage,
        "company" : company,
        "balance" : balance
     }
    });
    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      return res.status(404).json({message: "can't found and data update detail account mt"});
    }
    res.status(200).json({message: "update detail account mt successful"})
  } catch (error) {
    res.status(500).json({message: "Can't update detail account mt", error:error})
  }
}

export {getAccountMT, 
  sendAccountMT, 
  changeStatusBot, 
  editAccountMT, 
  deleteAccountMT, 
  insertBotInAccountMT, 
  deleteBotInAccountMT,
  updateDetailAccountMT}