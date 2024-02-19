import { client } from '../db.js'

const dbName = client.db('CipherTrade')
const collection_account_mt = dbName.collection('account_metaTrade')

const getAccountMT = async (req, res) => {
    try {
      const { user_id } = req.query; 
      const account_mt_user = await collection_account_mt.findOne({ "user_id": user_id });
      if (account_mt_user) {
        res.json(account_mt_user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Fetch account error' });
    }
  };

export {getAccountMT}