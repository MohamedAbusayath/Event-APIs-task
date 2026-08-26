const User = require("../Modules/User");

const updateLocation = async (req, res) => {
    try {
        const userID = req.user.userId;

        const { location } = req.body;

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.location = location;

        await user.save();

        return res.status(200).json({
            message: "Location updated successfully",
            data: user.location
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    updateLocation
};