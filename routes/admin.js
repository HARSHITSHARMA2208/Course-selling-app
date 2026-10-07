const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel, purchaseModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

adminRouter.post("/signup", async function (req, res) {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({
            message: "Please provide a valid email address"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        });
    }

    try {
        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ email: trimmedEmail });
        if (existingAdmin) {
            return res.status(409).json({
                message: "An instructor account with this email already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await adminModel.create({
            email: trimmedEmail,
            password: hashedPassword,
            firstName: firstName.trim(),
            lastName: lastName.trim()
        });

        // Generate JWT token for automatic login
        const token = jwt.sign(
            { id: newAdmin._id },
            JWT_ADMIN_PASSWORD,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: "Instructor signup successful",
            token: token,
            admin: {
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email
            }
        });

    } catch (e) {
        console.error("Admin signup error:", e);
        return res.status(500).json({
            message: "Internal server error during registration"
        });
    }
});
    
adminRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        // Find the admin by email
        const admin = await adminModel.findOne({ email: email.trim().toLowerCase() });

        if (!admin) {
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const passwordMatched = await bcrypt.compare(password, admin.password);

        if (!passwordMatched) {
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id },
            JWT_ADMIN_PASSWORD,
            { expiresIn: '24h' }
        );

        return res.json({
            token: token,
            admin: {
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email
            }
        });
    } catch (e) {
        console.error("Admin signin error:", e);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

adminRouter.get("/profile", adminMiddleware, async function (req, res) {
    const adminId = req.userId;

    try {
        const admin = await adminModel.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({
                message: "Instructor not found"
            });
        }

        return res.json({
            admin
        });
    } catch (e) {
        console.error("Admin profile error:", e);
        return res.status(500).json({
            message: "Internal server error while fetching profile"
        });
    }
});

adminRouter.get("/analytics", adminMiddleware, async function (req, res) {
    const adminId = req.userId;

    try {
        // Find all courses created by this admin (active and archived)
        const courses = await courseModel.find({ creatorId: adminId });
        const courseIds = courses.map(c => c._id);

        if (courseIds.length === 0) {
            return res.json({
                totalCourses: 0,
                totalStudents: 0,
                totalRevenue: 0
            });
        }

        // Run aggregation to calculate students count and total revenue
        const analytics = await purchaseModel.aggregate([
            { 
                $match: { courseId: { $in: courseIds } } 
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $unwind: "$courseInfo" },
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    totalRevenue: { $sum: "$courseInfo.price" }
                }
            }
        ]);

        return res.json({
            totalCourses: courses.filter(c => c.status === "active").length,
            totalStudents: analytics[0]?.totalStudents || 0,
            totalRevenue: analytics[0]?.totalRevenue || 0
        });

    } catch (e) {
        console.error("Admin analytics error:", e);
        return res.status(500).json({
            message: "Internal server error while retrieving analytics"
        });
    }
});

adminRouter.post("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;
    const { title, description, price, imageUrl, category } = req.body;

    if (!title || !description || price === undefined || !imageUrl) {
        return res.status(400).json({
            message: "All fields (title, description, price, imageUrl) are required"
        });
    }

    try {
        const course = await courseModel.create({
            title: title.trim(),
            description: description.trim(),
            price: Number(price),
            imageUrl: imageUrl.trim(),
            category: category ? category.trim() : "Development",
            creatorId: adminId,
            status: "active"
        });

        return res.status(201).json({
            message: "Course created successfully",
            courseId: course._id
        });
    } catch (e) {
        console.error("Admin course creation error:", e);
        return res.status(500).json({
            message: "Internal server error while creating course"
        });
    }
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
    const adminId = req.userId;
    const { courseId, title, description, price, imageUrl, category, status } = req.body;

    if (!courseId) {
        return res.status(400).json({
            message: "courseId is required for editing a course"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
            message: "Invalid courseId format"
        });
    }

    try {
        // Find course to verify ownership
        const course = await courseModel.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.creatorId.toString() !== adminId) {
            return res.status(403).json({
                message: "You are not authorized to edit this course"
            });
        }

        // Update fields if provided
        if (title !== undefined) course.title = title.trim();
        if (description !== undefined) course.description = description.trim();
        if (price !== undefined) course.price = Number(price);
        if (imageUrl !== undefined) course.imageUrl = imageUrl.trim();
        if (category !== undefined) course.category = category.trim();
        if (status !== undefined) course.status = status;

        const updatedCourse = await course.save();

        return res.json({
            message: "Course updated successfully",
            course: updatedCourse
        });
    } catch (e) {
        console.error("Admin course update error:", e);
        return res.status(500).json({
            message: "Internal server error while updating course"
        });
    }
});

adminRouter.delete("/course/:courseId", adminMiddleware, async function (req, res) {
    const adminId = req.userId;
    const { courseId } = req.params;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
            message: "A valid courseId is required"
        });
    }

    try {
        // Find course and verify ownership
        const course = await courseModel.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.creatorId.toString() !== adminId) {
            return res.status(403).json({
                message: "You are not authorized to delete this course"
            });
        }

        // Soft delete: update status to archived
        course.status = "archived";
        await course.save();

        return res.json({
            message: "Course archived successfully"
        });

    } catch (e) {
        console.error("Admin course delete error:", e);
        return res.status(500).json({
            message: "Internal server error while deleting course"
        });
    }
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
    const adminId = req.userId;

    try {
        // Return active and draft courses (archived courses are hidden from list)
        const courses = await courseModel.find({
            creatorId: adminId,
            status: { $ne: "archived" }
        });

        return res.json({
            courses
        });
    } catch (e) {
        console.error("Admin bulk courses error:", e);
        return res.status(500).json({
            message: "Internal server error while fetching courses"
        });
    }
});

adminRouter.get("/course", adminMiddleware, async function (req, res) {
    const adminId = req.userId;

    try {
        const courses = await courseModel.find({
            creatorId: adminId,
            status: { $ne: "archived" }
        });

        return res.json({
            courses
        });
    } catch (e) {
        console.error("Admin course fetch error:", e);
        return res.status(500).json({
            message: "Internal server error while fetching courses"
        });
    }
});

module.exports = {
    adminRouter: adminRouter
};