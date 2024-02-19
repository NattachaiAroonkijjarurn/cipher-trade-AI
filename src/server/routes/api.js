import express from 'express'

// Controllers Login System
import { signUp, sendSignUpCode, verifySignUpCode, signIn, signOut, authenUser } from '../controllers/LoginSystem.js' 

// Controllers for Verification
import { reSendVerificationCode, verifyCode } from '../controllers/VerifySystem.js' 

// Controllers for Change System
import { changeEmail, sendCodeToNewEmail, verifyCodeForNewEmail, 
         changePhoneNumber, 
         changePassword, 
         twoFactor } 
         from '../controllers/ChangeSecurifyInfoSystem.js'

// Models
import { getModel } from '../Models/model.js'

//AccountMT
import { getAccountMT } from '../mt/accountMt.js'

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

// @ENDPOINT : http://localhost:5000/api/resend-vc
// @METHOD : POST
// Send Verification Code
router.get('/resend-vc', reSendVerificationCode)

// @ENDPOINT : http://localhost:5000/api/verify-code
// @METHOD : POST
// Send Verification Code
router.post('/verify-code', verifyCode)

// ======================================= Change System =========================================


// 1 Change Email ================================================================================

// @ENDPOINT : http//localhost:5000/api/change-email
// @METHOD : POST
// Change Email
router.post('/change-email', changeEmail)

// @ENDPOINT : http//localhost:5000/api/send-cce
// @METHOD : POST
// Send Code Change Email
router.post('/send-cce', sendCodeToNewEmail)

// @ENDPOINT : http//localhost:5000/api/verify-cce
// @METHOD : POST
// Verify Code Change Email
router.post('/verify-cce', verifyCodeForNewEmail)

// 2 Change Phone Number =========================================================================

// @ENDPOINT : http//localhost:5000/api/change-phone
// @METHOD : POST
// Change Phone Number
router.post('/change-phone', changePhoneNumber)

// 3 Change Password =============================================================================

// @ENDPOINT : http//localhost:5000/api/change-pass
// @METHOD : POST
// Change Password
router.post('/change-pass', changePassword)

// 4 Two Factor ==================================================================================

// @ENDPOINT : http//localhost:5000/api/two-factor
// @METHOD : POST
// 2-Factor Authentication
router.post('/two-factor', twoFactor)

// ======================================= AI model System =========================================
router.get('/model', getModel)

// ======================================= get Account MT =========================================
router.get('/account-mt', getAccountMT)


export default router;