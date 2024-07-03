import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";
const options = new Options();
options.addArguments('--remote-debugging-pipe');
options.addArguments('--headless=new');
options.addArguments("--window-size=1920,1080");
options.addArguments("--start-maximized");



;(async function example() {
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
        console.log(ret);
    } finally {
        await driver.quit();
    }
})()