import { User } from "../mongooseModels/User.js";

// ============================================= Email Verification =============================================

const emailVerify = async(req, res) => {
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
}

export { emailVerify }