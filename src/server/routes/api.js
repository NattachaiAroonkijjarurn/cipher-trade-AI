import express from 'express'

// Controllers Login System
import { signUp, signIn, signOut, authenUser } from '../controllers/LoginSystem.js' 

// Controllers for Verification
import { emailVerify } from '../controllers/VerifySystem.js' 

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
router.get('/auth-user', authenUser)

// ======================================== Verification =========================================

// @ENDPOINT : http//localhost:5000/api/email-verify
// @METHOD : GET
// Email Verification
router.get('/email-verify', emailVerify)

// ===============================================================================================

export default router;