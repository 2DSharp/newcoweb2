import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Minus, Plus, X } from 'lucide-react'

interface CartItemProps {
  item: {
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }
}

export function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex items-center py-6 border-b">
      <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md" />
      <div className="ml-4 flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <Button variant="outline" size="icon">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-2">{item.quantity}</span>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="ml-4">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

