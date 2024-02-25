import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

// Database
import {connectDB} from './db.js';

// API Routes
import router from './routes/api.js';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Config to read .env file
dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT;
const salty = process.env.SALT;

const app = express()

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http//localhost:3000/');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: salty,
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false },
}));

// Logging the contents of the 'routes' directory
const routesDirectory = fileURLToPath(import.meta.url);
try {
  readdirSync(dirname(routesDirectory) + '/routes').map((r) => {
    app.use('/api', router);
  });
} catch (error) {
  console.error('Error reading route directory:', error);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
