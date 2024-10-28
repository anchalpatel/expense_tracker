const bcrypt = require("bcrypt");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
    const { firstName, lastName, email} = req.body;
    const userId = req.user.id; 

    try {
        // Check if user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user data
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
      
        // Save updated user
        await user.save();

        // Construct the response data with the updated user details
        const responseData = {
            success: true,
            message: "User profile updated successfully",
            updatedUserDetails: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
               
            }
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteAccount = async (req, res) => {
	try {
		
		//console.log("Printing ID: ", req.user.id);
		const id = req.user.id;
		
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// Now Delete User
		await User.findByIdAndDelete({ _id: id });
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User Cannot be deleted successfully" });
	}
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;

        // Upload image to cloudinary
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        // Update user's profile image in the database
        //console.log(image.secure_url)
        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            { profileImage: image.secure_url }, // Update profile image field
            { new: true }
        );

        res.json({
            success: true,
            message: `Profile Image Updated successfully`,
            data: updatedProfile,
        });
    } catch (error) {
        console.error("Error updating profile image:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.exec();
		//console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({ success: false, message: "Incorrect old password" });
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Return success response
		return res.status(200).json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({ success: false, message: "Failed to update password", error: error.message });
	}
};

exports.getProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;

        // Retrieve user's profile image URL from the database
        const user = await User.findById(userId);
        const profileImageUrl = user.profileImage;

        // Return the profile image URL
        res.json({
            success: true,
            data: {
                profileImageUrl: profileImageUrl
            }
        });
    } catch (error) {
        console.error("Error retrieving profile image:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
