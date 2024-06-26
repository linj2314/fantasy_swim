import express from "express";
import { User, League } from "../db/schema.js";
import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";
import crypto from "crypto";
const options = new Options();
options.addArguments('--remote-debugging-pipe');
options.addArguments('--headless=new');
options.addArguments("--window-size=1920,1080");
options.addArguments("--start-maximized");

const router = express.Router();

//for receiving search results from cloud
router.get('/api/search/:q', async (req, res) => {
    try {
        const query = req.params.q;
        const response = await fetch("https://www.swimcloud.com/api/search/?q=" + query, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json();

        res.status(200).json(result);
    } catch {
        console.log(error);
        res.status(500).json({error: "Error while creating league and searching"});
    }
});

//for retrieving roster of a team
router.get('/roster/:teamId', async (req, res) => {
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    try {
        await driver.get('https://www.swimcloud.com/team/3951/roster/');
        const ret = [];
        const swimmers = await driver.findElements(By.css('.c-table-clean tbody tr'));
        for (const s of swimmers) {
            const name = s.findElement(By.css(".u-text-semi"));
            const hometown = s.findElement(By.css(".u-text-truncate"));
            ret.push({
                id: await name.getAttribute("href"),
                name: await name.getText(),
                hometown: await hometown.getText(),
            });
        }
        await driver.findElement(By.css('label[for="F"]')).click();
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css(".c-title"))), 100);
        const swimmers2 = await driver.findElements(By.css('.c-table-clean tbody tr'));
        for (const s of swimmers2) {
            const name = s.findElement(By.css(".u-text-semi"));
            const hometown = s.findElement(By.css(".u-text-truncate"));
            ret.push({
                id: await name.getAttribute("href"),
                name: await name.getText(),
                hometown: await hometown.getText(),
            });
        }
        res.status(200).json(ret);
    } catch(error) {
        console.error("An error occured while retrieving roster", error);
    } finally {
        await driver.quit();
    }
});

//for creating a new league
router.post('/', async (req, res) => {
    try {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = "";
        while (true) {
            code = "";
            const bytes = crypto.randomBytes(6);
            for (let i = 0; i < 6; i++) {
                code += characters[bytes[i] % characters.length];
            }
            const temp = await League.findOne({join: code});
            if (!temp) {
                break;
            }
        }
        
        const league = new League({
            name: req.body.name,
            duration: req.body.duration,
            status: 0,
            swimmers: req.body.swimmers,
            join: code,
            participants: [req.body.userId],
            creator: req.body.userId,
        });
        const id = league._id.toString();
        await league.save();
        res.status(200).json({ id: id });
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error creating league"});
    }
});

//for adding a new participant to a league
router.post('/participant', async (req, res) => {
    try {
        const league = await League.findOne({join: req.body.join});

        if (!league) {
            return res.status(404).json({error: "league not found"});
        }

        league.participants.push(req.body.id);
        const league_id = league._id;

        await league.save();

        res.status(200).json({league_id: league_id});
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error while adding new participant to league"});
    }
});

//for retrieving a league's information
router.post('/info', async (req, res) => {
    try {
        const league = await League.findById(req.body.league_id);

        if (!league) {
            return res.status(404).json({error: "league not found"});
        }

        res.status(200).json(league);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error while retrieving league info"});
    }
});

//for retrieving names of participants
router.post('/participants', async (req, res) => {
    try {
        const ret = [];
        for (const user_id of req.body.participants) {
            const user = await User.findById(user_id);

            if (!user) {
                return res.status(404).json({error: "Could not find one or more participants"});
            }

            ret.push(user.username);
        }
        res.status(200).json(ret);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error while retrieving names of league participants"});
    }
});

export default router;