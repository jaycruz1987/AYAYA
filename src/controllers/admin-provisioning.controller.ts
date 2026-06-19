import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMerchantAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { merchantId, email, password, name, role } = req.body;
    
    // 1. 确认主体存在
    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) {
      return res.status(404).json({ success: false, message: '商家主体不存在' });
    }

    // 2. 检查邮箱冲突 (只在 merchant_users 内查)
    const exists = await prisma.merchantUser.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ success: false, message: '该邮箱已被其他商家账号使用' });
    }

    // 3. hash 密码
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. 创建账号
    const newUser = await prisma.merchantUser.create({
      data: {
        merchantId,
        email,
        passwordHash,
        name,
        role: role || 'OWNER',
        status: 'ACTIVE'
      }
    });

    res.json({ 
      success: true, 
      data: { id: newUser.id, email: newUser.email, name: newUser.name } 
    });
  } catch (error) {
    next(error);
  }
};

export const createHotelAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hotelId, email, password, name, role } = req.body;
    
    // 1. 确认主体存在
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) {
      return res.status(404).json({ success: false, message: '酒店主体不存在' });
    }

    // 2. 检查邮箱冲突 (只在 hotel_users 内查)
    const exists = await prisma.hotelUser.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ success: false, message: '该邮箱已被其他酒店账号使用' });
    }

    // 3. hash 密码
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. 创建账号
    const newUser = await prisma.hotelUser.create({
      data: {
        hotelId,
        email,
        passwordHash,
        name,
        role: role || 'OWNER',
        status: 'ACTIVE'
      }
    });

    res.json({ 
      success: true, 
      data: { id: newUser.id, email: newUser.email, name: newUser.name } 
    });
  } catch (error) {
    next(error);
  }
};
