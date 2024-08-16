import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

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
    res.status(200).json({ message: "Suggested users" });
};

export const followUnfollowUser = async (req, res) => {
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

export const updateProfile = async (req, res) => {
    res.status(200).json({ message: "Update profile" });
};
