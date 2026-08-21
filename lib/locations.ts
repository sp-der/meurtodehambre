export type LocationKey = 'san-bernardino' | 'lawndale';

export type RestaurantLocation = {
  key: LocationKey;
  city: string;
  label: string;
  address: string;
  mapQuery: string;
  orderUrl: string;
  hours: { days: string; hours: string; note?: string }[];
  badge?: string;
};

export const locations: RestaurantLocation[] = [
  {
    key: 'san-bernardino',
    city: 'San Bernardino',
    label: 'San Bernardino',
    address: '195 N Leland Norton Dr, San Bernardino, CA',
    // Google resolves the street address close to the airport, so target the restaurant listing by name + city.
    mapQuery: 'Muerto De Hambre Grill, San Bernardino, CA',
    // Temporary: replace with the new San Bernardino Otter link when it is issued.
    orderUrl:
      'https://order.tryotter.com/s/muerto-de-hambre-grill/762-n-mulberry-ave%2C-rialto%2C-ca-92376%2C-usa-rialto/68b424a7-34b8-4170-ba79-96ac63d1f92d',
    hours: [
      { days: 'Monday', hours: 'Closed' },
      { days: 'Tuesday', hours: 'Closed' },
      { days: 'Wednesday – Friday', hours: '2:00 PM – 8:00 PM', note: 'Break 4:30 – 5:30 PM' },
      { days: 'Saturday', hours: '2:00 PM – 8:00 PM', note: 'Break 4:30 – 5:30 PM' },
      { days: 'Sunday', hours: '4:00 PM – 8:00 PM' },
    ],
  },
  {
    key: 'lawndale',
    city: 'Lawndale',
    label: 'Lawndale',
    address: '16711 Hawthorne Blvd, Lawndale, CA 90260',
    mapQuery: 'Muerto De Hambre Grill, 16711 Hawthorne Blvd, Lawndale, CA 90260',
    orderUrl:
      'https://order.tryotter.com/s/muerto-de-hambre-grill/16711-hawthorne-blvd-lawndale/534bb216-8cdf-4f8e-80ac-58ea85103389',
    hours: [
      { days: 'Monday – Friday', hours: '10:00 AM – 8:00 PM' },
      { days: 'Saturday – Sunday', hours: 'Coming Soon' },
    ],
    badge: 'Now serving lunch Mon–Fri',
  },
];
