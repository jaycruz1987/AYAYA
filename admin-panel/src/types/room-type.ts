export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  description: string | null;
  basePrice: number;
  maxOccupancy: number; // Changed from capacity
  bedType: string | null;
  roomSizeSqm: number | null;
  facilities: string[] | null;
  coverImageUrl: string | null; // Added
  imageUrls: string[] | null; // Changed from images
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
