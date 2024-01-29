import apiService from '../services/apiService'
import { Request, Response, NextFunction } from 'express'

export const createMegaverseHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const megaverseData = await apiService.createMegaverse()

    res.status(201).json({
      success: true,
      message: 'Megaverse created successfully.',
      data: megaverseData
    })
  } catch (error) {
    next(error)
  }
}

export const emptyMegaverseHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const megaverseData = await apiService.emptyMegaverse()

    res.status(201).json({
      success: true,
      message: 'Megaverse emptied successfully.',
      data: megaverseData
    })
  } catch (error) {
    next(error)
  }
}
