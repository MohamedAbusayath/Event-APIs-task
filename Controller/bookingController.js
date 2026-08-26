const Booking = require("../Modules/Booking");
const Event = require("../Modules/Event");
const User = require("../Modules/User");
const joinEvent = async (req, res) => {

    try {
        const { eventId } = req.params;
        const userID = req.user.userId;

        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({
            message: "Event doesn't exist....."
        });

        if (event.status === "CANCELED") return res.status(400).json({
            message: "Can't join a canceled event"
        });
        const existingBooking = await Booking.findOne({
            userId: userID,
            eventId: eventId
        });
        if (existingBooking && existingBooking.status === "GOING") return res.status(400).json({
            message: "You already Booked this event...."
        });
        const existingEvent = await Booking.find({
            userId: userID,
            status: "GOING"
        }).populate("eventId");

        const overlap = await existingEvent.find((booking) => {
            const existing = booking.eventId;
            return (
                existing.startTime < event.endTime &&
                existing.endTime > event.startTime
            );
        });

        if (overlap) return res.status(400).json({
            message: "You already have another event during this time..."
        });

        const booking = await Booking.create({
            userId: userID,
            eventId: eventId,
            status: "GOING"
        });

        return res.status(201).json({
            message: "Event joined successfully",
            data: booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error...",
            error: error.message
        });
    }
};

const getMyEvent = async (req, res) => {
    try {
        const userID = req.user.userId;
        const { type } = req.query;
        const myEvent = await Booking.find({
            userId: userID,
            status: "GOING"
        }).populate("eventId");
        const now = new Date();
        let filterEvents;
        if (type === "past") {
            filterEvent = myEvent.filter(booking => booking.eventId.endTime < now);
        } else if (type === "current") {
            filteredEvents = myEvent.filter(
                booking =>
                    booking.eventId.startTime <= now &&
                    booking.eventId.endTime >= now
            );
        } else if (type === "future") {
            filteredEvents = myEvent.filter(
                booking => booking.eventId.startTime > now
            );
        } else {

            return res.status(400).json({
                message: "All Your Event....",
                data:myEvent
            });
        }
        filteredEvents.sort(
            (a, b) =>
                b.eventId.startTime - a.eventId.startTime
        );

        return res.status(200).json({
            message: "Your events",
            data: filteredEvents
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error....",
            error: error.message
        })
    }
}

const getNearbyEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user || !user.location) {
            return res.status(404).json({
                message: "User location is not available"
            });
        }

        const events = await Event.find({
            status: "ACTIVE",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: user.location.coordinates
                    },
                    $maxDistance: 3000
                }
            }
        });
        return res.status(200).json({
            message: "Near by Events....",
            data: events
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Sever Error...",
            error: error.message
        })
    }
}

const eventCancel = async (req, res) => {
    try {
        const bookingID = req.params.bookingId;
        const userID = req.user.userId;

        const booking = await Booking.findById(bookingID);

        if (!booking) {
            return res.status(404).json({
                message: "Booking ID not found"
            });
        }

        if (booking.status === "CANCELED") {
            return res.status(400).json({
                message: "You already canceled this booking"
            });
        }

        if (booking.userId.toString() !== userID) {
            return res.status(403).json({
                message: "This booking does not belong to you"
            });
        }

        const event = await Event.findById(booking.eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const now = new Date();

        const timeDiff =
            event.startTime.getTime() - now.getTime();

        const eightHr = 8 * 60 * 60 * 1000;

        if (timeDiff < eightHr) {
            return res.status(400).json({
                message: "You cannot cancel the event less than 8 hours before it starts"
            });
        }

        booking.status = "CANCELED";
        booking.canceledAt = now;

        await booking.save();

        return res.status(200).json({
            message: "Booking canceled successfully",
            data: booking
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = { joinEvent, getMyEvent, getNearbyEvents, eventCancel };