import winston from 'winston'
import { Logger } from '../interfaces/loggerInterfaces'

const customLogger: Logger = winston.createLogger({
  level: 'info', // TODO: check this
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
})

export default customLogger
