export const mockData = {
  seller: {
    name: "Artisan Home & Living",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    description: "Curating beautiful home décor pieces and lifestyle products since 2015. Every item in our collection is handpicked to bring warmth and style to your space.",
    rating: 4.8,
    reviews: 2456,
    followers: 12543,
    categories: ["Home Décor", "Furniture", "Kitchen & Dining", "Gifts", "Textiles", "Lighting"],
    stories: [
      {
        id: 1,
        title: "Creating the Perfect Living Room",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
        excerpt: "Discover our top tips for creating a cozy and stylish living space..."
      },
      {
        id: 2,
        title: "Summer Collection 2024",
        image: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800&q=80",
        excerpt: "Explore our latest summer collection featuring bright colors and natural materials..."
      }
    ],
    lists: [
      {
        title: "Home Essentials Bundle",
        products: 12,
        image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80"
      },
      {
        title: "Perfect Gift Sets",
        products: 8,
        image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80"
      }
    ]
  },
  products: {
    bestSelling: [
      {
        id: 1,
        name: "Handwoven Basket Set",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
        rating: 4.9
      },
      {
        id: 2,
        name: "Ceramic Vase Collection",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
        rating: 4.8
      },
      {
        id: 3,
        name: "Minimalist Wall Clock",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1525973132219-a04334a76080?w=800&q=80",
        rating: 4.7
      },
      {
        id: 4,
        name: "Organic Cotton Throw",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80",
        rating: 4.9
      },
      {
        id: 5,
        name: "Bamboo Storage Box",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=800&q=80",
        rating: 4.6
      },
      {
        id: 6,
        name: "Artisan Coffee Table",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80",
        rating: 4.8
      },
      {
        id: 7,
        name: "Macrame Wall Hanging",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=800&q=80",
        rating: 4.7
      },
      {
        id: 8,
        name: "Scented Candle Set",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1602874801007-bd36c376cd00?w=800&q=80",
        rating: 4.9
      }
    ],
    recommended: [
      {
        id: 9,
        name: "Modern Table Lamp",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
        rating: 4.8
      },
      {
        id: 10,
        name: "Decorative Cushion Set",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80",
        rating: 4.7
      }
    ],
    byCategory: {
      "Home Décor": [
        {
          id: 11,
          name: "Abstract Wall Art",
          price: 199.99,
          image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80",
          rating: 4.9
        }
      ],
      "Furniture": [
        {
          id: 12,
          name: "Scandinavian Armchair",
          price: 399.99,
          image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
          rating: 4.8
        }
      ]
    }
  }
};