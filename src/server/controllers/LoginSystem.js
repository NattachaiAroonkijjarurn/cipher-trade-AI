import mongoose from "mongoose";
import bcrypt from 'bcrypt';

// Create User schema
const User = mongoose.model('useraccounts', {
    username: String,
    password: String,
    role: String
  });

// ============================================= Register =============================================
const signUp = async(req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
        return res.status(400).send('Username already exists. Please choose a different username.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, role:"user" });
        await newUser.save();

        res.send('User registered successfully');
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
            req.session.email = user.username;

            // Set a cookie to store the session ID
            res.cookie('sessionID', req.sessionID, { httpOnly: true });

            res.send(req.session.email);
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
const authenUser = async(req, res, next) => {

    try{
        
        if (req.session.isLoggedIn) {
            return true
        } 
        else {
            res.status(401).send('Unauthorized. Please log in.');
        }

    }catch(err) {
        res.status(500).send("Authentication Error")
    }

}


const getEmail = async(req, res) => {
    try{
        if(authenUser)
            res.send("Email : " + req.session.email)
    }catch(err) {
        res.send(err)
    }
}

export {signUp, signIn, signOut, authenUser, getEmail}