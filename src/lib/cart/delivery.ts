export type DeliveryMethodId = 'HOME_DELIVERY' | 'STORE_PICKUP' | 'EXPRESS';

export const DELIVERY_OPTIONS: {
  id: DeliveryMethodId;
  label: string;
  fee: number;
}[] = [
  { id: 'HOME_DELIVERY', label: 'Home Delivery', fee: 60 },
  { id: 'STORE_PICKUP', label: 'Store Pickup', fee: 0 },
  { id: 'EXPRESS', label: 'Request Express', fee: 150 },
];

export function getDeliveryFee(method: DeliveryMethodId): number {
  return DELIVERY_OPTIONS.find((o) => o.id === method)?.fee ?? 60;
}

/** Common Bangladesh districts for checkout dropdown */
export const BD_DISTRICTS = [
  'Dhaka - City',
  'Dhaka - Outside',
  'Gazipur',
  'Narayanganj',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Cumilla',
  'Bogura',
  'Jessore',
  'Other',
] as const;
