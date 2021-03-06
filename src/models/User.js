import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    avatarUrl: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    language: { type: String },
    words: [{ type: mongoose.Schema.Types.ObjectId, ref: "Word" }],
})

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
}) // password를 저장하기 전에 가로채서 암호화함

const User = mongoose.model("User", userSchema);

export default User;