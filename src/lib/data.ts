import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    throw new Error(`Image with id "${id}" not found.`);
  }
  return image;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  duration: number; // in minutes
  price: number;
  image: ImagePlaceholder;
  category: 'Haircut' | 'Coloring' | 'Styling' | 'Treatments';
};

export const services: Service[] = [
  {
    id: '1',
    name: 'Precision Haircut',
    description: 'A tailored haircut to suit your style.',
    longDescription: 'Our Precision Haircut is more than just a trim. Our expert stylists consult with you to create a look that complements your features and lifestyle. Includes a wash, cut, and blow-dry.',
    duration: 60,
    price: 80,
    image: getImage('service-haircut'),
    category: 'Haircut',
  },
  {
    id: '2',
    name: 'Full Color',
    description: 'Vibrant, all-over color.',
    longDescription: 'Transform your look with a vibrant, all-over color. We use premium, long-lasting dyes that leave your hair healthy and shining. Ideal for covering grays or a complete color change.',
    duration: 120,
    price: 150,
    image: getImage('service-coloring'),
    category: 'Coloring',
  },
  {
    id: '3',
    name: 'Event Styling',
    description: 'Elegant updos and styles for special occasions.',
    longDescription: 'Look your absolute best for any special occasion. Whether it\'s a wedding, gala, or party, our stylists will create a stunning and durable hairstyle that lasts all night.',
    duration: 75,
    price: 95,
    image: getImage('service-styling'),
    category: 'Styling',
  },
  {
    id: '4',
    name: 'Deep Conditioning Treatment',
    description: 'Revitalize and nourish your hair.',
    longDescription: 'Our Deep Conditioning Treatment is a spa day for your hair. We use a custom blend of nourishing masks and oils to repair damage, restore moisture, and add a brilliant shine.',
    duration: 45,
    price: 65,
    image: getImage('service-treatment'),
    category: 'Treatments',
  },
  {
    id: '5',
    name: 'Balayage',
    description: 'Sun-kissed, natural-looking highlights.',
    longDescription: 'Achieve a beautiful, sun-kissed look with our expert balayage service. This freehand painting technique creates a soft, natural gradation of lightness towards the ends.',
    duration: 180,
    price: 250,
    image: getImage('service-coloring'),
    category: 'Coloring',
  },
  {
    id: '6',
    name: 'Blowout',
    description: 'Professional blow-dry and styling.',
    longDescription: 'Get that fresh-from-the-salon look with a professional blowout. We\'ll wash, dry, and style your hair to perfection, giving you volume and smoothness that lasts.',
    duration: 45,
    price: 55,
    image: getImage('service-styling'),
    category: 'Styling',
  },
];

export type Stylist = {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  reviews: number;
  image: ImagePlaceholder;
  bio: string;
};

export const stylists: Stylist[] = [
  {
    id: 'emily-carter',
    name: 'Emily Carter',
    skills: ['Coloring', 'Balayage', 'Long Hair'],
    rating: 4.9,
    reviews: 124,
    image: getImage('stylist-emily'),
    bio: 'With over 10 years of experience, Emily is a master colorist who specializes in creating natural, sun-kissed looks. She loves helping clients express their personality through their hair.'
  },
  {
    id: 'liam-johnson',
    name: 'Liam Johnson',
    skills: ['Precision Cuts', 'Men\'s Grooming', 'Short Styles'],
    rating: 4.8,
    reviews: 98,
    image: getImage('stylist-liam'),
    bio: 'Liam is an artist when it comes to sharp, structured cuts. He has a keen eye for detail and excels in both modern and classic men\'s and women\'s short hairstyles.'
  },
  {
    id: 'olivia-chen',
    name: 'Olivia Chen',
    skills: ['Event Styling', 'Updos', 'Bridal Hair'],
    rating: 5.0,
    reviews: 150,
    image: getImage('stylist-olivia'),
    bio: 'Olivia is our go-to expert for all things elegant. She creates breathtaking styles for weddings and special events, ensuring every client feels like royalty on their big day.'
  },
  {
    id: 'noah-rodriguez',
    name: 'Noah Rodriguez',
    skills: ['Hair Treatments', 'Curly Hair', 'Scalp Care'],
    rating: 4.9,
    reviews: 85,
    image: getImage('stylist-noah'),
    bio: 'Noah believes healthy hair is beautiful hair. He is an expert in hair and scalp health, specializing in treatments for all hair types, particularly curly and textured hair.'
  },
];

