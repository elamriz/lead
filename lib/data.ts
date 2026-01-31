export type Product = {
    id: string;
    name: string;
    category: "Store" | "PC" | "Component" | "Laptop" | "Accessory";
    price: number;
    originalPrice?: number;
    image: string;
    specs: Record<string, string>;
    description: string;
    isNew?: boolean;
};

export const products: Product[] = [
    // --- Laptops ---
    {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "MacBook Pro 16\" M3 Max",
        category: "Laptop",
        price: 3499,
        originalPrice: 3999,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000",
        description: "The most powerful MacBook Pro ever. Features the blazing fast M3 Max chip, a stunning Liquid Retina XDR display, and up to 22 hours of battery life.",
        specs: { "Chip": "M3 Max (16-core CPU)", "RAM": "48GB Unified", "Storage": "1TB SSD", "Display": "16.2\" XDR 120Hz" },
        isNew: true
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Dell XPS 15 OLED",
        category: "Laptop",
        price: 1899,
        originalPrice: 2299,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=1000",
        description: "Immersive 3.5K OLED touchscreen display in a precision-crafted aluminum chassis. The perfect balance of power and portability.",
        specs: { "CPU": "Intel Core i9-13900H", "GPU": "RTX 4060 8GB", "RAM": "32GB DDR5", "Screen": "15.6\" 3.5K OLED" },
        isNew: false
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Razer Blade 14 (2024)",
        category: "Laptop",
        price: 2699.99,
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1000",
        description: "The world's most portable gaming laptop. Powered by AMD Ryzen 9 and NVIDIA graphics for desktop-class performance on the go.",
        specs: { "CPU": "Ryzen 9 7940HS", "GPU": "RTX 4070", "RAM": "16GB DDR5", "Display": "14\" QHD+ 240Hz" },
        isNew: true
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440004",
        name: "Lenovo ThinkPad X1 Carbon Gen 11",
        category: "Laptop",
        price: 1499,
        originalPrice: 2199,
        image: "https://images.unsplash.com/photo-1527435735055-b060dcd883ca?auto=format&fit=crop&q=80&w=1000",
        description: "Ultralight, ultra-powerful. The gold standard for business computing with military-grade durability and all-day battery life.",
        specs: { "CPU": "Intel Core i7-1355U", "RAM": "16GB LPDDR5", "Weight": "1.12kg", "Connect": "5G Optional" },
        isNew: false
    },

    // --- PCs (Desktops/Gaming) ---
    {
        id: "550e8400-e29b-41d4-a716-446655440005",
        name: "Alienware Aurora R16",
        category: "PC",
        price: 2999,
        image: "https://images.unsplash.com/photo-1587202372775-d229f6515c3c?auto=format&fit=crop&q=80&w=1000",
        description: "Legendary design, optimized for airflow. Experience 4K gaming with the latest NVIDIA graphics and liquid cooling.",
        specs: { "GPU": "RTX 4080 Super", "CPU": "Intel Core i9-14900KF", "RAM": "32GB DDR5", "Cooling": "240mm Liquid" },
        isNew: true
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440006",
        name: "Corsair One i500",
        category: "PC",
        price: 3499,
        originalPrice: 3999,
        image: "https://images.unsplash.com/photo-1595327656903-2f54e37ce09b?auto=format&fit=crop&q=80&w=1000",
        description: "Compact workstation power. Incredible performance in a small footprint, perfect for creators and gamers alike.",
        specs: { "GPU": "RTX 4090", "CPU": "Intel Core i9-14900K", "RAM": "64GB DDR5", "Storage": "2TB NVMe" },
        isNew: false
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440007",
        name: "Studio Mac Pro Rack",
        category: "PC",
        price: 6999,
        image: "https://images.unsplash.com/photo-1614624532983-4ce030134718?auto=format&fit=crop&q=80&w=1000",
        description: "For those who change the world. Infinite expandability and performance for heavy video editing and 3D rendering.",
        specs: { "Chip": "M2 Ultra", "RAM": "192GB Unified", "Storage": "4TB SSD", "Expansion": "7 PCIe slots" },
        isNew: false
    },

    // --- Components (GPUs/CPUs) ---
    {
        id: "550e8400-e29b-41d4-a716-446655440008",
        name: "NVIDIA GeForce RTX 4090 Founders Edition",
        category: "Component",
        price: 1599,
        originalPrice: 1999,
        image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/NVIDIA_RTX_4090_Founders_Edition_-_Verpackung_%28ZMASLO%29.png",
        description: "The ultimate GeForce GPU. It brings a huge leap in performance, efficiency, and AI-powered graphics. Experience ultra-high performance gaming.",
        specs: { "VRAM": "24GB GDDR6X", "Cores": "16384 CUDA", "Boost Clock": "2.52 GHz", "Power": "450W" },
        isNew: true
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440009",
        name: "AMD Ryzen 7 7800X3D",
        category: "Component",
        price: 399,
        originalPrice: 449,
        image: "https://images.unsplash.com/photo-1555618525-45a7044c062a?auto=format&fit=crop&q=80&w=1000",
        description: "The dominant gaming processor. Features AMD 3D V-Cache technology for low latency and incredible game performance.",
        specs: { "Cores": "8", "Threads": "16", "Cache": "104MB", "TDP": "120W" },
        isNew: false
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "Samsung 990 PRO 2TB NVMe",
        category: "Component",
        price: 179,
        image: "https://images.unsplash.com/photo-1628133287895-c9c05988e404?auto=format&fit=crop&q=80&w=1000",
        description: "Reach the max performance of PCIe 4.0. Delivers long-lasting high speeds for hardcore gaming and professional work.",
        specs: { "Capacity": "2TB", "Read Speed": "7450 MB/s", "Write Speed": "6900 MB/s", "Form Factor": "M.2 2280" },
        isNew: false
    },

    // --- Accessories ---
    {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "Logitech MX Master 3S",
        category: "Accessory",
        price: 99.99,
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Logitech_MX_Master_3S_HS01.jpg",
        description: "Meet the master. An icon remastered with quiet clicks and 8K DPI any-surface tracking.",
        specs: { "DPI": "8000", "Buttons": "7", "Battery": "70 days", "Connectivity": "Bluetooth & Bolt" },
        isNew: true
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440012",
        name: "Keychron Q1 Pro Wireless",
        category: "Accessory",
        price: 199,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000",
        description: "Fully assembled QMK/VIA wireless custom mechanical keyboard. Full aluminum body with a premium typing experience.",
        specs: { "Layout": "75%", "Switches": "Keychron K Pro Red", "Keycaps": "PBT", "Case": "Aluminum" },
        isNew: false
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440013",
        name: "Apple Studio Display - Nano-texture",
        category: "Accessory",
        price: 1899,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000",
        description: "A captivating 5K Retina display. 12MP Ultra Wide camera with Center Stage. Studio-quality mics. And six speakers.",
        specs: { "Resolution": "5120 x 2880", "Brightness": "600 nits", "Color": "P3 Wide Color", "Ports": "1x TB3, 3x USB-C" },
        isNew: true
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440014",
        name: "Sony WH-1000XM5",
        category: "Accessory",
        price: 348,
        originalPrice: 399,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000",
        description: "Industry-leading noise canceling headphones with Auto NC Optimizer and crystal clear hands-free calling.",
        specs: { "Battery": "30 Hrs", "Drivers": "30mm", "Features": "LDAC, DSEE Extreme", "Weight": "250g" },
        isNew: false
    }
];
