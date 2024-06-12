const uri = process.env.URI || "";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
})

userSchema.pre("save", async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
});

userSchema.methods.comparePassword = async function(password) {
    if (!password) throw new Error("No password provided");

    try {
        const result = await bcrypt.compare(password, this.password);
        return result;
    } catch(err) {
        console.error(err)
    }
}

try {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
} catch(err) {
    console.error(err)
}

const User = mongoose.model("User", userSchema);

export default User;