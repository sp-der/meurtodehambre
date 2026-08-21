export type LocationKey = 'san-bernardino' | 'lawndale';

export type RestaurantLocation = {
  key: LocationKey;
  city: string;
  label: string;
  address: string;
  mapQuery: string;
  mapsUrl: string;
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
    // Exact restaurant coordinates from the official Google Maps listing.
    mapQuery: '34.1027557,-117.2479274',
    mapsUrl:
      'https://www.google.com/maps/place/Muerto+de+Hambre+Grill/@34.1027601,-117.2505077,17z/data=!3m1!4b1!4m6!3m5!1s0x80c3531c2a4d4ec5:0x4699bbfb96a1ae61!8m2!3d34.1027557!4d-117.2479274!16s%2Fg%2F11ys2k7bc9?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDgxNy4wIKXMDSoASAFQAw%3D%3D',
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
    // Exact coordinates from the Google Maps page supplied for 16711 Hawthorne Blvd.
    mapQuery: '33.8788692,-118.3529064',
    mapsUrl:
      'https://www.google.com/maps/place/16711+Hawthorne+Blvd,+Lawndale,+CA+90260/@33.8788736,-118.3554867,17z/data=!3m1!4b1!4m6!3m5!1s0x80c2b4566574a5a7:0x341ee7879f421099!8m2!3d33.8788692!4d-118.3529064!16s%2Fg%2F11bw435529?entry=ttu&g_ep=EgoyMDI2MDgxNy4wIKXMDSoASAFQAw%3D%3D',
    orderUrl:
      'https://order.tryotter.com/s/muerto-de-hambre-grill/16711-hawthorne-blvd-lawndale/534bb216-8cdf-4f8e-80ac-58ea85103389',
    hours: [
      { days: 'Monday', hours: '10:00 AM – 8:00 PM' },
      { days: 'Tuesday', hours: '10:00 AM – 8:00 PM' },
      { days: 'Wednesday', hours: '10:00 AM – 8:00 PM' },
      { days: 'Thursday', hours: '10:00 AM – 8:00 PM' },
      { days: 'Friday', hours: '10:00 AM – 8:00 PM' },
      { days: 'Saturday', hours: 'Closed' },
      { days: 'Sunday', hours: 'Closed' },
    ],
    badge: 'Now serving lunch Mon–Fri',
  },
];
