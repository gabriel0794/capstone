import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const personnelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    role: { type: String, default: 'personnel' }, // Default personnel role
    password: { type: String, required: true }, // Password field added
});

const Personnel = mongoose.model('Personnel', personnelSchema);

export default Personnel;
