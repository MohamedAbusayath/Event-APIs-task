const Event = require("../Modules/Event");
const Booking = require("../Modules/Booking");
const User = require("../Modules/User");

const createEvent=async (req,res)=>{
    try{
    const {title,description,startTime,endTime,location}=req.body;
    const event=await Event.create({
        title,
        description,
        startTime,
        endTime,
        location,
        createdBy:req.user.userId
    });

    return res.status(201).json({
        message:"Event Created Successfully....",
        data:event
    });
    }catch(error){
        return res.status(500).json({
            message: "Failed to create event",
            error: error.message
        });
    }
};

const getEvents=async (req,res)=>{
    try{
        const getAll=await Event.find().sort({createdAt:-1});
        return res.status(200).json({
            message:"All events",
            data:getAll
        })
    }catch(error){
        res.status(500).json({
            message:"Internal server error..",
            error:error.message
        })
    }

};

const getOne=async (req,res)=>{
    try{
    const getEvent=await Event.findById(req.params.id);
    if(!getEvent) return res.status(404).json({
        message:"Id Not Found...",
    });

    return res.status(200).json({
        message:"Event found successfully...",
        data:getEvent
    });
    }catch(error){
        return res.status(500).json({
            message:"Internal Server error...",
            error:error.message
        });
    }
}

const updateEvent=async (req,res)=>{
    try{
    const {title,description,startTime,endTime,location}=req.body;
    const getEvent=await Event.findById(req.params.id);
    if(!getEvent) return res.status(404).json({
        message:"Id Not Found...",
    });
    const updatedEvent={
        title,
        description,
        startTime,
        endTime,
        location
    }
    const updated=await Event.findByIdAndUpdate(req.params.id,updatedEvent,{new : true});
    return res.status(201).json({
        message:"Event Updated Successfully...",
        data:updated
    });
    }catch(error){
        return res.status(500).json({
            message:"Internal Server Error....",
            error:error.message
        });
    };
};

const cancelEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        if (event.status === "CANCELED") {
            return res.status(400).json({
                message: "Event is already canceled"
            });
        }

        event.status = "CANCELED";

        await event.save();

        return res.status(200).json({
            message: "Event canceled successfully",
            data: event
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const getParticipants = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const participants = await Booking.find({
            eventId: eventId
        }).populate("userId", "name email");

        return res.status(200).json({
            message: "Event participants",
            data: participants
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getOne,
    updateEvent,
    cancelEvent,
    getParticipants
};