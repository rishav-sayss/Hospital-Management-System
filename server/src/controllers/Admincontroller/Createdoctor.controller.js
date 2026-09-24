import User from "../../models/Authmodel/Usermodel.js";
import Doctor from "../../models/Doctermodel.js";

export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualifications,
      experience,
      location,
      about,
      consultationFee,
    } = req.body;

    // 1. Required fields check
    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      consultationFee === undefined
    ) {
      return res.status(400).json({
        message:
          "Name, email, password, specialization and consultation fee are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }


    // 4. Create User with doctor role
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "doctor",
    });

    // 5. Create Doctor profile
    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      qualifications,
      experience,
      location,
      about,
      consultationFee,
    });

    // 6. Response
    return res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error);

    return res.status(500).json({
      message: "Failed to create doctor",
    });
  }
};