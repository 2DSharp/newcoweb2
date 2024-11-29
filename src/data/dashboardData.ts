export const dashboardData = {
  storeName: "Artisan Home & Living",
  storeRating: 4.8,
  analytics: {
    revenue: {
      value: 124500,
      trend: 12.5
    },
    orders: {
      value: 856,
      trend: 8.2
    },
    customers: {
      value: 2435,
      trend: 15.3
    },
    satisfaction: {
      value: 98,
      trend: 2.1
    }
  },
  revenueData: [
    { date: "Jan", revenue: 45000, orders: 412 },
    { date: "Feb", revenue: 52000, orders: 478 },
    { date: "Mar", revenue: 61000, orders: 523 },
    { date: "Apr", revenue: 58000, orders: 498 },
    { date: "May", revenue: 63000, orders: 534 },
    { date: "Jun", revenue: 72000, orders: 589 },
    { date: "Jul", revenue: 78000, orders: 612 }
  ],
  topProducts: [
    {
      id: 1,
      name: "Handwoven Basket Set",
      sales: 245,
      trend: 12,
      revenue: 22050,
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80"
    },
    {
      id: 2,
      name: "Ceramic Vase Collection",
      sales: 189,
      trend: 8,
      revenue: 24570,
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80"
    },
    {
      id: 3,
      name: "Minimalist Wall Clock",
      sales: 176,
      trend: -3,
      revenue: 10560,
      image: "https://images.unsplash.com/photo-1525973132219-a04334a76080?w=800&q=80"
    },
    {
      id: 4,
      name: "Organic Cotton Throw",
      sales: 156,
      trend: 5,
      revenue: 12480,
      image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80"
    }
  ],
  recentOrders: [
    {
      id: "ORD-2024-1234",
      customer: "Sarah Johnson",
      date: "2024-02-28T10:30:00",
      amount: 289.99,
      status: "delivered",
      items: 3
    },
    {
      id: "ORD-2024-1235",
      customer: "Michael Chen",
      date: "2024-02-28T09:15:00",
      amount: 159.99,
      status: "shipped",
      items: 2
    },
    {
      id: "ORD-2024-1236",
      customer: "Emma Davis",
      date: "2024-02-28T08:45:00",
      amount: 349.99,
      status: "processing",
      items: 4
    },
    {
      id: "ORD-2024-1237",
      customer: "James Wilson",
      date: "2024-02-28T08:00:00",
      amount: 129.99,
      status: "pending",
      items: 1
    }
  ],
  customerInsights: {
    newCustomers: 856,
    returningCustomers: 1579,
    customerSegments: [
      { name: "Premium", value: 35 },
      { name: "Regular", value: 45 },
      { name: "Occasional", value: 20 }
    ]
  }
};