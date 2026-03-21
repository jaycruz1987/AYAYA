import { Request, Response, NextFunction } from 'express';
import { HotelService } from '../services/hotel.service';
import { AppError } from '../middlewares/error.middleware';

export class HotelController {
  private hotelService: HotelService;

  constructor() {
    this.hotelService = new HotelService();
  }

  public getAllHotels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { city, isFeatured, minStarRating } = req.query;
      
      const filters = {
        city: city as string,
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
        minStarRating: minStarRating ? parseInt(minStarRating as string, 10) : undefined,
      };

      const hotels = await this.hotelService.getAllHotels(filters);

      res.status(200).json({
        success: true,
        data: hotels,
      });
    } catch (error) {
      next(error);
    }
  };

  public getHotelById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const hotel = await this.hotelService.getHotelById(id);

      if (!hotel) {
        throw new AppError('Hotel not found', 404);
      }

      res.status(200).json({
        success: true,
        data: hotel,
      });
    } catch (error) {
      next(error);
    }
  };

  public createHotel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newHotel = await this.hotelService.createHotel(req.body);

      res.status(201).json({
        success: true,
        data: newHotel,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateHotel = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const updatedHotel = await this.hotelService.updateHotel(id, req.body);

      res.status(200).json({
        success: true,
        data: updatedHotel,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteHotel = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.hotelService.deleteHotel(id);

      res.status(200).json({
        success: true,
        message: 'Hotel successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  };
}