import express from "express";
import db from "../db/connection.js";
import User from "../db/schema.js";
import { ObjectId } from "mongodb";
import auth from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();
const secretKey = process.env.JWT_SECRET;
const expireTime = process.env.JWT_EXPIRE;

router.post("/", async (req, res) => {
    try {
        console.log(req.body.username);
        console.log(req.body.email);
        console.log(req.body.password);
        const pass = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: pass,
        });
        await user.save();
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating account");
    }
}); 

router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ username: username });
        if (!user) {
            user = await User.findOne({ email: email });
        }
    
        if (!user) {
            console.log("couldn't find account");
            return res.status(401).json({ error: 'Authentication failed try again' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
   
        if (!passwordMatch) {
            console.log("couldn't match password");
            return res.status(401).json({ error: 'Authentication failed try again' });
        }
   
        // Create a JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
            expiresIn: expireTime,
        });
   
        res.status(200).json({ token: token, userId: user._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Authentication failed try again' });
    }
});

//protected paths

router.get("/home", auth, (req, res) => {
    res.status(200).send();
})

/*
router.get("/", async (req, res) => {
    let collection = await db.collection("UserData");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});
  
  // This section will help you get a single record by id
router.get("/:id", async (req, res) => {
    let collection = await db.collection("UserData");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});
  
  // This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
            },
        };
  
        let collection = await db.collection("UserData");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating record");
    }
});
  
  // This section will help you delete a record
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
  
        const collection = db.collection("UserData");
        let result = await collection.deleteOne(query);
  
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});
*/
export default router;
