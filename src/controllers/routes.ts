import express from 'express'
import { createMegaverseHandler, emptyMegaverseHandler } from './handler'

const router = express.Router()

router.get('/ping', (_req, res) => {
  res.send('Pong!')
})

router.post('/createMegaverse', createMegaverseHandler)
router.delete('/emptyMegaverse', emptyMegaverseHandler)

export default router
