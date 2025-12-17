import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    items: [
        {
            description: String,
            quantity: Number,
            unitPrice: Number,
        }
    ],
    subTotal: Number,
    tax: Number,
    total: Number,
    logoPath: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Quote", quoteSchema);

    