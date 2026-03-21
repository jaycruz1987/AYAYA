import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // ==========================================
  // C-End User Auth
  // ==========================================
  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.registerUser(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.loginUser(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // B-End Admin Auth
  // ==========================================
  public registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.registerAdmin(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.loginAdmin(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Helper method to get current logged in profile
  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
