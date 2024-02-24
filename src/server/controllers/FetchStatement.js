import { client } from "../db.js"

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

export { fetchOrder, fetchPosition }