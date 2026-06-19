import { Request, Response, NextFunction } from 'express';
import { ServiceRequestService } from '../services/service-request.service';
import { AppError } from '../middlewares/error.middleware';

export class ServiceRequestController {
  private service: ServiceRequestService;

  constructor() {
    this.service = new ServiceRequestService();
  }

  public getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, type, referenceNo, assignedAdminUserId } = req.query;
      
      const filters = {
        status: status as string,
        type: type as string,
        referenceNo: referenceNo as string,
        assignedAdminUserId: assignedAdminUserId as string,
      };

      const requests = await this.service.getAllRequests(filters);

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  };

  public getRequestById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const request = await this.service.getRequestById(id);

      if (!request) {
        throw new AppError('Service Request not found', 404);
      }

      res.status(200).json({
        success: true,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  public assignAdmin = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const adminId = (req as any).user.userId; // From auth middleware
      
      const updatedRequest = await this.service.assignAdmin(id, adminId);

      res.status(200).json({
        success: true,
        data: updatedRequest,
      });
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  };

  public updateNotes = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { adminNotes } = req.body;
      
      const updatedRequest = await this.service.updateNotes(id, adminNotes);

      res.status(200).json({
        success: true,
        data: updatedRequest,
      });
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  };

  public closeRequest = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { adminNotes } = req.body;
      
      const updatedRequest = await this.service.closeRequest(id, adminNotes);

      res.status(200).json({
        success: true,
        data: updatedRequest,
      });
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  };
}
