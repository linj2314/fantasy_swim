import express from "express";
import { User, League } from "../db/schema.js";
import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";
import crypto from "crypto";
import { MongoDriverError } from "mongodb";
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
    const team_id = req.params.teamId;
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    try {
        await driver.get('https://www.swimcloud.com/team/' + team_id + '/roster/');
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
            if (ret.length == 250) {
                break;
            }
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
            return res.status(404).json({error: "league_not_found"});
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

//for deleting a league
router.delete('/delete', async (req, res) => {
    try {
        const league = await League.findById(req.body.league_id);
        const user = await User.findById(req.body.id);

        if (league.creator == req.body.id) {
            await league.deleteOne();
            for (const l in user.leagues) {
                if (user.leagues[l] == req.body.league_id) {
                    user.leagues.splice(l, 1);
                    break;
                }
            }
            await user.save();
        } else {
            for (const l in user.leagues) {
                if (user.leagues[l] == req.body.league_id) {
                    user.leagues.splice(l, 1);
                    break;
                }
            }
            for (const p in league.participants) {
                if (league.participants[p] == req.body.id) {
                    league.participants.splice(p, 1);
                    break;
                }
            }
            await user.save();
            await league.save();
        }

        res.status(204).send("League successfully removed");
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error while deleting/removing league"});
    }
});

//update draft results
router.patch('/draft', async (req, res) => {
    try {
        const league = await League.findById(req.body.league_id);

        league.draft_selections = req.body.draft_selections;
        league.status = 1; //temp status to indicate between drafting and league starting; do this because always want league to start at 12:00AM
        league.swimmers = [];
        league.weekly_results = new Map();
        const tmp = {};
        for (const p of league.participants) {
            tmp[p] = 0;
        }
        league.points = tmp;

        await league.save();

        res.status(204).send("Draft results successfully updated");
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error while updating draft results"});
    }
});

//update weekly results; only run this once a day (REMOVE THIS LATER)
router.post('/update_results', async (req, res) => {
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    try {
        const league = await League.findById(req.body.league_id);
        league.weekly_results.clear();
        for (const [_, swimmers] of league.draft_selections) {
            for (const s of swimmers) {
                await driver.get(s.link);
                const swimmer_id = s.link.match(/\d+/g).join('');

                const date_text = await driver.findElement(By.css(".u-text-normal")).getText();
                const date_arr = date_text.split(' ');
                const tmp = date_arr[1].split('\u{2013}');
                date_arr[1] = tmp[tmp.length - 1];
                const date = date_arr.join(" ");

                const day = 60 * 60 * 24 * 1000;
                const date_obj = new Date(date);
                const next_date = new Date(date_obj.getTime() + day);
                const today = new Date();
                
                /*
                if (today.toDateString() !== next_date.toDateString()) {
                    continue;
                }
                */

                const tb = await driver.findElement(By.css(".table"));
                const rows = await tb.findElements(By.css("tbody tr"));
                for (const r of rows) {
                    const cells = (await r.findElements(By.css("td"))).slice(0, 2);
                    const event_text = await cells[0].getText();
                    const mini_text = await cells[0].findElement(By.css("span")).getText();
                    if (mini_text == "Relay Split" || mini_text == "Extracted" || mini_text == "Relay Leadoff") {
                        continue;
                    }
                    const event = event_text.replace(mini_text, "").trim();
                    const time = await cells[1].getText();
                    if (league.weekly_results.has(event)) {
                        let swims = league.weekly_results.get(event);
                        if (swims.has(swimmer_id)) {
                            if (swims.get(swimmer_id) > time) {
                                swims.set(swimmer_id, time);
                            }
                        } else {
                            swims.set(swimmer_id, time);
                        }
                        const temp_array = Array.from(swims);
                        temp_array.sort((a, b) => a[1] - b[1]);
                        const sorted_swims = new Map(temp_array);
                        league.weekly_results.set(event, sorted_swims);
                    } else {
                        const swims = new Map();
                        swims.set(swimmer_id, time);
                        league.weekly_results.set(event, swims);
                    }
                }
            }
        }

        league.weekly_results = new Map([...league.weekly_results.entries()].sort((a, b) => b[0] - a[0]));
        await league.save({ checkKeys: false});

        res.status(204).send("Weekly results successfully updated");
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error while updating weekly results"});
    } finally {
        driver.quit();
    }
});

router.post('/test', async (req, res) => {
    try {
        const league = await League.findById(req.body.league_id);
        
        league.weekly_results.set("50 Y Free", {
            test: '25',
            test2: '20',
            test3: '35',
        });

        await league.save();

        console.log("done");

        res.status(204).send();
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Error while testing"});
    }
})

export default router;