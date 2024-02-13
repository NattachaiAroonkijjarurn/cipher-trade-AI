import nodemailer from 'nodemailer';
import { User } from '../mongooseModels/User.js';

// ============================================= Email Verification =============================================

const emailVerify = async (req, res) => {
    try {
        const username = req.session.username;
        const user = await User.findOne({ username });

        if (user) {
            if (user.isEmailVerified) {
                return res.send({ emailVerify: true });
            } else {
                return res.send({ emailVerify: false });
            }
        } else {
            return res.status(404).send({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server Error' });
    }
};

// ======================================== Generate Verification Code ==========================================

const generateVerificationCode = () => {
    // Generate a random 6-character string with both numbers and alphabets
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let verificationCode = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters.charAt(randomIndex);
    }

    return verificationCode;
};

// ========================================== Send Verification Code ============================================

const reSendVerificationCode = async (req, res) => {
    try {
        // Check if a verification code is already stored in the session
        const sessionCode = req.session.code || generateVerificationCode();
        req.session.code = sessionCode;

        // Configure nodemailer with your email server details
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ciphertradeai@gmail.com',
                pass: 'tdxt vedw hhgg xsap',
            },
        });

        // Send email
        await transporter.sendMail({
            from: 'ciphertradeai@gmail.com',
            to: 'oilnakab0@gmail.com',
            subject: 'Email Verification',
            text: `Your verification code is: ${sessionCode}`,
        });

        res.send({ success: true, message: 'Verification code sent successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Server Error' });
    }
};

// ====================================== Verify Email Verification Code ========================================

const verifyCode = async (req, res) => {
    try {
        const username = req.session.username;
        const user = await User.findOne({ username });

        const sessionCode = req.session.code;

        if (sessionCode === req.body.verifyCode) {
            user.isEmailVerified = true;
            await user.save(); // Save the updated user document

            // Optionally, you may clear the verification code from the session
            delete req.session.code;

            return res.send({ success: true, message: 'Email successfully verified' });
        } else {
            return res.send({ success: false, message: 'Invalid verification code' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server Error' });
    }
};

export { emailVerify, reSendVerificationCode, verifyCode };
