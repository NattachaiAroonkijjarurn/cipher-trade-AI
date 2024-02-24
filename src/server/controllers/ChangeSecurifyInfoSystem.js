import bcrypt from 'bcrypt';
import { User } from "../mongooseModels/User.js";
import nodemailer from 'nodemailer'

// ============================================= Change Email =============================================
const changeEmail = async (req, res) => {
    try {

        const newEmail = req.body.newEmail;
        req.session.newEmail = newEmail
        await sendCodeToNewEmail(req, res)

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
        let sessionCode = req.session.code;

        // Generate a new code if it doesn't exist
        if (!sessionCode) {
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
            subject: 'Verification Code for Change Email',
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
            user.email = req.session.newEmail;
            await user.save();
        }

        const username = req.session.username;
        const user = await User.findOne({ username });

        if(req.body.code === req.session.code) {
            await saveData()
            delete req.session.newEmail
            delete req.session.code
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

        // Remove non-digit characters and format as XXX-XXX-XXXX
        const cleanedPhoneNumber = newPhoneNumber.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

        const username = req.session.username
        const user = await User.findOne({ username });

        req.session.newPhone = cleanedPhoneNumber; // Use the cleaned phone number
        req.session.userEmail = user.email

        await sendCodeforNewPhone(req, res)
        
    } catch (err) {
        console.error("Error changing phone number:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const sendCodeforNewPhone = async(req, res) => {
    try {
        // Check if a verification code is already stored in the session
        let sessionCode = req.session.code;

        // Generate a new code if it doesn't exist
        if (!sessionCode) {
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
            subject: 'Verification Code for Change Phone Number',
            text: `Your verification code is: ${sessionCode}`,
        });

        res.send({ success: true, message: 'Verification code sent successfully' });

    } catch(err) {
        console.log(err)
    }
}

const verifyCodeForNewPhone = async(req, res) => {
    try {

        const saveData = async() => {
            user.phoneNumber = req.session.newPhone;
            await user.save();
        }

        const username = req.session.username;
        const user = await User.findOne({ username });

        if(req.body.code === req.session.code) {
            await saveData()
            delete req.session.newPhone
            delete req.session.userEmail
            delete req.session.code
            return res.send({ success: true, message: 'Phone Number Changed Successfully' });
        }
        else {
            return res.send({ success: false, message: 'Phone Number Changing Failed' });
        }

    } catch(err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
}

// =========================================== Change Password ============================================
const changePassword = async (req, res) => {
    try {
        const { newPassword, currentPassword } = req.body;

        const username = req.session.username
        const user = await User.findOne({ username });

        // Check if the currentPassword matches the password in the database
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        req.session.newPassword = newPassword;
        req.session.userEmail = user.email;

        await sendCodeforNewPassword(req, res);

    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const sendCodeforNewPassword = async(req, res) => {
    try {
        // Check if a verification code is already stored in the session
        let sessionCode = req.session.code;

        // Generate a new code if it doesn't exist
        if (!sessionCode) {
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
            subject: 'Verification Code for Change Password',
            text: `Your verification code is: ${sessionCode}`,
        });

        res.send({ success: true, message: 'Verification code sent successfully' });

    } catch(err) {
        console.log(err)
    }
}

const verifyCodeForNewPassword = async(req, res) => {
    try {
        const { newPassword } = req.session;

        if (!newPassword) {
            return res.status(400).json({ success: false, message: 'No new password found in the session' });
        }

        const saveData = async() => {
            // Hash the new password before saving it to the database
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
        }

        const username = req.session.username;
        const user = await User.findOne({ username });

        if(req.body.code === req.session.code) {
            await saveData()
            delete req.session.newPassword
            delete req.session.userEmail
            delete req.session.code
            return res.send({ success: true, message: 'Password Changed Successfully' });
        }
        else {
            return res.send({ success: false, message: 'Password Changing Failed' });
        }

    } catch(err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
}

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
         changePhoneNumber, sendCodeforNewPhone, verifyCodeForNewPhone, 
         changePassword, sendCodeforNewPassword, verifyCodeForNewPassword,
         twoFactor };

