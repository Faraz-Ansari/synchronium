import Notification from "../models/notification.model.js";

export const fetchNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all notifications for the specified user and populate the 'from' field
        // with the 'username' and 'profileImg' fields from the related user document.
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from", // The field to populate
            select: "username profileImg", // The fields to select from the related document
        });

        if (!notifications) {
            return res.status(404).json({ message: "No notifications found" });
        }

        // Update all notifications for the specified user to mark them as read
        await Notification.updateMany(
            { to: userId }, // Filter: notifications for the specified user
            { $set: { read: true } } // Update: set the 'read' field to true
        );
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during fetching all notifications",
        });
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete all notifications for the specified user
        await Notification.deleteMany({ to: userId });

        res.status(200).json({
            message: "All notifications deleted successfully",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during deleting all notifications",
        });
    }
};
