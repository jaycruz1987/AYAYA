import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { MerchantJwtPayload, HotelJwtPayload } from '../types/express';

// 餐饮商家专属 Middleware
export const requireMerchantAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证 Token' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string) as any;
    
    // 严格校验 userType 和 merchantId
    if (decoded.userType !== 'merchant' || !decoded.merchantId) {
      return res.status(403).json({ success: false, message: '权限不足：需要餐饮商家权限' });
    }

    // 强类型断言
    req.user = decoded as MerchantJwtPayload;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token 无效或已过期' });
  }
};

// 酒店专属 Middleware
export const requireHotelAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证 Token' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string) as any;
    
    if (decoded.userType !== 'hotel' || !decoded.hotelId) {
      return res.status(403).json({ success: false, message: '权限不足：需要酒店权限' });
    }

    req.user = decoded as HotelJwtPayload;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token 无效或已过期' });
  }
};
