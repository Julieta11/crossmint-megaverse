import fetch from 'cross-fetch'
import { Fetcher } from '../interfaces/fetcherInterfaces'
import { FetchError } from '../middlewares/errorHandler'
import customLogger from '../utils/logger'
import { Logger } from '../interfaces/loggerInterfaces'

const logger: Logger = customLogger

const customFetcher: Fetcher = {
  fetch: async (url: string, method: string = 'get', data?: any) => {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' }
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        // Handle non-successful responses
        const errorMessage = `Request failed with status: ${response.status}`
        logger.error(`Error in fetcher: ${errorMessage}`)
        throw new FetchError(errorMessage, response.status)
      }

      const responseData = await response.json()
      return responseData
    } catch (error) {
      if (error instanceof FetchError) {
        logger.error(`Error in fetcher: ${error.message}`)
        throw error // Re-throw the custom FetchError
      } else {
        // Handle other types of errors or rethrow them
        logger.error(`Unexpected error in fetcher: ${error}`)
        throw error
      }
    }
  }
}

export default customFetcher
