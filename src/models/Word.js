import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    language: { type: String },
    title: { type: String, required: true, trim: true },
    pronun: { type: String, trim: true },
    mean: [{ type: String, trim: true }],
    example: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now, required: true },
    from: { type: String, trim: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
})

const Word = mongoose.model("Word", wordSchema);
export default Word;