const express=require("express");
const eventRoutes=express.Router();
const {createEvent,getEvents,getOne,updateEvent,cancelEvent,getParticipants}=require("../Controller/eventController");
const { eventValid } = require("../Validation/eventValidation");
const authMiddleware=require("../Middleware/authMiddleware");
const authorizeRole=require("../Middleware/roleMiddleware");

eventRoutes.post("/",authMiddleware,authorizeRole("ADMIN"),eventValid,createEvent);

eventRoutes.get("/",authMiddleware,getEvents);

eventRoutes.get("/:id",authMiddleware,authorizeRole("ADMIN"),getOne);

eventRoutes.put("/:id",authMiddleware,authorizeRole("ADMIN"),eventValid,updateEvent);

eventRoutes.patch("/cancel/:id",authMiddleware,authorizeRole("ADMIN"),cancelEvent);

eventRoutes.get("/participants/:eventId",authMiddleware,authorizeRole("ADMIN"),getParticipants);

module.exports=eventRoutes;
