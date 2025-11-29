import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    throw new Error(`Image with id "${id}" not found.`);
  }
  return image;
};

export enum SiteServicePriceStates {
    Active = 1,
    Inactive = 2,
}

export const SiteServicePriceStatesEnum = [
    { value: SiteServicePriceStates.Active, label: 'Hoạt động' },
    { value: SiteServicePriceStates.Inactive, label: 'Ngưng hoạt động' },
];

export type Branch = {
    id: string;
    name: string;
    address: string;
}

export const branches: Branch[] = [
    { id: 'hcm', name: 'Chi nhánh Hồ Chí Minh', address: '123 Nguyễn Huệ, Quận 1, TP.HCM'},
    { id: 'hn', name: 'Chi nhánh Hà Nội', address: '456 Lê Thái Tổ, Hoàn Kiếm, Hà Nội'},
    { id: 'dn', name: 'Chi nhánh Đà Nẵng', address: '789 Bạch Đằng, Hải Châu, Đà Nẵng'}
];


export type BranchPrice = {
  branchId: string;
  price: number;
  status: 'Active' | 'Inactive';
};

export type Service = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  duration: number; // in minutes
  price: number;
  image: ImagePlaceholder;
  category: 'Cắt tóc' | 'Nhuộm màu' | 'Tạo kiểu' | 'Trị liệu';
  branchPricing: BranchPrice[];
};

export const services: Service[] = [
  {
    id: '1',
    name: 'Cắt tóc chính xác',
    description: 'Một kiểu cắt tóc phù hợp với phong cách của bạn.',
    longDescription: 'Cắt tóc chính xác của chúng tôi không chỉ là một lần cắt tỉa. Các nhà tạo mẫu chuyên nghiệp của chúng tôi sẽ tư vấn để tạo ra một diện mạo phù hợp với đường nét và lối sống của bạn. Bao gồm gội, cắt và sấy.',
    duration: 60,
    price: 80,
    image: getImage('service-haircut'),
    category: 'Cắt tóc',
    branchPricing: [
        { branchId: 'hcm', price: 85, status: 'Active' },
        { branchId: 'hn', price: 80, status: 'Active' },
        { branchId: 'dn', price: 75, status: 'Inactive' },
    ]
  },
  {
    id: '2',
    name: 'Nhuộm màu toàn bộ',
    description: 'Màu sắc rực rỡ, bao phủ toàn bộ.',
    longDescription: 'Thay đổi diện mạo của bạn với màu sắc rực rỡ, bao phủ toàn bộ. Chúng tôi sử dụng thuốc nhuộm cao cấp, lâu trôi giúp tóc bạn khỏe mạnh và bóng mượt. Lý tưởng để che tóc bạc hoặc thay đổi hoàn toàn màu tóc.',
    duration: 120,
    price: 150,
    image: getImage('service-coloring'),
    category: 'Nhuộm màu',
    branchPricing: [
        { branchId: 'hcm', price: 160, status: 'Active' },
        { branchId: 'hn', price: 150, status: 'Active' },
    ]
  },
  {
    id: '3',
    name: 'Tạo kiểu sự kiện',
    description: 'Các kiểu tóc búi và tạo kiểu thanh lịch cho những dịp đặc biệt.',
    longDescription: 'Trông thật tuyệt vời cho bất kỳ dịp đặc biệt nào. Dù là đám cưới, dạ tiệc hay bữa tiệc, các nhà tạo mẫu của chúng tôi sẽ tạo ra một kiểu tóc ấn tượng và bền đẹp suốt cả đêm.',
    duration: 75,
    price: 95,
    image: getImage('service-styling'),
    category: 'Tạo kiểu',
    branchPricing: []
  },
  {
    id: '4',
    name: 'Trị liệu dưỡng sâu',
    description: 'Hồi sinh và nuôi dưỡng mái tóc của bạn.',
    longDescription: 'Trị liệu dưỡng sâu của chúng tôi là một ngày spa cho mái tóc của bạn. Chúng tôi sử dụng một hỗn hợp tùy chỉnh các loại mặt nạ và dầu nuôi dưỡng để phục hồi hư tổn, cấp ẩm và tăng độ bóng mượt.',
    duration: 45,
    price: 65,
    image: getImage('service-treatment'),
    category: 'Trị liệu',
    branchPricing: [
        { branchId: 'hcm', price: 70, status: 'Active' },
    ]
  },
  {
    id: '5',
    name: 'Balayage',
    description: 'Những lọn tóc highlight tự nhiên như được nắng hôn.',
    longDescription: 'Đạt được vẻ ngoài đẹp, tự nhiên như được nắng hôn với dịch vụ balayage chuyên nghiệp của chúng tôi. Kỹ thuật vẽ tự do này tạo ra một sự chuyển màu mềm mại, tự nhiên về độ sáng ở phần ngọn tóc.',
    duration: 180,
    price: 250,
    image: getImage('service-coloring'),
    category: 'Nhuộm màu',
    branchPricing: []
  },
  {
    id: '6',
    name: 'Sấy tạo kiểu',
    description: 'Sấy khô chuyên nghiệp và tạo kiểu.',
    longDescription: 'Có được vẻ ngoài như vừa bước ra từ salon với dịch vụ sấy tạo kiểu chuyên nghiệp. Chúng tôi sẽ gội, sấy và tạo kiểu cho tóc của bạn một cách hoàn hảo, mang lại độ phồng và sự mềm mại kéo dài.',
    duration: 45,
    price: 55,
    image: getImage('service-styling'),
    category: 'Tạo kiểu',
    branchPricing: []
  },
];

