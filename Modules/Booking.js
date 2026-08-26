const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    status: {
        type: String,
        enum: ["GOING", "CANCELED"],
        default: "GOING"
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },

    canceledAt: {
        type: Date,
        default: null
    }},
    {
    timestamps: true
    }
);

module.exports=mongoose.model("Booking",bookingSchema);