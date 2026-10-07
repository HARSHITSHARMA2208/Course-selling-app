const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Email regex validator
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        required: [true, "Email is required"], 
        trim: true,
        lowercase: true,
        match: [emailRegex, "Please fill a valid email address"]
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    firstName: { 
        type: String, 
        required: [true, "First name is required"], 
        trim: true 
    },
    lastName: { 
        type: String, 
        required: [true, "Last name is required"], 
        trim: true 
    }
}, { timestamps: true });

const adminSchema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        required: [true, "Email is required"], 
        trim: true,
        lowercase: true,
        match: [emailRegex, "Please fill a valid email address"]
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    firstName: { 
        type: String, 
        required: [true, "First name is required"], 
        trim: true 
    },
    lastName: { 
        type: String, 
        required: [true, "Last name is required"], 
        trim: true 
    }
}, { timestamps: true });

const courseSchema = new Schema({
    title: { 
        type: String, 
        required: [true, "Course title is required"], 
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, "Course description is required"], 
        trim: true 
    },
    price: { 
        type: Number, 
        required: [true, "Course price is required"],
        min: [0, "Price cannot be negative"]
    },
    imageUrl: { 
        type: String, 
        required: [true, "Course cover image is required"] 
    },
    category: {
        type: String,
        default: "Development",
        trim: true
    },
    rating: {
        type: Number,
        default: 4.8,
        min: [1, "Rating cannot be less than 1"],
        max: [5, "Rating cannot exceed 5"]
    },
    ratingsCount: {
        type: Number,
        default: 120
    },
    status: {
        type: String,
        enum: ["active", "draft", "archived"],
        default: "active"
    },
    creatorId: { 
        type: ObjectId, 
        ref: 'Admin', 
        required: [true, "Creator reference is required"] 
    }
}, { timestamps: true });

const purchaseSchema = new Schema({
    userId: { 
        type: ObjectId, 
        ref: 'User', 
        required: [true, "User reference is required"] 
    },
    courseId: { 
        type: ObjectId, 
        ref: 'Course', 
        required: [true, "Course reference is required"] 
    }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
const adminModel = mongoose.model("Admin", adminSchema);
const courseModel = mongoose.model("Course", courseSchema);
const purchaseModel = mongoose.model("Purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
};