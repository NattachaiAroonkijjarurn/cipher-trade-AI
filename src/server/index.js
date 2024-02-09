import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv'

// Database
import connectDB from './db.js'
import mongoose from 'mongoose';

// API Routes
import router from './routes/api.js';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Config to read .env file
dotenv.config();

// Connet to Database
connectDB;

// Create User schema
const User = mongoose.model('account_user', {
  username: String,
  password: String,
});

const PORT = process.env.PORT;
const salty = process.env.SALT

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: salty, resave: true, saveUninitialized: true }));

// Logging the contents of the 'routes' directory
const routesDirectory = fileURLToPath(import.meta.url);
try {
  readdirSync(dirname(routesDirectory) + '/routes').map((r) => {
    app.use('/api', router)
  })
} catch (error) {
  console.error('Error reading route directory:', error);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
