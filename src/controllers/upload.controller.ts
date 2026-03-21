import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/error.middleware';

export class UploadController {
  public uploadImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      // Construct the URL to access the uploaded file
      const protocol = req.protocol;
      const host = req.get('host');
      const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        data: {
          url: fileUrl,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadMultipleImages = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new AppError('No files uploaded', 400);
      }

      const protocol = req.protocol;
      const host = req.get('host');

      const fileUrls = req.files.map((file) => ({
        url: `${protocol}://${host}/uploads/${file.filename}`,
        filename: file.filename,
      }));

      res.status(200).json({
        success: true,
        data: fileUrls,
      });
    } catch (error) {
      next(error);
    }
  };
}
