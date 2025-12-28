import express from 'express';
import Quote from '../models/Quotes.js';
import User from '../models/User.js';
import cloudinaryService from '../services/cloudinary.service.js';
import { generatePDF } from '../utils/generatePDF.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Handle OPTIONS preflight requests for all routes in this router
// This must be BEFORE multer middleware to prevent multer from interfering
const getAllowedOrigin = (origin) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000'];
    
    if (!origin || process.env.NODE_ENV === 'development') {
        return allowedOrigins[0] || '*';
    }
    
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
};

router.options('/', (req, res) => {
    const origin = getAllowedOrigin(req.headers.origin);
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    return res.sendStatus(200);
});

router.options('/:id/pdf', (req, res) => {
    const origin = getAllowedOrigin(req.headers.origin);
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    return res.sendStatus(200);
});

// --------------------
// POST /api/quotes
// --------------------
router.post('/', authenticate, upload.single("logo"), async (req, res) => {
    try {
        console.log('Received request:', req.method, req.path);
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const { userId, customerName, customerEmail, items, subtotal, tax, total } = req.body;
        const logoPath = req.file ? req.file.path : null;

        if (!customerName || !customerEmail) {
            return res.status(400).json({ msg: "Customer name and email are required" });
        }

        if (!items) {
            return res.status(400).json({ msg: "Items are required" });
        }

        const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

        // Use authenticated user's ID
        const validUserId = req.user._id;

        const quote = await Quote.create({
            userId: validUserId,
            customerName,
            customerEmail,
            items: parsedItems,
            subTotal: parseFloat(subtotal) || 0,
            tax: parseFloat(tax) || 0,
            total: parseFloat(total) || 0,
            logoPath
        });

        console.log('Quote created:', quote._id);
        return res.status(201).json(quote);

    } catch (error) {
        console.error('Error creating quote:', error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// --------------------
// GET PDF
// --------------------
router.get('/:id/pdf', authenticate, async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if(!quote) {
            return res.status(404).json({ msg: "Quote not found" });
        }

        // Verify that the quote belongs to the authenticated user
        if (quote.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Access denied. This quote does not belong to you." });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const { pdfBuffer } = await generatePDF(quote, user, { save: true });

        // Set CORS headers for PDF download
        const origin = getAllowedOrigin(req.headers.origin);
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="preventivo-${quote._id}.pdf"`);
        return res.send(pdfBuffer);

    } catch (error) {
        console.error('Error getting PDF:', error);
        return res.status(500).json({ msg: "Server error" });
    }
});

router.post('/companyProfile', authenticate, upload.single("logo"), async (req, res) => {
    try {
        console.log("Received file:", req);
        const userId = req.user.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const logoUrl = await cloudinaryService.uploadLogo(file);

        // Update user's logoUrl in the database
        await User.findByIdAndUpdate(userId, { logoUrl });

        // Delete the temporary file
        fs.unlinkSync(file.path);

        res.json({ msg: "Logo uploaded successfully", logoUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;