import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/Users.Route/Auth.Routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import Adminroute from "./routes/AdminRoute/doctor.routes.js";
import serviceRoutes from "./routes/AdminRoute/service.route.js";
import doctorRoutes from "./routes/DocterRoute/docter.route.js";
 

const app = express();

connectDB();

app.use(cors({
    origin: "http://localhost:5173", // Vite ka default port
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
app.use("/api/services", serviceRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Hospital Management API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});