const express=require("express");
const routes=express.Router();
const {loginValid,registerValid}=require("../Validation/authValidation");
const {registerUser,loginUser}=require("../Controller/authController");


routes.post("/register",registerValid,registerUser);

routes.post("/login",loginValid,loginUser);

module.exports=routes;