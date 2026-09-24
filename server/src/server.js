import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/Users.Route/Auth.Routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import Adminroute from "./routes/AdminRoute/doctor.routes.js";
import doctorRoutes from "./routes/DocterRoute/docter.route.js";
dotenv.config();

const app = express();

connectDB();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
//Auth routes
app.use("/api/auth", authRoutes);

//Patient routes
app.use("/api/appointments", appointmentRoutes);

//Docter routes
app.use("/api/doctor", doctorRoutes);

//Admin routes
app.use("/api/admin", Adminroute);

app.get("/", (req, res) => {
    res.json({
        message: "Hospital Management API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});