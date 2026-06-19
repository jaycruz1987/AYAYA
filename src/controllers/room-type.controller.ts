import { Request, Response, NextFunction } from 'express';
import { RoomTypeService } from '../services/room-type.service';

export class RoomTypeController {
  private service: RoomTypeService;

  constructor() {
    this.service = new RoomTypeService();
  }

  public getByHotel = async (req: Request<{ hotelId: string }>, res: Response, next: NextFunction) => {
    try {
      const hotelId = req.params.hotelId; // from /hotels/:hotelId/room-types
      const roomTypes = await this.service.getRoomTypesByHotelId(hotelId);
      res.status(200).json({ success: true, data: roomTypes });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request<{ hotelId: string }>, res: Response, next: NextFunction) => {
    try {
      const hotelId = req.params.hotelId; // from /hotels/:hotelId/room-types
      const newRoomType = await this.service.createRoomType(hotelId, req.body);
      res.status(201).json({ success: true, data: newRoomType });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id; // from /room-types/:id
      const existing = await this.service.getRoomTypeById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'RoomType not found' });
      }
      const updated = await this.service.updateRoomType(existing.hotelId, id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id; // from /room-types/:id
      const existing = await this.service.getRoomTypeById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'RoomType not found' });
      }
      await this.service.deleteRoomType(existing.hotelId, id);
      res.status(200).json({ success: true, message: 'Room type deleted' });
    } catch (error) {
      next(error);
    }
  };
}