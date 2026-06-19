import { TokenPayload } from '../utils/jwt.util';

export interface BaseJwtPayload {
  userId: string;
  userType: 'merchant' | 'hotel' | 'admin' | 'customer';
}

export interface MerchantJwtPayload extends BaseJwtPayload {
  userType: 'merchant';
  merchantId: string;
}

export interface HotelJwtPayload extends BaseJwtPayload {
  userType: 'hotel';
  hotelId: string;
}

declare global {
  namespace Express {
    interface Request {
      // 联合类型，在具体的 middleware 中会被断言为更具体的类型
      user?: MerchantJwtPayload | HotelJwtPayload | TokenPayload | any; 
    }
  }
}
