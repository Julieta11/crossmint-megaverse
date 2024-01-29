import {
  ApiService,
  GoalMapResponse,
  ItemResponse,
  CurrentMapResponse,
  Polyanet,
  Cometh,
  Soloon
} from '../interfaces/apiInterfaces'
import { Fetcher } from '../interfaces/fetcherInterfaces'
import config from '../utils/config'
import { Logger } from '../interfaces/loggerInterfaces'
import { getArrays, translateGoalMapResponse, verifyResult } from './utils'
import { FetchError } from '../middlewares/errorHandler'
import customFetcher from '../utils/fetcher'
import customLogger from '../utils/logger'

const fetcher: Fetcher = customFetcher
const logger: Logger = customLogger

class ApiServiceImpl implements ApiService {
  /**
   * Creates a Megaverse based on the goal map retrieved for a candidate.
   * @returns A Promise indicating whether the Megaverse creation was successful (true) or not (false).
   * @throws If there's an error during the creation process or if the response structure is invalid.
   */
  async createMegaverse(): Promise<boolean> {
    try {
      const goalMap = await this.getGoalMap()
      const goalMapTrans = translateGoalMapResponse(goalMap)
      const arrsToCreate = getArrays(goalMapTrans)
      await this.createPolyanets(arrsToCreate.polyanets)
      await this.createComeths(arrsToCreate.comeths)
      await this.createSoloons(arrsToCreate.soloons)

      const result = await this.getCurrentMap()
      const success = verifyResult(result, goalMapTrans)

      if (success) {
        // If everything went well, return true
        return true
      } else {
        // If there was an error, handle it and return false
        throw new Error('An error occurred while creating Megaverse.')
      }
    } catch (error: any) {
      if (error instanceof FetchError) {
        throw error
      } else {
        throw new Error(`Error creating megaverse: ${error.message}`)
      }
    }
  }

  /**
   * Empties the Megaverse by deleting existing Polyanets, Comeths, and Soloons.
   * @returns A Promise indicating whether the Megaverse emptying was successful (true) or not (false).
   * @throws If there's an error during the emptying process or if the response structure is invalid.
   */
  async emptyMegaverse(): Promise<boolean> {
    try {
      const current = await this.getCurrentMap()
      const arrsToDelete = getArrays(current)
      await this.deletePolyanets(arrsToDelete.polyanets)
      await this.deleteComeths(arrsToDelete.comeths)
      await this.deleteSoloons(arrsToDelete.soloons)
      return true
    } catch (error: any) {
      if (error instanceof FetchError) {
        throw error
      } else {
        throw new Error(`Error emptying megaverse: ${error.message}`)
      }
    }
  }

  /**
   * Retrieves the goal map for a candidate
   * @returns A Promise containing the goal map as a two-dimensional array.
   * @throws If the response structure is invalid or an error occurs during the request.
   */
  async getGoalMap(): Promise<string[][]> {
    try {
      const url = `${config.crossmintAPI}/map/${config.candidateID}/goal`
      const jsonResponse = await fetcher.fetch(url)

      // Handle the case where the response structure is unexpected
      if (!jsonResponse || !jsonResponse.goal || !Array.isArray(jsonResponse.goal)) {
        throw new Error('Invalid response structure getGoalMap')
      }

      const response = jsonResponse as GoalMapResponse
      return response.goal
    } catch (error) {
      // Re-throw the error
      throw error
    }
  }

  /**
   * Retrieves the current map for a candidate.
   * @returns A Promise containing the current map as a two-dimensional array of ItemResponse.
   * @throws If the response structure is invalid or an error occurs during the request.
   */
  async getCurrentMap(): Promise<ItemResponse[][]> {
    try {
      const url = `${config.crossmintAPI}/map/${config.candidateID}`
      const jsonResponse = await fetcher.fetch(url)

      // Handle the case where the response structure is unexpected
      if (!jsonResponse || !jsonResponse.map || !jsonResponse.map.content || !Array.isArray(jsonResponse.map.content)) {
        throw new Error('Invalid or incomplete response structure in getCurrentMap')
      }

      const response = jsonResponse.map as CurrentMapResponse
      return response.content
    } catch (error) {
      // Re-throw the error
      throw error
    }
  }

