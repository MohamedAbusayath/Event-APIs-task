const express=require("express");
const userRoutes=express.Router();
const {updateLocation}=require("../Controller/userController");
const authMiddleware=require("../Middleware/authMiddleware");
const authorizeRole=require("../Middleware/roleMiddleware");

userRoutes.patch("/update",authMiddleware,authorizeRole("CUSTOMER"),updateLocation);

module.exports=userRoutes;