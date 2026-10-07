const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const mongoose = require("mongoose");

const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res){
    const userId = req.userId;
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({
            message: "courseId is required to purchase a course"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
            message: "Invalid courseId format"
        });
    }

    try {
        // Check if the course exists and is active
        const course = await courseModel.findOne({ _id: courseId, status: "active" });
        if (!course) {
            return res.status(404).json({
                message: "Course not found or is currently unavailable"
            });
        }

        // Check if the user has already purchased the course
        const existingPurchase = await purchaseModel.findOne({
            userId: userId,
            courseId: courseId
        });

        if (existingPurchase) {
            return res.status(400).json({
                message: "You have already purchased this course"
            });
        }

        await purchaseModel.create({
            userId: userId,
            courseId: courseId
        });

        return res.json({
            message: "You have successfully purchased the course"
        });
    } catch (e) {
        console.error("Course purchase error:", e);
        return res.status(500).json({
            message: "Internal server error while purchasing course"
        });
    }
});

courseRouter.get("/preview", async function(req, res){
    try {
        // Only return courses that are active, and populate creators
        const courses = await courseModel
            .find({ status: "active" })
            .populate("creatorId", "firstName lastName");
            
        return res.json({
            courses
        });
    } catch (e) {
        console.error("Course preview error:", e);
        return res.status(500).json({
            message: "Internal server error while fetching courses"
        });
    }
});

// GET single course details
courseRouter.get("/:courseId", async function(req, res) {
    const { courseId } = req.params;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
            message: "A valid courseId is required"
        });
    }

    try {
        const course = await courseModel
            .findOne({ _id: courseId, status: "active" })
            .populate("creatorId", "firstName lastName");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        return res.json({
            course
        });
    } catch (e) {
        console.error("Course details error:", e);
        return res.status(500).json({
            message: "Internal server error while retrieving course details"
        });
    }
});

module.exports = {
    courseRouter: courseRouter 
}; 