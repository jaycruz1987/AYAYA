import { Request, Response, NextFunction } from 'express';
import { HotelService } from '../../services/hotel.service';
import { RoomTypeService } from '../../services/room-type.service';
import { ServiceRequestService } from '../../services/service-request.service';
import { HotelJwtPayload } from '../../types/express';
import { AppError } from '../../middlewares/error.middleware';

export class BEndHotelController {
  private hotelService = new HotelService();
  private roomTypeService = new RoomTypeService();
  private serviceRequestService = new ServiceRequestService();

  // ==========================================
  // Profile (Self)
  // ==========================================
  public getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId } = req.user as unknown as HotelJwtPayload;
      const hotel = await this.hotelService.getHotelById(hotelId);
      
      if (!hotel) throw new AppError('Hotel profile not found', 404);

      res.status(200).json({ success: true, data: hotel });
    } catch (error) {
      next(error);
    }
  };

  public updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId } = req.user as unknown as HotelJwtPayload;
      const { id, ...updateData } = req.body;
      
      const updatedHotel = await this.hotelService.updateHotel(hotelId, updateData);

      res.status(200).json({ success: true, data: updatedHotel });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // Room Types
  // ==========================================
  public getMyRoomTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId } = req.user as unknown as HotelJwtPayload;
      const roomTypes = await this.roomTypeService.getRoomTypesByHotelId(hotelId);
      res.status(200).json({ success: true, data: roomTypes });
    } catch (error) {
      next(error);
    }
  };

  public createRoomType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId: myHotelId } = req.user as unknown as HotelJwtPayload;
      const { hotelId, ...data } = req.body; // strip out malicious hotelId
      const roomType = await this.roomTypeService.createRoomType(myHotelId, data);
      res.status(201).json({ success: true, data: roomType });
    } catch (error) {
      next(error);
    }
  };

  public updateRoomType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId } = req.user as unknown as HotelJwtPayload;
      const id = req.params.id as string;
      
      const roomType = await this.roomTypeService.updateRoomType(hotelId, id, req.body);
      res.status(200).json({ success: true, data: roomType });
    } catch (error) {
      next(error);
    }
  };

  public deleteRoomType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId } = req.user as unknown as HotelJwtPayload;
      const id = req.params.id as string;

      await this.roomTypeService.deleteRoomType(hotelId, id);
      res.status(200).json({ success: true, message: 'Room type deleted' });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // Service Requests
  // ==========================================
  public getMyServiceRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId } = req.user as unknown as HotelJwtPayload;
      // Force filter by tenant
      const filters = { ...req.query, hotelId };
      const requests = await this.serviceRequestService.getAllRequests(filters as any);
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  };

  public getServiceRequestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId } = req.user as unknown as HotelJwtPayload;
      const id = req.params.id as string;
      const request = await this.serviceRequestService.getRequestById(id);

      if (!request || request.hotelId !== hotelId) {
        throw new AppError('Service request not found or access denied', 404);
      }

      res.status(200).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  };

  // Hotels might only be able to view, or maybe close requests assigned to them.
  // For now, we replicate the actions but with tenant checks.
  public updateNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hotelId } = req.user as unknown as HotelJwtPayload;
      const id = req.params.id as string;
      
      const existing = await this.serviceRequestService.getRequestById(id);
      if (!existing || existing.hotelId !== hotelId) {
        throw new AppError('Service request not found or access denied', 404);
      }

      const updatedRequest = await this.serviceRequestService.updateNotes(id, req.body.adminNotes);
      res.status(200).json({ success: true, data: updatedRequest });
    } catch (error: any) {
      if (error instanceof AppError) return next(error);
      next(new AppError(error.message, 400));
    }
  };
}
