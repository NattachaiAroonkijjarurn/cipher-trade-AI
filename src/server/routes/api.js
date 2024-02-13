import express from 'express'

// Controllers Login System
import { signUp, sendSignUpCode, verifySignUpCode, signIn, signOut, authenUser } from '../controllers/LoginSystem.js' 

// Controllers for Verification
import { emailVerify, reSendVerificationCode, verifyCode } from '../controllers/VerifySystem.js' 

// Controllers for Change System
import { changeEmail, changePhoneNumber, changePassword, twoFactor } from '../controllers/ChangeSecurifyInfoSystem.js'

// Models
import { getModel } from '../Models/model.js'

const router = express.Router()

// ========================================= Login System =========================================

// @ENDPOINT : http//localhost:5000/api/register
// @METHOD : POST
// Registration endpoint
router.post('/register', signUp)

// @ENDPOINT : http//localhost:5000/api/send-suc
// @METHOD : POST
// Send Sign Up Code
router.post('/send-suc', sendSignUpCode)

// @ENDPOINT : http//localhost:5000/api/verify-suc
// @METHOD : POST
// Verify Sign Up Code
router.post('/verify-suc', verifySignUpCode)

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

// @ENDPOINT : http://localhost:5000/api/resend-vc
// @METHOD : POST
// Send Verification Code
router.get('/resend-vc', reSendVerificationCode)

// @ENDPOINT : http://localhost:5000/api/verify-code
// @METHOD : POST
// Send Verification Code
router.post('/verify-code', verifyCode)

// ======================================= Change System =========================================

// @ENDPOINT : http//localhost:5000/api/change-email
// @METHOD : POST
// Change Email
router.post('/change-email', changeEmail)

// @ENDPOINT : http//localhost:5000/api/change-phone
// @METHOD : POST
// Change Phone Number
router.post('/change-phone', changePhoneNumber)

// @ENDPOINT : http//localhost:5000/api/change-pass
// @METHOD : POST
// Change Password
router.post('/change-pass', changePassword)

// @ENDPOINT : http//localhost:5000/api/two-factor
// @METHOD : POST
// 2-Factor Authentication
router.post('/two-factor', twoFactor)

// ======================================= AI model System =========================================
router.get('/model', getModel)


export default router;