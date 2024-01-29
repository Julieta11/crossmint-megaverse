import { Request, Response, NextFunction } from 'express'
import { Logger } from '../interfaces/loggerInterfaces'
import customLogger from '../utils/logger'

const logger: Logger = customLogger

export class FetchError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'FetchError'
    this.status = status
  }
}

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`${error}`)

  if (error instanceof FetchError) {
    return res.status(error.status).json({ error: error.message })
  } else {
    // Handle generic error
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
}
