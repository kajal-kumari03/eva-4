// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cron = require('node-cron');
// const cors = require('cors');
// const winston = require('winston');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Set up winston logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'logs/combined.log' }),
//   ],
// });

// // Function to read file and upload data
// const readFileAndUpload = async () => {
//   try {
//     const dataPath = path.join(__dirname, 'data.json');
//     const fileData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//     const logsPath = path.join(__dirname, 'data-logs.json');

//     let existingData = [];
//     try {
//       existingData = JSON.parse(fs.readFileSync(logsPath, 'utf-8'));
//     } catch (err) {
//       logger.warn('Log file not found, starting with an empty array');
//     }

//     const newData = fileData.filter(item => !existingData.some(log => log.id === item.id));

//     if (newData.length > 0) {
//       const updatedData = [...existingData, ...newData];
//       fs.writeFileSync(logsPath, JSON.stringify(updatedData, null, 2), 'utf-8');
//       newData.forEach(item => logger.info(`Data with id ${item.id} added successfully`));
//     }
//   } catch (err) {
//     logger.error('Error reading or uploading data', err);
//   }
// };

// // Schedule the task to run twice a day
// cron.schedule('0 0,12 * * *', () => {
//   logger.info('Scheduled task started');
//   readFileAndUpload();
// });

// // Route to fetch logs
// app.get('/logs', (req, res) => {
//   const logFile = path.join(__dirname, 'logs/combined.log');
//   fs.readFile(logFile, 'utf-8', (err, data) => {
//     if (err) {
//       logger.error('Error reading log file', err);
//       return res.status(500).send('Error reading log file');
//     }
//     const logs = data.split('\n').filter(line => line).map(line => JSON.parse(line));
//     res.json(logs);
//   });
// });

// // Start the server
// app.listen(5000, () => {
//   logger.info('Server running on port 5000');
// });

const express = require('express');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const connectDB = require('./db');
const Data = require('./models/Data'); 
const logger = require('./logger');

const app = express();
connectDB();

app.use(express.json());

const readFileAndUpload = async () => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const fileData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    for (const item of fileData) {
      const exists = await Data.findOne({ id: item.id });
      if (!exists) {
        await new Data(item).save();
        logger.info(`Data with id ${item.id} added successfully`);
      }
    }
  } catch (err) {
    logger.error('Error reading or uploading data', err);
  }
};

cron.schedule('0 0,12 * * *', () => {
  logger.info('Scheduled task started');
  readFileAndUpload();
});

app.get('/logs', (req, res) => {
  const logFile = path.join(__dirname, 'logs/combined.log');
  fs.readFile(logFile, 'utf-8', (err, data) => {
    if (err) {
      logger.error('Error reading log file', err);
      return res.status(500).send('Error reading log file');
    }
    const logs = data.split('\n').filter(line => line).map(line => JSON.parse(line));
    res.json(logs);
  });
});

app.listen(5000, () => {
  logger.info('Server running on port 5000');
});

