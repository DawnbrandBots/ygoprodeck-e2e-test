/// SPDX-FileCopyrightText: © 2024 Kevin Lu
/// SPDX-Licence-Identifier: AGPL-3.0-or-later
import { chromium, devices } from "playwright";
import { PlaywrightBlocker } from "@cliqz/adblocker-playwright";

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext(devices["Desktop Chrome"]);
    const page = await context.newPage();
    // Sometimes interferes with page rendering in automation
    const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking();
    await blocker.enableBlockingInPage(page);
    await page.goto("https://ygoprodeck.com/tournaments/top-archetypes/");
    // For screenshot backgrounds
    await page.evaluate(() => document.body.style.background = "transparent");
    async function screenshot(path) {
        await page.locator(".piechart-slice").first().scrollIntoViewIfNeeded();
        // omitBackground not supported in Firefox
        await page.locator("#piechart-container").screenshot({ path, omitBackground: true });
    }
    await screenshot("top-chart-tcg.png");
    await page.getByLabel("Format Menu").click();
    await page.getByLabel("Format Menu").selectOption("OCG");
    await screenshot("top-chart-ocg.png");
    await page.getByLabel("Format Menu").click();
    await page.getByLabel("Format Menu").selectOption("OCG-AE");
    await screenshot("top-chart-ocg-ae.png");
    await context.close();
    await browser.close();
})();
