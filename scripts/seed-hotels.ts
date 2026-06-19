import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock hotels and rooms...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const mockHotels = [
    {
      name: 'Lotte Hotel Yangon',
      starRating: 5,
      description: 'Luxury hotel with spectacular views of Inya Lake.',
      contactPhone: '01 935 1000',
      addressLine: 'No. 82, Sin Phyu Shin Avenue, Pyay Road',
      city: 'Yangon',
      coverImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      userEmail: 'lotte@example.com',
      facilities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'WiFi'],
      rooms: [
        { name: 'Deluxe Room', description: 'Comfortable room with city view', basePrice: 150.00, maxOccupancy: 2, bedType: 'King', roomSizeSqm: 35, coverImageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&q=80' },
        { name: 'Premier Lake View', description: 'Stunning views of Inya Lake', basePrice: 200.00, maxOccupancy: 2, bedType: 'King', roomSizeSqm: 40, coverImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80' },
        { name: 'Club Suite', description: 'Spacious suite with club lounge access', basePrice: 350.00, maxOccupancy: 3, bedType: 'King', roomSizeSqm: 65, coverImageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&q=80' }
      ]
    },
    {
      name: 'Pan Pacific Yangon',
      starRating: 5,
      description: 'Sophisticated comfort in the heart of downtown Yangon.',
      contactPhone: '01 925 3810',
      addressLine: 'Corner of Bogyoke Aung San Road and Shwedagon Pagoda Road',
      city: 'Yangon',
      coverImageUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8373?w=800&q=80',
      userEmail: 'panpacific@example.com',
      facilities: ['Infinity Pool', 'Spa', 'Gym', 'Restaurant', 'Business Center'],
      rooms: [
        { name: 'Superior Room', description: 'Modern design with panoramic city views', basePrice: 130.00, maxOccupancy: 2, bedType: 'Queen', roomSizeSqm: 32, coverImageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80' },
        { name: 'Pacific Club Room', description: 'High floor with exclusive club privileges', basePrice: 180.00, maxOccupancy: 2, bedType: 'King', roomSizeSqm: 32, coverImageUrl: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=500&q=80' }
      ]
    },
    {
      name: 'Sedona Hotel Yangon',
      starRating: 4,
      description: 'Resort-style hotel near the majestic Shwedagon Pagoda.',
      contactPhone: '01 860 5377',
      addressLine: 'No. 1 Kabar Aye Pagoda Road, Yankin Township',
      city: 'Yangon',
      coverImageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?w=800&q=80',
      userEmail: 'sedona@example.com',
      facilities: ['Large Pool', 'Tennis Court', 'Gym', 'Shopping Arcade'],
      rooms: [
        { name: 'Superior Classic', description: 'Classic decor with modern amenities', basePrice: 95.00, maxOccupancy: 2, bedType: 'Twin', roomSizeSqm: 30, coverImageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&q=80' },
        { name: 'Inya Wing Premier', description: 'Newer wing with contemporary design', basePrice: 125.00, maxOccupancy: 2, bedType: 'King', roomSizeSqm: 34, coverImageUrl: 'https://images.unsplash.com/photo-1598928506311-c55d40e92231?w=500&q=80' }
      ]
    },
    {
      name: 'Aureum Palace Hotel & Resort',
      starRating: 5,
      description: 'Breathtaking resort set amidst the ancient temples of Bagan.',
      contactPhone: '061 246 0096',
      addressLine: 'Near Bagan Viewing Tower, Min Nanthu Village',
      city: 'Bagan',
      coverImageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
      userEmail: 'aureum@example.com',
      facilities: ['Pool', 'Spa', 'Cultural Show', 'Fine Dining', 'Bar'],
      rooms: [
        { name: 'Deluxe Temple View', description: 'Spacious room overlooking the pagodas', basePrice: 220.00, maxOccupancy: 2, bedType: 'King', roomSizeSqm: 50, coverImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80' },
        { name: 'Island Villa', description: 'Private villa surrounded by a lotus lake', basePrice: 380.00, maxOccupancy: 2, bedType: 'King', roomSizeSqm: 90, coverImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80' }
      ]
    }
  ];

  for (const mock of mockHotels) {
    const hotel = await prisma.hotel.create({
      data: {
        name: mock.name,
        starRating: mock.starRating,
        description: mock.description,
        contactPhone: mock.contactPhone,
        addressLine: mock.addressLine,
        city: mock.city,
        coverImageUrl: mock.coverImageUrl,
        facilities: mock.facilities,
        status: 'ACTIVE',
        isFeatured: mock.starRating >= 5
      }
    });

    console.log(`Created Hotel: ${hotel.name}`);

    await prisma.hotelUser.upsert({
      where: { email: mock.userEmail },
      update: {
        hotelId: hotel.id,
        passwordHash: hashedPassword,
        name: `${mock.name} Admin`,
        role: 'OWNER',
        status: 'ACTIVE'
      },
      create: {
        hotelId: hotel.id,
        email: mock.userEmail,
        passwordHash: hashedPassword,
        name: `${mock.name} Admin`,
        role: 'OWNER',
        status: 'ACTIVE'
      }
    });

    for (const room of mock.rooms) {
      await prisma.roomType.create({
        data: {
          hotelId: hotel.id,
          name: room.name,
          description: room.description,
          basePrice: room.basePrice,
          maxOccupancy: room.maxOccupancy,
          bedType: room.bedType,
          roomSizeSqm: room.roomSizeSqm,
          coverImageUrl: room.coverImageUrl,
          status: 'ACTIVE'
        }
      });
    }
    console.log(`  -> Added ${mock.rooms.length} room types.`);
  }

  console.log('\n✅ Hotel Seeding complete! You can now test the Stay module.');
}

main().catch(console.error).finally(() => prisma.$disconnect());