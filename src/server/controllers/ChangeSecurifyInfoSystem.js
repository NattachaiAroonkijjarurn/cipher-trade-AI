import { User } from "../mongooseModels/User.js";

// ============================================= Change Email =============================================
const changeEmail = async (req, res) => {
    try {

        const saveData = async() => {
            user.email = newEmail;
            user.isEmailVerified = false;
            await user.save();
        }

        const newEmail = req.body.newEmail;
        const username = req.session.username;
        const user = await User.findOne({ username });

        await saveData()

        // Fetch the updated user after saving
        const updatedUser = await User.findOne({ username });

        res.status(200).json({ message: 'Email changed successfully', user: updatedUser });
    } catch (err) {
        console.error("Error changing email:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


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

export { changeEmail, changePhoneNumber, changePassword, twoFactor };
