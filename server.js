const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Feedback Model
const Feedback = mongoose.model("Feedback", feedbackSchema);

// Receive feedback
app.post("/api/feedback", async (req, res) => {

    try {

        const { name, email, category, rating, message } = req.body;

        const feedback = new Feedback({
            name,
            email,
            category,
            rating,
            message
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to submit feedback"
        });

    }
});

// Get all feedback
app.get("/api/feedback", async (req, res) => {

    try {

        const feedback = await Feedback
            .find()
            .sort({ createdAt: -1 });

        res.json(feedback);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch feedback"
        });

    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});