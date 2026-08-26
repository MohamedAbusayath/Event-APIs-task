const express=require("express");
const bookingRoutes=express.Router();
const { joinEvent,getMyEvent,getNearbyEvents,eventCancel }=require("../Controller/bookingController");
const authMiddleware=require("../Middleware/authMiddleware");
const authorizeRole=require("../Middleware/roleMiddleware");

bookingRoutes.post("/join/:eventId",authMiddleware,authorizeRole("CUSTOMER"),joinEvent);

bookingRoutes.get("/my-event",authMiddleware,authorizeRole("CUSTOMER"),getMyEvent);

bookingRoutes.get("/near",authMiddleware,authorizeRole("CUSTOMER"),getNearbyEvents);

bookingRoutes.patch("/cancel/:bookingId",authMiddleware,authorizeRole("CUSTOMER"),eventCancel);

module.exports=bookingRoutes;