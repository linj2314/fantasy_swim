import express from "express";
import { User, League } from "../db/schema.js";
import auth from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passwordValidator from "password-validator";
const router = express.Router();
const secretKey = process.env.JWT_SECRET;
const expireTime = process.env.JWT_EXPIRE;

router.post("/", async (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({
                error: "missing_field",
            })
        }

        const schema = new passwordValidator();

        schema
        .is().min(12)                                    
        .is().max(100)                                  
        .has().uppercase()                             
        .has().lowercase()
        .has().symbols()                               
        .has().digits()                                
        .has().not().spaces();                           

        if (!schema.validate(req.body.password)) {
            return res.status(400).json({
                error: "password",
            })
        }

        const pass = await bcrypt.hash(req.body.password, 8);

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                error: "invalid_email",
            })
        }

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: pass,
        });

        await user.save();
        res.status(204).send();
    } catch (err) { 
        if (err.name === "MongoServerError" && err.code == 11000) {
            if (err.keyPattern["email"] == 1) {
                return res.status(409).json({
                    error: "duplicate_email",
                })
            } else {
                return res.status(409).json({
                    error: "username",
                })
            }
        }
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
        const token = jwt.sign({ userId: user._id, email: user.email, username: user.username }, secretKey, {
            expiresIn: expireTime,
        });
   
        res.status(200).json({ token: token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Authentication failed try again' });
    }
});

//for adding another league to the users list of leagues
router.patch('/league', async (req, res) => {
    try {
        let user = await User.findById(req.body.id);

        if (!user) {
            console.log("couldn't find account");
            return res.status(404).json({ error: 'Adding league failed' });
        }

        if (user.leagues.length == 3) {
            const league = await League.findById(req.body.league_id);
            await league.deleteOne();
            return res.status(507).json({error: "too_many_leagues"});
        }

        user.leagues.push(req.body.league_id);

        await user.save();

        res.status(204).send("League successfully added");
    } catch(error) {
        console.error(error);
        res.status(500).send("Error while updating user's leagues");
    }
});

//for retrieving user leagues
router.post("/league", async (req, res) => {
    try {
        let user = await User.findById(req.body.id);

        if (!user) {
            console.log("couldn't find account while retrieving leagues");
            return res.status(404).json({ error: 'Adding league failed' });
        }

        const leagues = [];

        for (const l of user.leagues) {
            let league;
            league = await League.findById(l);
            if (!league) {
                user.leagues = user.leagues.filter((league_id) => league_id !== l);
                continue;
            }
            
            leagues.push(league);
        }

        await user.save();

        res.status(200).json(leagues);
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Error while retrieving list of user's leagues"});
    }
});

//protected paths

router.get("/home", auth, (req, res) => {
    res.status(200).json({ userId: req.userId, email: req.email, username: req.username });
});

export default router;
