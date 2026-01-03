import Quotes from "../models/Quotes.js";

export const getUserQuotes = async (req, res) => {
    try {
        const userId = req.user._id;

        const quotes = await Quotes.find({ userId }).sort({ createdAt: -1 });

        res.json({ quotes });
    } catch (error) {
        console.error("Error fetching user quotes:", error);
        res.status(500).json({ msg: "Server error" });
    }
};