import Image from 'next/image'

const products = [
  { id: 1, name: "Vintage Camera", price: "129.99", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 2, name: "Leather Backpack", price: "89.99", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 3, name: "Wireless Earbuds", price: "79.99", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 4, name: "Smart Watch", price: "199.99", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 5, name: "Polaroid Camera", price: "59.99", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 6, name: "Vintage Typewriter", price: "149.99", image: "https://images.unsplash.com/photo-1558000143-a78f8299c40b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 7, name: "Desk Lamp", price: "39.99", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 8, name: "Wooden Chair", price: "89.99", image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 9, name: "Macbook Pro", price: "1299.99", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 10, name: "Succulent Plant", price: "24.99", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 11, name: "Wall Clock", price: "49.99", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 12, name: "Headphones", price: "159.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 13, name: "Desk Organizer", price: "29.99", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 14, name: "Leather Wallet", price: "39.99", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 15, name: "Sunglasses", price: "89.99", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 16, name: "Wrist Watch", price: "199.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 17, name: "Sneakers", price: "79.99", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 18, name: "Coffee Mug", price: "14.99", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 19, name: "Portable Speaker", price: "69.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 20, name: "Notebook", price: "9.99", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 21, name: "Desk Chair", price: "149.99", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 22, name: "Wireless Mouse", price: "29.99", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 23, name: "Desk Plant", price: "19.99", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 24, name: "Wireless Keyboard", price: "59.99", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 25, name: "Desk Pad", price: "24.99", image: "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 26, name: "Wireless Charger", price: "34.99", image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
  { id: 27, name: "Desk Lamp", price: "49.99", image: "https://images.unsplash.com/photo-1534281305526-c66b8e68dfbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=400&q=80", orientation: "portrait" },
  { id: 28, name: "Desk Fan", price: "29.99", image: "https://images.unsplash.com/photo-1593110907225-d8d4c97c1b73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80", orientation: "square" },
]

export default function ProductCollage({heading}: {heading: string}) {
  // For mobile view (2 columns), we'll reorganize the products
  const mobileLeftColumn = products.slice(0, products.length / 2);
  const mobileRightColumn = products.slice(products.length / 2);
  
  // Desktop view (4 columns) remains the same
  const leftColumn = products.slice(0, 8);
  const middleColumns = products.slice(8, 20);
  const rightColumn = products.slice(20, 28);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{heading}</h2>
      
      {/* Mobile Layout (2 columns) */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        <div className="space-y-4">
          {mobileLeftColumn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="space-y-4">
          {mobileRightColumn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Desktop Layout (4 columns) */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        <div className="space-y-4">
          {leftColumn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {middleColumns.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="space-y-4">
          {rightColumn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <div className="relative overflow-hidden rounded-lg group">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={product.orientation === 'portrait' ? 400 : 300}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-white text-sm">${product.price}</p>
      </div>
    </div>
  )
}

