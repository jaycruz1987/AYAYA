export interface UserAddress {
  id: string;
  userId: string;
  contactName: string;
  contactPhone: string;
  addressLine: string;
  city?: string | null;
  township?: string | null;
  landmark?: string | null;
  buildingName?: string | null;
  floor?: string | null;
  roomNo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
