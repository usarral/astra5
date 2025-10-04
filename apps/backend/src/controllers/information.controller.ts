import { Request, Response, NextFunction } from 'express';
import * as informationService from '../services/information.service';

export async function listInformation(req: Request, res: Response, next: NextFunction) {
  try {
    //Fetch information from the service
    const data = await informationService.fetchInformationList();

    //return the data as JSON response
    res.json({ data });
  } catch (err) {
    //catch and forward error to the next middleware
    next(err as Error);
  }
}

export async function getInformationById(req: Request, res: Response, next: NextFunction) {
    //Extract id from request parameters
  const id = req.params.id;

  try {
    //Fetch information and associated images from the service
    const info = await informationService.fetchInformationById(id);
    const images = await informationService.fetchImagesForInformation(id);
    //return combined data as JSON response
    res.json({ data: { ...info, images } });
  } catch (err) {
    //catch and forward error to the next middleware
    next(err as Error);
  }
}

export async function health(req: Request, res: Response, next: NextFunction) {
  try {
    //Perform health check via the service
    const result = await informationService.healthCheck();
    //return health check result as JSON response
    res.json(result);
  } catch (err) {
    //catch and forward error to the next middleware
    next(err as Error);
  }
}
