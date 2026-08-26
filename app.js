require("dotenv").config();
const express=require("express");
const dbConnect=require("./Config/db");
const routes=require("./Routes/authRoute");
const eventRoutes = require("./Routes/eventRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const userRoutes=require("./Routes/userRoutes");
const app=express();
app.use(express.json());
dbConnect();

app.use("/api/auth",routes);
app.use("/api/events", eventRoutes);
app.use("/api/booking",bookingRoutes);
app.use("/api/user",userRoutes);

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});