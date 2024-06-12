import express from "express";

import db from "../db/connection.js";
import User from "../db/schema.js";

import { ObjectId } from "mongodb";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        user.save();
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record");
    }
});

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
