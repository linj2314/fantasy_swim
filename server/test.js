import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";
const options = new Options();
options.addArguments('--remote-debugging-pipe');
options.addArguments('--headless=new');
options.addArguments("--window-size=1920,1080");
options.addArguments("--start-maximized");

;(async function example() {
    const swimmers = ["https://www.swimcloud.com/swimmer/2197923", "https://www.swimcloud.com/swimmer/2575910", "https://www.swimcloud.com/swimmer/2197922", "https://www.swimcloud.com/swimmer/1401814", "https://www.swimcloud.com/swimmer/1640637"];
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    try {
        for (const s of swimmers) {
            await driver.get(s);

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
            const results = [];
            for (const r of rows) {
                const cells = (await r.findElements(By.css("td"))).slice(0, 2);
                const event_text = await cells[0].getText();
                const mini_text = await cells[0].findElement(By.css("span")).getText();
                const event = event_text.replace(mini_text, "").trim();
                const time = await cells[1].getText();
                results.push({
                    event: event,
                    time: time,
                });
            }
            console.log(results);
        }
    } finally {
        await driver.quit();
    }
})()