import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";
const options = new Options();
options.addArguments('--remote-debugging-pipe');
options.addArguments('--headless=new');

;(async function example() {
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    try {
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
        console.log(ret);
    } finally {
        await driver.quit();
    }
})()