export const ordersData = [
  {
    id: "ORD-2024-1234",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 123-4567"
    },
    date: "2024-02-28T10:30:00",
    items: [
      {
        id: 1,
        productId: 1,
        productName: "Handwoven Basket Set",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
        quantity: 2,
        processedQuantity: 0,
        price: 89.99,
        customization: "Please add a personalized tag with 'The Johnson Family'",
        isCustomizationVerified: false
      },
      {
        id: 2,
        productId: 2,
        productName: "Ceramic Vase Collection",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
        quantity: 1,
        processedQuantity: 0,
        price: 129.99,
        isCustomizationVerified: true
      }
    ],
    status: "processing",
    amount: 289.99,
    shippingAddress: {
      street: "123 Main St",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "United States"
    }
  },
  {
    id: "ORD-2024-1235",
    customer: {
      name: "Michael Chen",
      email: "michael.c@example.com",
      phone: "+1 (555) 234-5678"
    },
    date: "2024-02-28T09:15:00",
    items: [
      {
        id: 3,
        productId: 3,
        productName: "Minimalist Wall Clock",
        image: "https://images.unsplash.com/photo-1525973132219-a04334a76080?w=800&q=80",
        quantity: 1,
        processedQuantity: 0,
        price: 59.99,
        isCustomizationVerified: true
      },
      {
        id: 4,
        productId: 4,
        productName: "Organic Cotton Throw",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80",
        quantity: 2,
        processedQuantity: 0,
        price: 49.99,
        customization: "Please include gift wrapping",
        isCustomizationVerified: false
      }
    ],
    status: "pending",
    amount: 159.99,
    shippingAddress: {
      street: "456 Oak Lane",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    }
  }
];