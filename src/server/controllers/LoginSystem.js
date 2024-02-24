import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import { User } from "../mongooseModels/User.js";
import nodemailer from 'nodemailer'

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

            req.session.signupUsername = username
            req.session.signupEmail = email
            req.session.signupPassword = hashedPassword

            await sendSignUpCode(req, res);
        }

        
    }catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const generateVerificationCode = () => {
    // Generate a random 6-character string with both numbers and alphabets
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let verificationCode = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters.charAt(randomIndex);
    }

    return verificationCode;
};

const sendSignUpCode = async (req, res) => {
    try {
        // Check if a verification code is already stored in the session
        let sessionCode
        if(req.session.code) {
            sessionCode = req.session.code
        }
        else {
            sessionCode = generateVerificationCode();
            req.session.code = sessionCode;
        }

        // Configure nodemailer with your email server details
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ciphertradeai@gmail.com',
                pass: 'tdxt vedw hhgg xsap',
            },
        });

        // Send email
        await transporter.sendMail({
            from: 'ciphertradeai@gmail.com',
            to: 'oilnakab0@gmail.com',
            subject: 'Verification Code for Sign Up',
            text: `Your verification code is: ${sessionCode}`,
        });

        res.send({ success: true, message: 'Verification code sent successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Server Error' });
    }
};

const verifySignUpCode = async (req, res) => {
    try {

        const sessionCode = req.session.code;

        if (sessionCode === req.body.verifyCode) {

            const uri = process.env.DATABASE;
            const client = new MongoClient(uri);

            async function countDocumentsInCollection() {
                try {
                    await client.connect();

                    const database = client.db('CipherTrade');
                    const collection = database.collection('account_users');

                    const signupUsername = req.session.signupUsername
                    const signupEmail = req.session.signupEmail
                    const signupPassword = req.session.signupPassword

                    // Count all documents in the collection
                    const id = await collection.countDocuments({});
                    const newUser = new User({ user_id: `${id}`, username: signupUsername, email: signupEmail, password: signupPassword, role:"user", isTwoFactor: false, phoneNumber: "-", profileImage_path: "" });
                    await newUser.save();
                } finally {
                    // Optionally, you may clear the verification code from the session
                    delete req.session.code;
                    delete req.session.signupUsername
                    delete req.session.signupEmail
                    delete req.session.signupPassword
                    await client.close();
                }
            }

            countDocumentsInCollection()

            return res.send({ success: true, message: 'User Sign Up Successfully' });
        } else {
            return res.send({ success: false, message: 'Invalid verification code' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server Error' });
    }
};

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
            req.session.user_id = user.user_id

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
const signOut = async (req, res) => {

    await req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Internal Server Error');
      } else {
  
        res.clearCookie('sessionID', { httpOnly: true, sameSite: 'strict' });
        res.send('Logout successful');

      }
    });

  };

// ========================================= Authentication ===========================================
const authenUser = async(req, res) => {
    try{
        if (req.session.isLoggedIn) {
            res.send({authorized: true, user_id : req.session.user_id, username : req.session.username})
        } 
        else {
            res.send({authorized: false})
        }

    }catch(err) {
        res.status(500).send("Authentication Error")
    }

}

export { signUp, sendSignUpCode, verifySignUpCode, signIn, signOut, authenUser }