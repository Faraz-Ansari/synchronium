import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal Server Error during finding user profile",
        });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUser = req.user._id;

        // get users who are followed by me
        const usersFollowedByMe = await User.findById(currentUser).select(
            "following"
        );

        // Perform an aggregation on the User collection
        const users = await User.aggregate([
            {
                // Match stage: filter out the document with the _id equal to the user variable
                $match: {
                    _id: {
                        $ne: currentUser, // Exclude the user with this _id
                    },
                },
            },
            {
                // Sample stage: randomly select 10 documents from the filtered results
                $sample: { size: 10 },
            },
        ]);
        // Filter the users array to exclude users who are already followed by the current user
        const filterUsers = users.filter(
            (user) => !usersFollowedByMe.following.includes(user._id)
        );

        const suggestedUsers = filterUsers.slice(0, 4);

        // Remove password field from suggested users
        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal Server Error during finding suggested users",
        });
    }
};

export const toggleFollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userToFollow = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user.id) {
            return res
                .status(400)
                .json({ message: "You cannot follow/unfollow yourself" });
        }

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);
        // if already following, unfollow otherwise follow
        if (isFollowing) {
            // remove current user from followers of userToFollow
            await User.findByIdAndUpdate(userToFollow.id, {
                $pull: { followers: currentUser._id },
            });

            // remove userToFollow from following of current user
            await User.findByIdAndUpdate(currentUser._id, {
                $pull: { following: id },
            });

            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // add current user to followers of userToFollow
            await User.findByIdAndUpdate(userToFollow.id, {
                $push: { followers: currentUser._id },
            });

            // add userToFollow to following of current user
            await User.findByIdAndUpdate(currentUser._id, {
                $push: { following: id },
            });

            const notification = await Notification.create({
                type: "follow",
                from: currentUser._id,
                to: userToFollow.id,
            });

            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Internal Server Error during following/unfollowing user",
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const {
            username,
            email,
            currentPassword,
            newPassword,
            link,
            bio,
            fullname,
        } = req.body;

        let { profileImg, coverImg } = req.body;

        const currentUserId = req.user._id;

        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentPassword && !newPassword) {
            return res.status(400).json({
                message: "Please provide both current and new password",
            });
        }

        const isPasswordMatch = await bcryptjs.compare(
            currentPassword,
            currentUser.password
        );
        if (!isPasswordMatch) {
            return res
                .status(400)
                .json({ message: "Current password is incorrect" });
        }
        if (newPassword.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }

        currentUser.password = await bcryptjs.hash(newPassword, 10);

        if (profileImg) {
            if (currentUser.profileImg) {
                await cloudinary.uploader.destroy(
                    currentUser.profileImg.split("/").pop().split(".")[0]
                );
            }
            const response = await cloudinary.uploader.upload(profileImg);
            profileImg = response.secure_url;
        }

        if (coverImg) {
            if (currentUser.coverImg) {
                await cloudinary.uploader.destroy(
                    currentUser.coverImg.split("/").pop().split(".")[0]
                );
            }
            const response = await cloudinary.uploader.upload(coverImg);
            coverImg = response.secure_url;
        }

        currentUser.username = username || currentUser.username;
        currentUser.email = email || currentUser.email;
        currentUser.fullname = fullname || currentUser.fullname;
        currentUser.link = link || currentUser.link;
        currentUser.bio = bio || currentUser.bio;
        currentUser.profileImg = profileImg || currentUser.profileImg;
        currentUser.coverImg = coverImg || currentUser.coverImg;

        const updatedUser = await User.findByIdAndUpdate(
            currentUserId,
            currentUser,
            {
                new: true,
            }
        );

        updateUserProfile.password = null;
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal Server Error during updating user profile",
        });
    }
};
