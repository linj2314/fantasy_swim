import { League } from "./schema.js";
import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";
import score from "./score.js";

const options = new Options();
options.addArguments('--remote-debugging-pipe');
options.addArguments('--headless=new');
options.addArguments("--window-size=1920,1080");
options.addArguments("--start-maximized");

export default async function UpdateDB() {
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    try {
        const leagues = await League.find({status: { $in: [1, 2, 3] } });
        for (const league in leagues) {
            if (league.status == 1) {
                const date = new Date();
                date.setHours(0, 0, 0, 0);
                league.start_date = date;
            } else if (league.status == 2) {
                let date = new Date();
                date.setHours(0, 0, 0, 0);
                //check if week is done
                if (((date - league.start_date) / (60 * 60 * 24 * 1000)) % 7 === 0) {
                    temp_points = {};
                    for (const [user, swimmers] of Object.entries(league.draft_selections)) {
                        temp_points[user] = 0;
                        for (const s of swimmers) {
                            const swimmer_id = s.link.match(/\d+/g).join('');
                            for (const [event, results] of Object.entries(league.weekly_results)) {
                                if (results[swimmer_id]) {
                                    temp_points[user] += score(event, results[swimmer_id]);
                                }
                            }
                        }
                    }
                    for (const [user, points] of Object.entries(temp_points)) {
                        league.points[user] += points;
                    }
                    league.weekly_results.clear();
                }

                //check if league is done
                if (((date - league.start_date) / (60 * 60 * 24 * 1000)) / 7 === league.duration) {
                    league.status = 3;
                    await league.save();
                    continue;
                }
            } else if (league.status == 3) {
                let date = new Date();
                date.setHours(0, 0, 0, 0);
                if (((date - league.start_date) / (60 * 60 * 24 * 1000)) === league.duration * 7 + 3) {
                    await league.deleteOne();
                    continue;
                }
            }
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
                    
                    if (today.toDateString() !== next_date.toDateString()) {
                        continue;
                    }

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
            await league.save();
        }
    } catch(error) {
        console.log(error);
    } finally {
        driver.quit();
    }
}