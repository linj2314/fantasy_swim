import express from "express";
import { League } from "../db/schema.js";

const router = express.Router();

router.get('/', async (req, res) => {
    //TODO
});

router.post('/', async (req, res) => {
    try {
        const league = new League({
            name: req.body.name,
            duration: req.body.duration,
            started: 0,
            swimmers: req.body.swimmers,
        });
        const id = league._id.toString();
        await league.save();
        res.status(200).json({ id: id });
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error creating league"});
    }
});

export default router;