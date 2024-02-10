import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import { User } from "../mongooseModels/User.js";

// ============================================= Register =============================================
const signUp = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        // Check if the username already exists
        if (existingUser) {
            return res.status(400).send('Username already exists. Please choose a different username.');
        }

        // Check if the email already exists
        else if (existingEmail) {
            return res.status(400).send('Email already exists. Please use a other email.');
        }

        // All Pass
        else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const uri = process.env.DATABASE;
            const client = new MongoClient(uri);

            async function countDocumentsInCollection() {
                try {
                    await client.connect();

                    const database = client.db('CipherTrade');
                    const collection = database.collection('account_users');

                    // Count all documents in the collection
                    const id = await collection.countDocuments({});
                    const newUser = new User({ user_id: `${id}`, username, email, password: hashedPassword, role:"user" });
                    await newUser.save();
                } finally {
                    await client.close();
                }
            }

            countDocumentsInCollection()

            res.send('User registered successfully');
        }

        
    }catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// ============================================== Login ===============================================
const signIn = async(req, res) => {

    try{

        const { username, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ username });

        // Check if the user exists and the password is correct
        if (user && await bcrypt.compare(password, user.password)) {
            // Set a session variable to mark the user as logged in
            req.session.isLoggedIn = true;
            req.session.username = user.username;

            // Set a cookie to store the session ID
            res.cookie('sessionID', req.sessionID, { httpOnly: true });
            res.status(200).send('Login Success')
        } 
        else {
            res.status(401).send('Invalid username or password');
        }

    }catch(err) {

        res.status(500).send("Server Error")

    }
}

// ============================================== Logout ==============================================
const signOut = async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Internal Server Error');
        } 
        else {
          res.clearCookie('sessionID');
          res.send('Logout successful');
        }
    });
}

// ========================================= Authentication ===========================================
const authenUser = async(req, res) => {

    try{
        if (req.session.isLoggedIn) {
            res.status(200).send('Authorized')
        } 
        else {
            res.status(401).send('Unauthorized. Please log in.');
        }

    }catch(err) {
        res.status(500).send("Authentication Error")
    }

}

export {signUp, signIn, signOut, authenUser }