import Link from 'next/link'
import { Button } from "@/components/ui/button"

const orders = [
  { id: 1, date: "2023-05-01", total: 219.98, status: "Delivered" },
  { id: 2, date: "2023-05-15", total: 129.99, status: "Shipped" },
  { id: 3, date: "2023-05-30", total: 89.99, status: "Processing" },
]

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">Placed on {order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.total.toFixed(2)}</p>
                <p className="text-gray-600">{order.status}</p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/orders/${order.id}`}>View Order Details</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

