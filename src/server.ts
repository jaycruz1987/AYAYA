import app from './app';
import { prisma } from './config/database';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    // Test database connection before starting server
    await prisma.$connect();
    console.log('✅ Database connection established successfully.');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await prisma.$disconnect();
        console.log('Database connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('❌ Unable to start the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();