export type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  service: string;
};

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Jessica L.',
    text: 'Emily is a color genius! My balayage has never looked better. The salon has such a relaxing and beautiful atmosphere.',
    rating: 5,
    service: 'Balayage',
  },
  {
    id: '2',
    name: 'Michael B.',
    text: 'Liam gave me the best haircut I\'ve had in years. He really listens and knows what he\'s doing. Highly recommend.',
    rating: 5,
    service: 'Precision Haircut',
  },
  {
    id: '3',
    name: 'Sarah K.',
    text: 'I went to Olivia for my wedding hair and she was incredible. My updo was stunning and it held perfectly all day and night. Thank you!',
    rating: 5,
    service: 'Event Styling',
  },
];

export type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  stylistName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
  price: number;
};

export const bookings: Booking[] = [
  {
    id: 'BK001',
    customerName: 'Alex Smith',
    customerEmail: 'alex.s@example.com',
    serviceName: 'Precision Haircut',
    stylistName: 'Liam Johnson',
    date: '2024-07-28',
    time: '10:00 AM',
    status: 'Confirmed',
    price: 80,
  },
  {
    id: 'BK002',
    customerName: 'Jordan Miller',
    customerEmail: 'jordan.m@example.com',
    serviceName: 'Full Color',
    stylistName: 'Emily Carter',
    date: '2024-07-28',
    time: '11:00 AM',
    status: 'Confirmed',
    price: 150,
  },
    {
    id: 'BK003',
    customerName: 'Casey Green',
    customerEmail: 'casey.g@example.com',
    serviceName: 'Blowout',
    stylistName: 'Olivia Chen',
    date: '2024-07-28',
    time: '01:30 PM',
    status: 'Pending',
    price: 55,
  },
  {
    id: 'BK004',
    customerName: 'Taylor White',
    customerEmail: 'taylor.w@example.com',
    serviceName: 'Deep Conditioning Treatment',
    stylistName: 'Noah Rodriguez',
    date: '2024-07-27',
    time: '03:00 PM',
    status: 'Completed',
    price: 65,
  },
    {
    id: 'BK005',
    customerName: 'Jamie Brown',
    customerEmail: 'jamie.b@example.com',
    serviceName: 'Balayage',
    stylistName: 'Emily Carter',
    date: '2024-07-26',
    time: '09:00 AM',
    status: 'Completed',
    price: 250,
  },
  {
    id: 'BK006',
    customerName: 'Chris Lee',
    customerEmail: 'chris.l@example.com',
    serviceName: 'Precision Haircut',
    stylistName: 'Liam Johnson',
    date: '2024-07-29',
    time: '02:00 PM',
    status: 'Cancelled',
    price: 80,
  },
  {
    id: 'BK007',
    customerName: 'Alex Smith',
    customerEmail: 'alex.s@example.com',
    serviceName: 'Full Color',
    stylistName: 'Emily Carter',
    date: '2024-07-15',
    time: '02:00 PM',
    status: 'Completed',
    price: 150,
  },
];

export type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    totalBookings: number;
    totalSpent: number;
    walletBalance: number;
};

const customerData = [
  { name: 'Alex Smith', email: 'alex.s@example.com', phone: '(123) 456-7890', joinDate: '2024-01-15' },
  { name: 'Jordan Miller', email: 'jordan.m@example.com', phone: '(234) 567-8901', joinDate: '2024-02-20' },
  { name: 'Casey Green', email: 'casey.g@example.com', phone: '(345) 678-9012', joinDate: '2024-03-10' },
  { name: 'Taylor White', email: 'taylor.w@example.com', phone: '(456) 789-0123', joinDate: '2024-04-05' },
  { name: 'Jamie Brown', email: 'jamie.b@example.com', phone: '(567) 890-1234', joinDate: '2024-05-25' },
  { name: 'Chris Lee', email: 'chris.l@example.com', phone: '(678) 901-2345', joinDate: '2024-06-18' },
];

export const customers: Customer[] = customerData.map((customer, index) => {
    const customerBookings = bookings.filter(b => b.customerEmail === customer.email && b.status === 'Completed');
    const totalSpent = customerBookings.reduce((sum, b) => sum + b.price, 0);
    return {
        id: `CUST-00${index + 1}`,
        ...customer,
        totalBookings: bookings.filter(b => b.customerEmail === customer.email).length,
        totalSpent,
        walletBalance: Math.random() * 50 // Random wallet balance between 0 and 50
    };
});
