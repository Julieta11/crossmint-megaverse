import dotenv from 'dotenv'

dotenv.config()

const config = {
  baseURL: process.env.BASE_URL || 'http://localhost',
  crossmintAPI: process.env.CROSSMINT_API_URL || 'https://challenge.crossmint.io/api',
  candidateID: process.env.CANDIDATE_ID || 'ce0172cc-2b78-46bc-8142-41085e2191d8',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL
}

export default config
