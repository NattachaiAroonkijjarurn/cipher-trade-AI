import express from 'express'

// Controllers Login System
import { signUp, signIn } from '../controllers/LoginSystem.js' 

const router = express.Router()

// Registration endpoint
router.post('/register', signUp)


// Login endpoint
router.post('/login', signIn)

export default router;