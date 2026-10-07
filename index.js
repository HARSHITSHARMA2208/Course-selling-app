require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const { userModel, adminModel, courseModel } = require("./db");

const app = express();

// Enable CORS for frontend API integration
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

// Seed default data for instant out-of-the-box functionality
async function seedDefaultData() {
    try {
        // 1. Seed Demo Instructor
        let admin = await adminModel.findOne({ email: "instructor@coursify.com" });
        if (!admin) {
            const hashedAdminPassword = await bcrypt.hash("AdminSecret123!", 10);
            admin = await adminModel.create({
                email: "instructor@coursify.com",
                password: hashedAdminPassword,
                firstName: "Alex",
                lastName: "Rivera"
            });
            console.log("✓ Default Instructor account seeded: instructor@coursify.com / AdminSecret123!");
        }

        // 2. Seed Demo Student
        const user = await userModel.findOne({ email: "student@example.com" });
        if (!user) {
            const hashedUserPassword = await bcrypt.hash("Password123!", 10);
            await userModel.create({
                email: "student@example.com",
                password: hashedUserPassword,
                firstName: "Jordan",
                lastName: "Lee"
            });
            console.log("✓ Default Student account seeded: student@example.com / Password123!");
        }

        // 3. Seed Sample Courses if none exist
        const courseCount = await courseModel.countDocuments();
        if (courseCount === 0 && admin) {
            await courseModel.insertMany([
                {
                    title: "Full-Stack React & Node.js Masterclass",
                    description: "Build complete end-to-end fullstack applications with modern React 19, Express, and MongoDB.",
                    price: 49,
                    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
                    category: "Development",
                    rating: 4.9,
                    ratingsCount: 230,
                    status: "active",
                    creatorId: admin._id
                },
                {
                    title: "Next.js 15 & Tailwind CSS: Modern Web Architectures",
                    description: "Learn server components, server actions, optimistic UI, and scalable modern web design principles.",
                    price: 59,
                    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
                    category: "Development",
                    rating: 4.8,
                    ratingsCount: 145,
                    status: "active",
                    creatorId: admin._id
                },
                {
                    title: "Advanced System Design & Microservices",
                    description: "Master distributed systems, caching strategies, load balancing, message queues, and high availability.",
                    price: 79,
                    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
                    category: "DevOps",
                    rating: 5.0,
                    ratingsCount: 88,
                    status: "active",
                    creatorId: admin._id
                },
                {
                    title: "UI/UX Design Systems in Figma & Code",
                    description: "Design pixel-perfect interfaces, craft component libraries, and bridge the gap between design and code.",
                    price: 39,
                    imageUrl: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80",
                    category: "Design",
                    rating: 4.7,
                    ratingsCount: 95,
                    status: "active",
                    creatorId: admin._id
                }
            ]);
            console.log("✓ Sample catalog courses seeded successfully");
        }
    } catch (err) {
        console.warn("Notice during seeding:", err.message);
    }
}

async function connectDatabase() {
    const mongoUrl = process.env.MONGO_URL;

    // First attempt: Connect to configured MONGO_URL if available
    if (mongoUrl && !mongoUrl.includes("127.0.0.1") && !mongoUrl.includes("localhost")) {
        try {
            console.log("Connecting to remote MongoDB...");
            await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
            console.log("✓ Successfully connected to remote MongoDB");
            return;
        } catch (e) {
            console.warn("Could not connect to remote MongoDB:", e.message);
        }
    } else if (mongoUrl) {
        try {
            console.log("Connecting to local MongoDB instance...");
            await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 2000 });
            console.log("✓ Successfully connected to local MongoDB");
            return;
        } catch (e) {
            console.log("Local MongoDB server not active on port 27017.");
        }
    }

    // Fallback: Use MongoMemoryServer so the app runs instantly without external dependencies
    try {
        console.log("Starting integrated in-memory MongoDB engine...");
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log("✓ Connected to integrated MongoDB engine at:", uri);
    } catch (err) {
        console.error("Failed to start in-memory MongoDB:", err);
        throw err;
    }
}

async function main() {
    try {
        await connectDatabase();
        await seedDefaultData();
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✓ Coursify API Server is running on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error("Failed to start server:", e);
        process.exit(1);
    }
}

main();
