import { isRouteErrorResponse } from "react-router-dom";
import { User } from "../mongooseModels/User.js";

// ============================================= Change Email =============================================
const changeEmail = async (req, res) => {
    try {

        const newEmail = req.body.newEmail;
        await sendCodeToNewEmail(req, res)

        res.status(200).json({ message: 'Email changed successfully'});
    } catch (err) {
        console.error("Error changing email:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

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

const sendCodeToNewEmail = async(req, res) => {
    try {
        // Check if a verification code is already stored in the session
        let sessionCode
        if(req.session.code) {
            sessionCode = req.session.code
        }
        else {
            sessionCode = generateVerificationCode();
            req.session.code = sessionCode;
        }

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
            subject: 'Verification Code for Sign Up',
            text: `Your verification code is: ${sessionCode}`,
        });

        res.send({ success: true, message: 'Verification code sent successfully' });

    } catch(err) {
        console.log(err)
    }
}

const verifyCodeForNewEmail = async(req, res) => {
    try {

        const saveData = async() => {
            user.email = newEmail;
            await user.save();
        }

        const username = req.session.username;
        const user = await User.findOne({ username });

        if(req.body.code === req.session.code) {
            await saveData()
            return res.send({ success: true, message: 'Email Changed Successfully' });
        }
        else {
            return res.send({ success: false, message: 'Email Changing Failed' });
        }

    } catch(err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
}


// ========================================= Change Phone Number ==========================================
const changePhoneNumber = async (req, res) => {
    try {
        const { newPhoneNumber } = req.body;
        const user = await User.findOneAndUpdate(
            { username: req.session.username },
            { phoneNumber: newPhoneNumber },
            { new: true }
        );
        res.status(200).json({ message: 'Phone number changed successfully', user });
    } catch (err) {
        console.error("Error changing phone number:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// =========================================== Change Password ============================================
const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await User.findOneAndUpdate(
            { username: req.session.username },
            { password: newPassword },
            { new: true }
        );
        res.status(200).json({ message: 'Password changed successfully', user });
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ======================================= 2-Factor Authentication ========================================
const twoFactor = async (req, res) => {
    try {
        // Add your implementation for enabling 2-factor authentication here
        res.status(200).json({ message: '2-Factor Authentication enabled successfully' });
    } catch (err) {
        console.error("Error enabling 2-Factor Authentication:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { changeEmail, sendCodeToNewEmail, verifyCodeForNewEmail, 
         changePhoneNumber, 
         changePassword, 
         twoFactor };

