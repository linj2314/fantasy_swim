const uri = process.env.URI || "";
import mongoose, { Schema } from "mongoose";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    leagues: [{ type: String }],
});

const leagueSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    duration: {
        type: Number,
    },
    status: {
        type: Number,
    },
    swimmers: [{
        _id: false,
        name: {type: String},
        link: {type: String},
    }],
    join: {
        type: String,
    },
    participants: [{ type: String }],
    creator: {
        type: String,
    },
    draft_selections: {
        type: Map,
        of: [{
            _id: false,
            name: {type: String},
            link: {type: String},
        }],
    },
    weekly_results: {
        type: Map,
        of: {
            type: Map,
            of: {type: String},
        }
    },
    points: {
        type: Map,
        of: {type: Number},
    },
    start_date: {
        type: Date,
    }
});

const League = mongoose.model("League", leagueSchema);
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

export { User, League };