import express from 'express'

// Controllers Login System
import { signUp, sendSignUpCode, verifySignUpCode, signIn, signOut, authenUser } from '../controllers/LoginSystem.js' 

// Controllers for Verification
import { reSendVerificationCode, verifyCode } from '../controllers/VerifySystem.js' 

// Controllers for Change System
import { changeEmail, sendCodeToNewEmail, verifyCodeForNewEmail, 
         changePhoneNumber, sendCodeforNewPhone, verifyCodeForNewPhone,
         changePassword, sendCodeforNewPassword, verifyCodeForNewPassword,
         twoFactor
         } 
         from '../controllers/ChangeSecurifyInfoSystem.js'

// Controllers for Fetch Statement
import { fetchOrder, fetchPosition, fetchCommission, uploadPayment } from '../controllers/FetchStatement.js'

// Controllers for Fetch User Data
import { getUserData } from '../controllers/FetchUserData.js'

// Controllers for Update User Profile
import { updateProfile, deleteAccount } from '../controllers/UpdateProfile.js'

// Models
import { getModel } from '../controllers/GetModel.js'

//AccountMT
import { getAccountMT, sendAccountMT, changeStatusBot, editAccountMT, deleteAccountMT, insertBotInAccountMT, deleteBotInAccountMT, updateDetailAccount } from '../controllers/AccountMt.js'

const router = express.Router()

// ============================================== Login System ==============================================

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
router.get('/logout', signOut)

// @ENDPOINT : http//localhost:5000/api/auth-user
// @METHOD : GET
// Authenticate user is logged in
router.get('/auth-user', authenUser)

// ============================================== Verification ==============================================

// @ENDPOINT : http://localhost:5000/api/resend-vc
// @METHOD : POST
// Send Verification Code
router.get('/resend-vc', reSendVerificationCode)

// @ENDPOINT : http://localhost:5000/api/verify-code
// @METHOD : POST
// Send Verification Code
router.post('/verify-code', verifyCode)

// ============================================= Change System ==============================================


// 1 Change Email ===========================================================================================

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

// 2 Change Phone Number ====================================================================================

// @ENDPOINT : http//localhost:5000/api/change-phone
// @METHOD : POST
// Change Phone Number
router.post('/change-phone', changePhoneNumber)

// @ENDPOINT : http//localhost:5000/api/change-phone
// @METHOD : POST
// Send Code Change Phone Number
router.post('/send-ccphone', sendCodeforNewPhone)

// @ENDPOINT : http//localhost:5000/api/change-phone
// @METHOD : POST
// Verify Code Change Phone Number
router.post('/verify-ccphone', verifyCodeForNewPhone)

// 3 Change Password ========================================================================================

// @ENDPOINT : http//localhost:5000/api/change-pass
// @METHOD : POST
// Change Password
router.post('/change-pass', changePassword)

// @ENDPOINT : http//localhost:5000/api/change-phone
// @METHOD : POST
// Send Code Change Password
router.post('/send-ccpass', sendCodeforNewPassword)

// @ENDPOINT : http//localhost:5000/api/change-phone
// @METHOD : POST
// Verify Code Change Phone Number
router.post('/verify-ccpass', verifyCodeForNewPassword)

// 4 Two Factor =============================================================================================

// @ENDPOINT : http//localhost:5000/api/two-factor
// @METHOD : POST
// 2-Factor Authentication
router.post('/two-factor', twoFactor)

// =========================================== AI model System ==============================================
router.get('/model', getModel)

// ============================================ get Account MT ==============================================
router.get('/account-mt', getAccountMT)

// ============================================ send Account MT =============================================
router.post('/send-account-mt', sendAccountMT)

// ========================================== bot in Account MT =============================================
router.post('/change-status-bot', changeStatusBot)

// ========================================== edit in Account MT ============================================
router.post('/edit-account-mt', editAccountMT)

// ========================================= delete in Account MT ===========================================
router.post('/delete-account-mt', deleteAccountMT)

// ======================================= insert bot in Account MT =========================================
router.post('/insert-bot-account-mt', insertBotInAccountMT)

// ======================================= delete bot in Account MT =========================================
router.post('/delete-bot-account-mt', deleteBotInAccountMT)

// ======================================= update detail account MT =========================================
router.post('/update-detail-account-mt', updateDetailAccount)

// ============================================ Fetch Statement =============================================

// @ENDPOINT : http//localhost:5000/api/fetch-order
// @METHOD : GET
// Get Order Data
router.get('/fetch-order', fetchOrder)

// @ENDPOINT : http//localhost:5000/api/fetch-position
// @METHOD : GET
// Get Position Data
router.get('/fetch-position', fetchPosition)


// @ENDPOINT : http//localhost:5000/api/fetch-commission
// @METHOD : GET
// Get Commission Data
router.get('/fetch-commission', fetchCommission)

// @ENDPOINT : http//localhost:5000/api/upload-payment
// @METHOD : POST
// Upload Transcript Image
router.post('/upload-payment', uploadPayment)

// ============================================ Fetch User Data =============================================

// @ENDPOINT : http//localhost:5000/api/fetch-user-data
// @METHOD : GET
// Get User Data
router.get('/fetch-user-data', getUserData)

// ========================================== Update User Profile ===========================================

// @ENDPOINT : http//localhost:5000/api/update-profile
// @METHOD : POST
// Update User Profile
router.post('/update-profile', updateProfile)

// @ENDPOINT : http//localhost:5000/api/delete-acc
// @METHOD : GET
// Delete Account
router.post('/delete-acc', deleteAccount)

// ==========================================================================================================

export default router;