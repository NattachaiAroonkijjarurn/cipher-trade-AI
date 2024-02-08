import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb+srv://bottrade:EpRdxHol8LswWCVR@bottrade.ovsinh5.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create User schema
const User = mongoose.model('account_user', {
  username: String,
  password: String,
});

const app = express();
const PORT = process.env.PORT || 5000;
const salty = "Cipher"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: salty, resave: true, saveUninitialized: true }));

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = new User({
    username,
    password: hashedPassword,
  });

  // Save the user to the database
  user.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering user');
    } else {
      res.send('User registered successfully');
    }
  });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  // Check if the user exists
  if (!user) {
    res.status(401).send('Invalid username or password');
    return;
  }

  // Compare the entered password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    // Set a session variable to indicate the user is logged in
    req.session.loggedIn = true;
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Protected endpoint - requires authentication
app.get('/dashboard', (req, res) => {
  if (req.session.loggedIn) {
    res.send('Welcome to the dashboard');
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});