import config from './utils/config'
import express from 'express'
import routes from './controllers/routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()
const port = config.port

app.use('/api', routes)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
