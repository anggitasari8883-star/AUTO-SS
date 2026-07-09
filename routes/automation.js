const express = require('express');
const router = express.Router();
const { AutomationBot } = require('../utils/puppeteer-auto');
const fs = require('fs');

let automationBot = null;
let isRunning = false;

router.post('/start', async (req, res) => {
  try {
    if (isRunning) {
      return res.status(400).json({ error: 'Automation already running' });
    }
    const { playerIds } = req.body;
    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return res.status(400).json({ error: 'Invalid playerIds' });
    }
    isRunning = true;
    automationBot = new AutomationBot();
    await automationBot.init();
    await automationBot.setSessionCookie();
    const results = await automationBot.processBatch(playerIds, (progress) => {
      console.log(`Progress: ${progress.current}/${progress.total}`);
    });
    await automationBot.close();
    isRunning = false;
    const resultsFile = `results-${Date.now()}.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    res.json({
      success: true,
      totalProcessed: playerIds.length,
      successCount: results.length,
      failureCount: playerIds.length - results.length,
      results: results,
      resultsFile: resultsFile,
    });
  } catch (error) {
    isRunning = false;
    console.error('Automation error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', (req, res) => {
  res.json({ isRunning });
});

router.post('/stop', async (req, res) => {
  try {
    if (automationBot) {
      await automationBot.close();
      automationBot = null;
    }
    isRunning = false;
    res.json({ success: true, message: 'Automation stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/results/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = `${filename}`;
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const data = fs.readFileSync(filepath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;