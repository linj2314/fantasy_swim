const uri = process.env.URI || "";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
})

/*
userSchema.pre("save", async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
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
*/

const User = mongoose.model("User", userSchema);

async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB! (through mongoose)");
    } catch(err) {
        console.err(err)
    }
}

run().catch(console.dir);

export default User;