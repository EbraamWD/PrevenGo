import User from "../models/User.js";
import { cloudinaryService } from "../services/cloudinary.service.js";
import fs from "fs";

export const uploadCompanyLogo = async (req, res) => {
    try {
        console.log("User ricevuto:", req.file);
        
        // Usa _id invece di id, o gestisci entrambi i casi
        const userId = req.user._id || req.user.id;
        
        if (!userId) {
            return res.status(401).json({ msg: "User ID not found" });
        }
        console.log("User ID:", userId);
        console.log("Req arrivato ", req);
        const file = req.file;

        if (!file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        console.log("Uploading logo to Cloudinary...");
        const logoUrl = await cloudinaryService.uploadLogo(file);
        console.log("Logo uploaded:", logoUrl);

        // Update user's logoUrl in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { logoUrl },
            { new: true } // Restituisce il documento aggiornato
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        console.log("User updated successfully");

        // Delete the temporary file
        fs.unlinkSync(file.path);

        res.json({ 
            msg: "Logo uploaded successfully", 
            logoUrl,
            company: {
                _id: updatedUser._id,
                email: updatedUser.email,
                companyName: updatedUser.companyName,
                address: updatedUser.companyAddress,
                vatNumber: updatedUser.vatNumber,
                companyLogo: updatedUser.logoUrl
            }
        });
    } catch (err) {
        console.error("Error in uploadCompanyLogo:", err);
        
        // Rimuovi il file temporaneo anche in caso di errore
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
                console.error("Error deleting temp file:", unlinkErr);
            }
        }
        
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Controller per aggiornare il profilo aziendale (companyName, address, vatNumber, logo)
export const updateCompanyProfile = async (req, res) => {
    try {
        console.log("Body ricevuto:", req.body);
        console.log("File ricevuto:", req.file);
        console.log("User:", req.user);

        const userId = req.user._id || req.user.id;
        
        if (!userId) {
            return res.status(401).json({ msg: "User ID not found" });
        }

        // Oggetto per gli aggiornamenti
        const updates = {};

        // Aggiungi solo i campi presenti nel body
        if (req.body.companyName !== undefined) {
            updates.companyName = req.body.companyName;
        }

        if (req.body.address !== undefined) {
            updates.companyAddress = req.body.address;
        }

        if (req.body.vatNumber !== undefined) {
            updates.vatNumber = req.body.vatNumber;
        }

        // Se c'è un file logo, caricalo su Cloudinary
        if (req.file) {
            console.log("Uploading logo to Cloudinary...");
            const logoUrl = await cloudinaryService.uploadLogo(req.file);
            updates.logoUrl = logoUrl;
            console.log("Logo uploaded:", logoUrl);

            // Rimuovi il file temporaneo
            fs.unlinkSync(req.file.path);
        }

        console.log("Updates to apply:", updates);

        // Se non ci sono aggiornamenti, restituisci l'utente corrente
        if (Object.keys(updates).length === 0) {
            const user = await User.findById(userId);
            return res.json({
                msg: "No changes to update",
                company: {
                    _id: user._id,
                    email: user.email,
                    companyName: user.companyName,
                    address: user.companyAddress,
                    vatNumber: user.vatNumber,
                    companyLogo: user.logoUrl
                }
            });
        }

        // Aggiorna solo i campi modificati
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        console.log("User updated successfully:", updatedUser);

        res.json({
            msg: "Company profile updated successfully",
            company: {
                _id: updatedUser._id,
                email: updatedUser.email,
                companyName: updatedUser.companyName,
                address: updatedUser.companyAddress,
                vatNumber: updatedUser.vatNumber,
                companyLogo: updatedUser.logoUrl
            }
        });

    } catch (err) {
        console.error("Error in updateCompanyProfile:", err);
        
        // Rimuovi il file temporaneo anche in caso di errore
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
                console.error("Error deleting temp file:", unlinkErr);
            }
        }
        
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};