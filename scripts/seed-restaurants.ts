import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock restaurants and menus...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Define some mock restaurants
  const mockMerchants = [
    {
      name: 'Burger King Yangon',
      contactPhone: '09123456701',
      address: 'Downtown Yangon',
      description: 'The home of the Whopper.',
      status: 'ACTIVE',
      userEmail: 'bk@example.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', // Burger restaurant
      categories: ['Burgers', 'Fast Food', 'Drinks'],
      products: [
        { name: 'Whopper Meal', description: 'Classic Whopper with fries and drink', price: 12.99, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
        { name: 'Cheeseburger', description: 'Simple and delicious', price: 5.99, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&q=80' },
        { name: 'Chicken Royale', description: 'Crispy chicken sandwich', price: 8.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80' },
        { name: 'Onion Rings', description: 'Crispy fried onion rings', price: 3.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80' },
        { name: 'Coca Cola Large', description: 'Refreshing cold drink', price: 2.00, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80' }
      ]
    },
    {
      name: 'Sushi Tei',
      contactPhone: '09123456702',
      address: 'Junction City, Yangon',
      description: 'Premium Japanese Sushi & Sashimi.',
      status: 'ACTIVE',
      userEmail: 'sushi@example.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', // Sushi restaurant
      categories: ['Sushi', 'Japanese', 'Seafood'],
      products: [
        { name: 'Salmon Sashimi (5pcs)', description: 'Fresh Norwegian salmon', price: 18.00, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&q=80' },
        { name: 'California Roll', description: 'Crab meat, avocado, cucumber', price: 14.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80' },
        { name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo', price: 16.00, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=80' },
        { name: 'Miso Soup', description: 'Traditional Japanese soup', price: 4.00, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4b43b485f?w=500&q=80' },
        { name: 'Green Tea', description: 'Hot Japanese green tea', price: 2.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&q=80' }
      ]
    },
    {
      name: 'Pizza Hut Express',
      contactPhone: '09123456703',
      address: 'Myanmar Plaza',
      description: 'Fresh hot pizza delivered fast.',
      status: 'ACTIVE',
      userEmail: 'pizza@example.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', // Pizza restaurant
      categories: ['Pizza', 'Italian', 'Snacks'],
      products: [
        { name: 'Pepperoni Pizza (Large)', description: 'Classic pepperoni with extra cheese', price: 22.00, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
        { name: 'Hawaiian Pizza (Medium)', description: 'Pineapple and ham', price: 18.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
        { name: 'Garlic Bread', description: 'Oven baked with garlic butter', price: 5.00, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80' },
        { name: 'BBQ Chicken Wings (6pcs)', description: 'Spicy and sweet wings', price: 9.99, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&q=80' }
      ]
    },
    {
      name: 'Shan Yoe Yar',
      contactPhone: '09123456704',
      address: 'Bahan Township',
      description: 'Authentic Shan Cuisine.',
      status: 'ACTIVE',
      userEmail: 'shan@example.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', // Asian noodles restaurant
      categories: ['Local', 'Shan', 'Noodles'],
      products: [
        { name: 'Shan Noodles', description: 'Traditional Shan style noodles with chicken', price: 6.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1552611052-3ba9d737a563?w=500&q=80' },
        { name: 'Tofu Nwe', description: 'Warm Shan tofu soup', price: 4.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4b43b485f?w=500&q=80' },
        { name: 'Pork Dumplings', description: 'Steamed dumplings with chili oil', price: 5.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&q=80' },
        { name: 'Shan Papaya Salad', description: 'Spicy and sour salad', price: 4.00, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1512621843614-b3e189922864?w=500&q=80' }
      ]
    }
  ];

  for (const mock of mockMerchants) {
    // Create Merchant
    const merchant = await prisma.merchant.create({
      data: {
        name: mock.name,
        contactPhone: mock.contactPhone,
        addressLine: mock.address,
        description: mock.description,
        status: mock.status as any,
        coverImageUrl: mock.coverImageUrl,
      }
    });

    console.log(`Created Restaurant: ${merchant.name}`);

    // Create Merchant User
    await prisma.merchantUser.upsert({
      where: { email: mock.userEmail },
      update: {
        merchantId: merchant.id,
        passwordHash: hashedPassword,
        name: `${mock.name} Admin`,
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      create: {
        merchantId: merchant.id,
        email: mock.userEmail,
        passwordHash: hashedPassword,
        name: `${mock.name} Admin`,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    // Create Categories
    for (const catName of mock.categories) {
      await prisma.productCategory.create({
        data: {
          merchantId: merchant.id,
          name: catName,
        }
      });
    }

    // Fetch the created categories for this merchant
    const createdCategories = await prisma.productCategory.findMany({
      where: { merchantId: merchant.id }
    });

    if (createdCategories.length > 0) {
      for (let i = 0; i < mock.products.length; i++) {
        const prod = mock.products[i];
        // Distribute products across categories evenly
        const cat = createdCategories[i % createdCategories.length];
        
        await prisma.product.create({
          data: {
            merchantId: merchant.id,
            categoryId: cat.id,
            name: prod.name,
            description: prod.description,
            price: prod.price,
            imageUrl: prod.imageUrl,
            status: prod.isAvailable ? 'ACTIVE' : 'INACTIVE'
          }
        });
      }
      console.log(`  -> Added ${mock.products.length} menu items across ${createdCategories.length} categories.`);
    }
  }

  console.log('\n✅ Seeding complete! You can now test with these restaurants.');
}

main().catch(console.error).finally(() => prisma.$disconnect());