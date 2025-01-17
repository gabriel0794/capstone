import express from 'express';
import jwt from 'jsonwebtoken';  // Assuming you're using JWT for authentication
import Pet from '../models/pets.js';
import Personnel from '../models/personnel.js';  // Personnel model to get personnel info
import users from '../models/users.js';  // User model for owner data

const router = express.Router();

// Middleware to authenticate the token and set user info in req.user
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 's3cr3t'); // Decode the token using your secret key
        req.user = decoded; // Add the decoded user data to the request object
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

// Route to get pet data based on RFID with authentication
router.get('/rfid/:rfid', authenticateToken, async (req, res) => {
    try {
        const personnelName = req.user.name;  // Extract the name from the decoded token

        // Find the pet using the provided RFID number and populate the ownerId field with user data
        const pet = await Pet.findOne({ rfidNumber: req.params.rfid }).populate('ownerId');

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Sort the vaccination history in descending order based on date
        const sortedVaccinationHistory = pet.vaccinationHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Prepare the response data
        const responseData = {
            rfid: pet.rfidNumber,
            ownerName: pet.ownerId.name,  // Access owner name from populated ownerId
            contact: pet.contact,
            address: pet.address,
            vaccinationHistory: sortedVaccinationHistory,
            petName: pet.name,
            petType: pet.petType,
            breed1: pet.breed1,
            breed2: pet.breed2,
            personnelName: personnelName  // Include the personnel name from the decoded JWT
        };

        // Send the response
        res.json(responseData);
    } catch (error) {
        console.error("Error fetching pet:", error.message);
        res.status(500).send("Server error");
    }
});

export default router;
