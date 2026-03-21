import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AppError } from '../middlewares/error.middleware';
import { generateToken } from '../utils/jwt.util';
import { RegisterUserInput, LoginUserInput, RegisterAdminInput, LoginAdminInput } from '../dtos/auth.dto';

const prisma = new PrismaClient();

export class AuthService {
  // ==========================================
  // C-End User Auth
  // ==========================================
  async registerUser(data: RegisterUserInput) {
    const { email, phone, password, nickname } = data;

    // Check if user exists
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) throw new AppError('Email already registered', 409);
    }
    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) throw new AppError('Phone already registered', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password_hash,
        nickname,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        nickname: true,
        avatar_url: true,
        status: true,
        createdAt: true,
      }
    });

    const token = generateToken({ id: user.id, type: 'user' });

    return { user, token };
  }

  async loginUser(data: LoginUserInput) {
    const { emailOrPhone, password } = data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone }
        ],
        deletedAt: null
      }
    });

    if (!user || !user.password_hash) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError('Account is not active', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({ id: user.id, type: 'user' });

    // Exclude password from response
    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // ==========================================
  // B-End Admin Auth
  // ==========================================
  async registerAdmin(data: RegisterAdminInput) {
    const { name, email, phone, password, role } = data;

    const existingAdmin = await prisma.adminUser.findUnique({ where: { email } });
    if (existingAdmin) throw new AppError('Admin email already registered', 409);

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const admin = await prisma.adminUser.create({
      data: {
        name,
        email,
        phone,
        password_hash,
        role: role || 'ADMIN',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });

    const token = generateToken({ id: admin.id, role: admin.role, type: 'admin' });

    return { admin, token };
  }

  async loginAdmin(data: LoginAdminInput) {
    const { email, password } = data;

    const admin = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!admin) {
      throw new AppError('Invalid credentials', 401);
    }

    if (admin.status !== 'ACTIVE') {
      throw new AppError('Admin account is not active', 403);
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({ id: admin.id, role: admin.role, type: 'admin' });

    const { password_hash, ...adminWithoutPassword } = admin;

    return { admin: adminWithoutPassword, token };
  }
}
