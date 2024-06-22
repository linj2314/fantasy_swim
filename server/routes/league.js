import express from "express";
import { League } from "../db/schema.js";
import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";
const options = new Options();
options.addArguments('--remote-debugging-pipe');
options.addArguments('--headless=new');

const router = express.Router();

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

router.get('/roster', async (req, res) => {
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    try {
        //get url params working
        await driver.get('https://www.swimcloud.com/team/8102/roster/');
        const swimmers = await driver.findElements(By.css('.c-table-clean tbody tr'));
        const ret = [];
        for (const s of swimmers) {
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