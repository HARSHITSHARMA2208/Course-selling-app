const { Router } = require("express");
const { userModel, purchaseModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

// Email regex helper
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

userRouter.post("/signup", async function (req, res) {
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
        // Check if user already exists
        const existingUser = await userModel.findOne({ email: trimmedEmail });
        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            email: trimmedEmail,
            password: hashedPassword,
            firstName: firstName.trim(),
            lastName: lastName.trim()
        });

        // Generate JWT token for automatic login
        const token = jwt.sign(
            { id: newUser._id },
            JWT_USER_PASSWORD,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: "Signup successful",
            token: token,
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });

    } catch (e) {
        console.error("User signup error:", e);
        return res.status(500).json({
            message: "Internal server error during registration"
        });
    }
});
    
userRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        // Find the user by email
        const user = await userModel.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            JWT_USER_PASSWORD,
            { expiresIn: '24h' }
        );

        return res.json({
            token: token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (e) {
        console.error("User signin error:", e);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

userRouter.get("/profile", userMiddleware, async function (req, res) {
    const userId = req.userId;

    try {
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json({
            user
        });
    } catch (e) {
        console.error("User profile error:", e);
        return res.status(500).json({
            message: "Internal server error while fetching profile"
        });
    }
});

userRouter.get("/purchases", userMiddleware, async function(req, res){
    const userId = req.userId;

    try {
        const purchases = await purchaseModel.find({
            userId: userId
        }).populate({
            path: "courseId",
            populate: {
                path: "creatorId",
                select: "firstName lastName"
            }
        });

        // Map and filter nulls just in case a course was deleted
        const courses = purchases.map(x => x.courseId).filter(Boolean);

        return res.json({
            purchases,
            courses
        });
    } catch (e) {
        console.error("User purchases error:", e);
        return res.status(500).json({
            message: "Internal server error while fetching purchases"
        });
    }
});

module.exports = {
    userRouter: userRouter
};