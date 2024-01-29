import winston from 'winston'
import { Logger } from '../interfaces/loggerInterfaces'

const customLogger: Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
})

export default customLogger
