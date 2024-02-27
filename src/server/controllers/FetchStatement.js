import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { client } from "../db.js";
import fs from "fs/promises";
import path from "path";
import { TRANS_URL } from '../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbName = client.db('CipherTrade')
const user_collection = dbName.collection('account_users')

// =================================================== Orders ===================================================
const orders_collection = dbName.collection('orders')

const fetchOrder = async(req, res) => {
    try {
        const username = req.session.username
        const user = await user_collection.findOne({"username": username})

        const orders = await orders_collection.findOne({"user_id": user.user_id})
        const { user_id, _id, ...cleanedOrders } = orders;

        res.send({"succcess": true, "orders": cleanedOrders.orders})
    } catch(err) {
        res.send({"success": false, "message": err})
    }
}

// ================================================== Position ==================================================
const position_collection = dbName.collection('positions')

const fetchPosition = async(req, res) => {
    try {
        const username = req.session.username
        const user = await user_collection.findOne({"username": username})

        const positions = await position_collection.findOne({"user_id": user.user_id})
        const { user_id, _id, ...cleanedPositions } = positions

        res.send({"succcess": true, "positions": cleanedPositions.positions})
    } catch(err) {
        res.send({"success": false, "message": err})
    }
}

// ================================================== Commission ==================================================
const commission_collection = dbName.collection('orders')

const fetchCommission = async(req, res) => {
    try {
        const username = req.session.username
        const user = await user_collection.findOne({"username": username})

        const commissions = await commission_collection.find({"user_id": user.user_id, "orders.status_payment": false}).toArray();

        // Sum the commission from orders where status_payment is false
        const totalCommission = commissions.reduce((sum, commission) => {
            return sum + commission.orders.filter(order => !order.status_payment).reduce((orderSum, order) => orderSum + order.commission, 0);
        }, 0);

        res.send({"success": true, "totalCommission": totalCommission});
    } catch(err) {
        res.send({"success": false, "message": err})
    }
}

const adminCommission_collection = dbName.collection('admin_commission')

const uploadPayment = async (req, res) => {
    try {
        const username = req.session.username;
        const user = await user_collection.findOne({ "username": username });

        const { transImage, paidDate } = req.body;

        if (!transImage) {
            return res.status(400).json({ "success": false, "message": "No transcript image provided" });
        }

        // Handle the File object
        const base64Data = transImage.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Rename the file using user_id and save it to a specified folder
        const newFileName = `${user.user_id}_${Date.now()}_transcriptImage.png`;
        const filePath = path.join(__dirname, '..', '..', '..', 'public', 'img', 'commission', newFileName);

        await fs.writeFile(filePath, buffer);

        // Insert a new document into admin_commission collection
        await adminCommission_collection.insertOne({
            "user_id": user.user_id,
            "paid_date": paidDate,
            "transcript_image": TRANS_URL + newFileName,
            "payment_status": "checking"
        });

        res.json({ "success": true, "message": "Payment uploaded successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ "success": false, "message": "An error occurred" });
    }
};

export { fetchOrder, fetchPosition, fetchCommission, uploadPayment }