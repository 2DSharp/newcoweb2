import Image from 'next/image'

const orderDetails = {
  id: 1,
  date: "2023-05-01",
  total: 219.98,
  status: "Delivered",
  items: [
    { id: 1, name: "Vintage Camera", price: 129.99, quantity: 1, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 2, name: "Leather Backpack", price: 89.99, quantity: 1, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80" },
  ],
  shippingAddress: {
    name: "John Doe",
    address: "123 Main St",
    city: "Anytown",
    postalCode: "12345",
    country: "United States",
  },
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Order Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Order #{orderDetails.id}</h2>
            <p className="text-gray-600">Placed on {orderDetails.date}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${orderDetails.total.toFixed(2)}</p>
            <p className="text-gray-600">{orderDetails.status}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Items</h3>
        <div className="space-y-4 mb-6">
          {orderDetails.items.map((item) => (
            <div key={item.id} className="flex items-center">
              <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md" />
              <div className="ml-4">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="text-gray-600">
          <p>{orderDetails.shippingAddress.name}</p>
          <p>{orderDetails.shippingAddress.address}</p>
          <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
          <p>{orderDetails.shippingAddress.country}</p>
        </div>
      </div>
    </div>
  )
}