export type StaffGroup = {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    serviceIds: string[];
}

export const staffGroups: StaffGroup[] = [
    { 
        id: 'senior-stylists', 
        name: 'Stylist cấp cao', 
        description: 'Nhóm các stylist có kinh nghiệm lâu năm, chuyên xử lý các kỹ thuật phức tạp.', 
        memberCount: 2,
        serviceIds: ['1', '2', '5'] 
    },
    { 
        id: 'junior-stylists', 
        name: 'Stylist trẻ', 
        description: 'Nhóm các stylist trẻ, tài năng và sáng tạo, chuyên các kiểu tóc hiện đại.', 
        memberCount: 1,
        serviceIds: ['1', '3', '6']
    },
    { 
        id: 'trainees', 
        name: 'Thực tập sinh', 
        description: 'Nhóm các bạn đang trong quá trình đào tạo, thực hiện các dịch vụ cơ bản.', 
        memberCount: 1,
        serviceIds: ['4', '6']
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
  branchId?: string;
  groupId?: string;
};

export const stylists: Stylist[] = [
  {
    id: 'emily-carter',
    name: 'Emily Carter',
    skills: ['Nhuộm màu', 'Balayage', 'Tóc dài'],
    rating: 4.9,
    reviews: 124,
    image: getImage('stylist-emily'),
    bio: 'Với hơn 10 năm kinh nghiệm, Emily là một chuyên gia về màu sắc, chuyên tạo ra những vẻ ngoài tự nhiên, như được nắng hôn. Cô ấy thích giúp khách hàng thể hiện cá tính qua mái tóc của họ.',
    branchId: 'hcm',
    groupId: 'senior-stylists'
  },
  {
    id: 'liam-johnson',
    name: 'Liam Johnson',
    skills: ['Cắt chính xác', 'Chăm sóc cho nam', 'Kiểu tóc ngắn'],
    rating: 4.8,
    reviews: 98,
    image: getImage('stylist-liam'),
    bio: 'Liam là một nghệ sĩ khi nói đến những đường cắt sắc sảo, có cấu trúc. Anh ấy có con mắt tinh tường đến từng chi tiết và xuất sắc trong cả kiểu tóc ngắn hiện đại và cổ điển cho cả nam và nữ.',
    branchId: 'hn',
    groupId: 'senior-stylists'
  },
  {
    id: 'olivia-chen',
    name: 'Olivia Chen',
    skills: ['Tạo kiểu sự kiện', 'Tóc búi', 'Tóc cô dâu'],
    rating: 5.0,
    reviews: 150,
    image: getImage('stylist-olivia'),
    bio: 'Olivia là chuyên gia của chúng tôi về tất cả những gì thanh lịch. Cô ấy tạo ra những kiểu tóc ngoạn mục cho đám cưới và các sự kiện đặc biệt, đảm bảo mọi khách hàng đều cảm thấy như hoàng gia trong ngày trọng đại của mình.',
    branchId: 'hcm',
    groupId: 'junior-stylists'
  },
  {
    id: 'noah-rodriguez',
    name: 'Noah Rodriguez',
    skills: ['Trị liệu tóc', 'Tóc xoăn', 'Chăm sóc da đầu'],
    rating: 4.9,
    reviews: 85,
    image: getImage('stylist-noah'),
    bio: 'Noah tin rằng mái tóc khỏe là mái tóc đẹp. Anh là chuyên gia về sức khỏe tóc và da đầu, chuyên về các phương pháp trị liệu cho mọi loại tóc, đặc biệt là tóc xoăn và tóc có kết cấu.',
    branchId: 'dn',
    groupId: 'trainees'
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
    text: 'Emily là một thiên tài về màu sắc! Mái tóc balayage của tôi chưa bao giờ đẹp hơn thế. Salon có một không gian thư giãn và đẹp đẽ.',
    rating: 5,
    service: 'Balayage',
  },
  {
    id: '2',
    name: 'Michael B.',
    text: 'Liam đã cho tôi một kiểu tóc tuyệt vời nhất trong nhiều năm qua. Anh ấy thực sự lắng nghe và biết mình đang làm gì. Rất khuyến khích.',
    rating: 5,
    service: 'Cắt tóc chính xác',
  },
  {
    id: '3',
    name: 'Sarah K.',
    text: 'Tôi đã đến Olivia để làm tóc cưới và cô ấy thật tuyệt vời. Kiểu tóc búi của tôi rất lộng lẫy và nó giữ được hoàn hảo cả ngày lẫn đêm. Cảm ơn bạn!',
    rating: 5,
    service: 'Tạo kiểu sự kiện',
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
    serviceName: 'Cắt tóc chính xác',
    stylistName: 'Liam Johnson',
    date: '2024-07-28',
    time: '10:00 SA',
    status: 'Confirmed',
    price: 80,
  },
  {
    id: 'BK002',
    customerName: 'Jordan Miller',
    customerEmail: 'jordan.m@example.com',
    serviceName: 'Nhuộm màu toàn bộ',
    stylistName: 'Emily Carter',
    date: '2024-07-28',
    time: '11:00 SA',
    status: 'Confirmed',
    price: 150,
  },
    {
    id: 'BK003',
    customerName: 'Casey Green',
    customerEmail: 'casey.g@example.com',
    serviceName: 'Sấy tạo kiểu',
    stylistName: 'Olivia Chen',
    date: '2024-07-28',
    time: '01:30 CH',
    status: 'Pending',
    price: 55,
  },
  {
    id: 'BK004',
    customerName: 'Taylor White',
    customerEmail: 'taylor.w@example.com',
    serviceName: 'Trị liệu dưỡng sâu',
    stylistName: 'Noah Rodriguez',
    date: '2024-07-27',
    time: '03:00 CH',
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
    time: '09:00 SA',
    status: 'Completed',
    price: 250,
  },
  {
    id: 'BK006',
    customerName: 'Chris Lee',
    customerEmail: 'chris.l@example.com',
    serviceName: 'Cắt tóc chính xác',
    stylistName: 'Liam Johnson',
    date: '2024-07-29',
    time: '02:00 CH',
    status: 'Cancelled',
    price: 80,
  },
  {
    id: 'BK007',
    customerName: 'Alex Smith',
    customerEmail: 'alex.s@example.com',
    serviceName: 'Nhuộm màu toàn bộ',
    stylistName: 'Emily Carter',
    date: '2024-07-15',
    time: '02:00 CH',
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
