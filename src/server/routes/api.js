import express from 'express'

// Controllers Login System
import { signUp, signIn, signOut, authenUser, getEmail } from '../controllers/LoginSystem.js' 

const router = express.Router()

// ========================================= Login System =========================================

// @ENDPOINT : http//localhost:5000/api/register
// @METHOD : POST
// Registration endpoint
router.post('/register', signUp)

// @ENDPOINT : http//localhost:5000/api/login
// @METHOD : POST
// Login endpoint
router.post('/login', signIn)

// @ENDPOINT : http//localhost:5000/api/logout
// @METHOD : POST
// Logout endpoint
router.post('/logout', signOut)

// @ENDPOINT : http//localhost:5000/api/auth-user
// @METHOD : GET
// Authenticate user is logged in
router.get('/get-email', getEmail)

// ===============================================================================================

export default router;