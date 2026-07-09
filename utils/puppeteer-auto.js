const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { uploadToImgbb } = require('./imgbb-upload');

class AutomationBot {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.page = await this.browser.newPage();
      console.log('✅ Browser launched');
    } catch (error) {
      console.error('❌ Failed to launch browser:', error);
      throw error;
    }
  }

  async setSessionCookie() {
    try {
      const cookies = process.env.SESSION_COOKIE.split(';').map((cookie) => {
        const [name, value] = cookie.trim().split('=');
        return {
          name: name.trim(),
          value: value.trim(),
          url: 'https://agent.png777.com',
        };
      });

      await this.page.setCookie(...cookies);
      console.log('✅ Session cookie set');
    } catch (error) {
      console.error('❌ Failed to set cookie:', error);
    }
  }

  async navigateToPlayer(playerName) {
    try {
      await this.page.goto(process.env.AGENT_URL, { waitUntil: 'networkidle2' });
      await this.page.type('input[name="nama_pemain"]', playerName, { delay: 50 });
      await this.page.waitForSelector('.player-row', { timeout: 5000 });
      await this.page.click('.player-row');
      console.log(`✅ Navigated to player: ${playerName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to navigate to player ${playerName}:`, error.message);
      return false;
    }
  }

  async clickHistoryBank() {
    try {
      await this.page.waitForSelector('.jq-history-button', { timeout: 5000 });
      await this.page.click('.jq-history-button');
      await this.page.waitForSelector('.history-coin-table', { timeout: 5000 });
      await this.page.waitForTimeout(1000);
      console.log('✅ History Bank clicked');
      return true;
    } catch (error) {
      console.error('❌ Failed to click History Bank:', error.message);
      return false;
    }
  }

  async screenshotTable() {
    try {
      const element = await this.page.$('.history-coin-table');
      if (!element) {
        console.error('❌ History Coin table not found');
        return null;
      }
      if (!fs.existsSync('./screenshots')) {
        fs.mkdirSync('./screenshots', { recursive: true });
      }
      const timestamp = Date.now();
      const screenshotPath = path.join('./screenshots', `${timestamp}.png`);
      await element.screenshot({ path: screenshotPath });
      console.log(`✅ Screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.error('❌ Failed to take screenshot:', error.message);
      return null;
    }
  }

  async processPlayer(playerName) {
    try {
      const navigated = await this.navigateToPlayer(playerName);
      if (!navigated) return null;
      const clicked = await this.clickHistoryBank();
      if (!clicked) return null;
      const screenshotPath = await this.screenshotTable();
      if (!screenshotPath) return null;
      const uploadResult = await uploadToImgbb(screenshotPath);
      if (uploadResult.success) {
        fs.unlinkSync(screenshotPath);
        console.log(`✅ Uploaded: ${playerName}`);
        return {
          playerId: playerName,
          imageUrl: uploadResult.link,
          deleteUrl: uploadResult.deleteUrl,
        };
      } else {
        console.error(`❌ Upload failed for ${playerName}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error processing player ${playerName}:`, error.message);
      return null;
    }
  }

  async processBatch(playerList, onProgress) {
    const results = [];
    const total = playerList.length;
    for (let i = 0; i < total; i++) {
      const playerName = playerList[i];
      console.log(`\n📝 Processing ${i + 1}/${total}: ${playerName}`);
      const result = await this.processPlayer(playerName);
      if (result) {
        results.push(result);
      }
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: total,
          completed: results.length,
          playerId: playerName,
        });
      }
      await this.page.waitForTimeout(2000);
    }
    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Browser closed');
    }
  }
}

module.exports = { AutomationBot };