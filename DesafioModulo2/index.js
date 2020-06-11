import express from 'express';
import { promises } from 'fs';
import winston from 'winston';
import gradesRouter from './routes/grades.js';
import cors from 'cors';

const app = express();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

//global.fileName = './data/grades.json';
global.fileName = './TrabalhoPratico/DesafioModulo2/data/grades.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'grades-control-api.log' }),
  ],
  format: combine(
    label({ label: 'grades-control-api' }),
    timestamp(),
    myFormat
  ),
});

app.use(express.json());

app.use('/grade', gradesRouter);

app.listen(3000, async () => {
  try {
    await readFile(global.fileName, 'utf8');
    logger.info('Grades-Control-API Started!');
  } catch (err) {
    logger.error('Grades-Control-API Init Error!');
  }
});
