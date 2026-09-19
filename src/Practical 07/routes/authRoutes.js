const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {

    try {
        const {name, email, password} = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({                                                               
            username: name,                                                               
            email: email,                                                               
            password: hashedPassword                                                             
        });                                                               
                                                               
        res.status(201).json({                                                                 
            message: "User registered successfully",                                                                 
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }                                                                 
        });                                                                   
    } catch (error) {                                                                 
        console.error(error);                                                                 
        res.status(500).json({                                                                 
            message: "Internal server error"                                                                 
        });                                                                   
    }                                                               
});                                                               
                                                        
router.post("/login", async (req, res) => {

    try {
        const {email, password} = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});
module.exports = router;