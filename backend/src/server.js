import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});