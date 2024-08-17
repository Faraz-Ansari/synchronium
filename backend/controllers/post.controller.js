export const createPost = async (req, res) => {
    res.status(200).json({ message: "Post created successfully" });
};

export const deletePost = async (req, res) => {
    res.status(200).json({ message: "Post deleted successfully" });
};

export const toggleLike = async (req, res) => {
    res.status(200).json({ message: "Like toggled successfully" });
};

export const commentOnPost = async (req, res) => {
    res.status(200).json({ message: "Comment added successfully" });
};
