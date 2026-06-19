import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs'; // Using bcryptjs instead of bcrypt to avoid native binding issues
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/env';

const prisma = new PrismaClient();

export const merchantLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.merchantUser.findUnique({ where: { email } });
    
    // 模糊提示，防爆破
    if (!user) {
      return res.status(401).json({ success: false, message: '账号不存在或密码错误' });
    }

    // Status 校验
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: `账号已被停用，当前状态: ${user.status}` });
    }

    // 密码比对
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: '账号不存在或密码错误' });
    }

    // 组装强类型 Payload
    const payload = {
      userId: user.id,
      userType: 'merchant',
      merchantId: user.merchantId,
    };

    const token = jwt.sign(payload, config.jwtSecret as string, { expiresIn: config.jwtExpiresIn as any });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, merchantId: user.merchantId, role: user.role }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const hotelLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.hotelUser.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: '账号不存在或密码错误' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: `账号已被停用，当前状态: ${user.status}` });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: '账号不存在或密码错误' });
    }

    const payload = {
      userId: user.id,
      userType: 'hotel',
      hotelId: user.hotelId,
    };

    const token = jwt.sign(payload, config.jwtSecret as string, { expiresIn: config.jwtExpiresIn as any });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, hotelId: user.hotelId, role: user.role }
      }
    });
  } catch (error) {
    next(error);
  }
};
