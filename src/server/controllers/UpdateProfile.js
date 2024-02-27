import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { client } from "../db.js";
import fs from "fs/promises";
import path from "path";
import bcrypt from 'bcrypt';
import { PROFILE_URL } from '../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbName = client.db('CipherTrade');
const user_collection = dbName.collection('account_users');

const updateProfile = async (req, res) => {
    try {
        const username = req.session.username;
        const user = await user_collection.findOne({ "username": username });

        const { editedUserName, profileImage } = req.body;

        // Check if a new image is provided
        if (profileImage !== "null" && profileImage !== null) {
            // Decode base64 image data
            const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');

            // Rename the file using user_id and save it to a specified folder
            const newFileName = `${user.user_id}_${Date.now()}_profileImage.png`; // Adjust the file extension
            const filePath = path.join(__dirname, '..', '..', '..', 'public', 'img', 'profile-images', newFileName);

            await fs.writeFile(filePath, buffer);

            // Remove the old image file if it exists
            if (user.profileImage_path) {
                const oldFileName = path.basename(user.profileImage_path);
                const oldFilePath = path.join(__dirname, '..', '..', '..', 'public', 'img', 'profile-images', oldFileName);
                await fs.unlink(oldFilePath);
            }

            // Update the user document with the new profileImage_path
            await user_collection.updateOne({ "username": username }, { $set: { "profileImage_path": PROFILE_URL + newFileName } });
        }

        // Update other user information
        await updateUsername(username, editedUserName, req)

        const updatedUser = await user_collection.findOne({"username": editedUserName})
        const {_id, ...cleanedUserData} = updatedUser

        res.send({ "success": true, "user": cleanedUserData });
    } catch (err) {
        res.status(500).send({ "success": false, "error": err });
    }
};

const updateUsername = async (username, editedUserName, req) => {
    try {

        // Check if username and editedUserName are provided
        if (!username || !editedUserName) {
            throw new Error("Both username and editedUserName are required.");
        }

        if(username !== editedUserName) {
            // Check if the username exists in the collection
            const existingUser = await user_collection.findOne({ "username": editedUserName });
            if (existingUser) {
                throw new Error(`The Edited Username is Used.`);
            }
        }

        // Update the user information
        await user_collection.updateOne({ "username": username }, { $set: { "username": editedUserName } });

        // Optionally, you can return the updated user data
        const updatedUser = await user_collection.findOne({ "username": editedUserName });

        req.session.username = updatedUser.username

        return

    } catch (err) {
        console.error("Error in updateUsername:", err);
        throw err; // Re-throw the error to be caught by the calling function
    }
};

const deleteAccount = async(req, res) => {
    try {

        const { confirmPass } = req.body

        const username = req.session.username
        const user = await user_collection.findOne({"username": username})

        // Check if the currentPassword matches the password in the database
        const isPasswordValid = await bcrypt.compare(confirmPass, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Password is incorrect' });
        }

        // Delete the user from the database
        await user_collection.deleteOne({ "username": username });

        // Optionally, you may want to clear the session or perform other cleanup steps
        await req.session.destroy((err) => {
            if (err) {
              console.error('Error destroying session:', err);
            } else {
        
              res.clearCookie('sessionID', { httpOnly: true, sameSite: 'strict' });
              res.send({ "success": true, "message": 'Account deleted successfully' });
      
            }
          });

    } catch(err) {
        res.status(500).send(err)
    }
}

export { updateProfile, deleteAccount };