  /**
   * Posts an entity to the Crossmint API.
   * @param entity - The entity to be posted.
   * @param entityType - The type of the entity (e.g., 'Polyanet', 'Cometh', 'Soloon').
   * @param retryCount - The number of retry attempts in case of a rate limit (default is 10).
   * @returns A Promise indicating whether the entity posting was successful (true) or not (false).
   * @throws If there's an error during the posting process, including rate limiting.
   */
  async postEntity(entity: any, entityType: string, retryCount: number = 10): Promise<boolean> {
    try {
      const url = `${config.crossmintAPI}${entityType}s`
      await fetcher.fetch(url, 'post', { ...entity, candidateId: config.candidateID })

      return true
    } catch (error: any) {
      // Handle fetch errors
      if (error.status === 429 && retryCount > 0) {
        // If 429 error, retry with exponential backoff
        const delay = Math.pow(2, 3 - retryCount) * 1000 // Exponential backoff with max delay of 8 seconds
        logger.info(`Rate limited. Retrying in ${delay / 1000} seconds...`)

        try {
          await new Promise((resolve) => setTimeout(resolve, delay))
          return await this.postEntity(entity, entityType, retryCount - 1) // Retry the request
        } catch (retryError) {
          logger.error(`Error retrying request: ${retryError}`)
          throw retryError // Re-throw the retry error
        }
      } else {
        logger.error(`Error creating ${entityType}: ${error}`)
        throw error // Re-throw the error if not a 429 error or no more retries
      }
    }
  }

  // Function for creating multiple Polyaneths
  async createPolyanets(polyanets: Polyanet[]): Promise<boolean> {
    for (const p of polyanets) {
      await this.postEntity(p, 'polyanet')
    }
    return true
  }
  // Function for creating multiple Comeths
  async createComeths(comeths: Cometh[]): Promise<boolean> {
    for (const c of comeths) {
      await this.postEntity(c, 'cometh')
    }
    return true
  }
  // Function for creating multiple Soloons
  async createSoloons(soloons: Soloon[]): Promise<boolean> {
    for (const s of soloons) {
      await this.postEntity(s, 'soloon')
    }
    return true
  }

  async deletePolyanets(polyanets: Polyanet[]): Promise<boolean> {
    // const batchSize = 5; // Adjust the batch size as needed
    // const batches = [];

    // for (let i = 0; i < polyanets.length; i += batchSize) {
    //   const batch = polyanets.slice(i, i + batchSize);
    //   batches.push(batch);
    // }

    // for (const batch of batches) {

    //   await this.deleteEntity(batch, "polyanet");
    // }

    // return true;

    for (const p of polyanets) {
      await this.deleteEntity(p, 'polyanet')
    }
    return true
  }
  async deleteComeths(comeths: Cometh[]): Promise<boolean> {
    // const batchSize = 5; // Adjust the batch size as needed
    // const batches = [];

    // for (let i = 0; i < comeths.length; i += batchSize) {
    //   const batch = comeths.slice(i, i + batchSize);
    //   batches.push(batch);
    // }

    // for (const batch of batches) {

    //   await this.deleteEntity(batch, "cometh");
    // }

    // return true;

    for (const c of comeths) {
      await this.deleteEntity(c, 'cometh')
    }
    return true
  }
  async deleteSoloons(soloons: Soloon[]): Promise<boolean> {
    // const batchSize = 5; // Adjust the batch size as needed
    // const batches = [];

    // for (let i = 0; i < soloons.length; i += batchSize) {
    //   const batch = soloons.slice(i, i + batchSize);
    //   batches.push(batch);
    // }

    // for (const batch of batches) {

    //   await this.deleteEntity(batch, "soloon");
    // }

    // return true;

    for (const s of soloons) {
      await this.deleteEntity(s, 'soloon')
    }
    return true
  }

  /**
   * Deletes an entity from the Crossmint API.
   * @param entity - The entity to be deleted.
   * @param entityType - The type of the entity (e.g., 'Polyanet', 'Cometh', 'Soloon').
   * @param retryCount - The number of retry attempts in case of a failure (default is 10).
   * @returns A Promise indicating whether the entity deletion was successful (true) or not (false).
   * @throws If there's an error during the deletion process, including failures and retries.
   */
  async deleteEntity(entity: any, entityType: string, retryCount: number = 10): Promise<boolean> {
    try {
      const url = `${config.crossmintAPI}${entityType}s`
      await fetcher.fetch(url, 'delete', { ...entity, candidateId: config.candidateID })

      return true
    } catch (error: any) {
      // Handle fetch errors
      logger.error(`Error deleting ${entityType}: ${error}`)

      if (retryCount > 0) {
        // Retry with exponential backoff
        const delay = Math.pow(2, 3 - retryCount) * 1000 // Exponential backoff with max delay of 8 seconds
        logger.debug(`Retry in ${delay / 1000} seconds...`)

        try {
          await new Promise((resolve) => setTimeout(resolve, delay))
          return await this.deleteEntity(entity, entityType, retryCount - 1) // Retry the request
        } catch (retryError) {
          logger.error(`Error retrying request: ${retryError}`)
          throw retryError // Re-throw the retry error
        }
      } else {
        throw error // Re-throw the error if no more retries
      }
    }
  }
}

const apiService: ApiService = new ApiServiceImpl()

export default apiService
