import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface VariantSelectorProps {
  variants: Array<{
    variantId: string
    name: string
    pricing: {
      finalPrice: string
    }
  }>
  selectedVariant: any
  onVariantChange: (variant: any) => void
}

export function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Select Variant</h2>
      <RadioGroup defaultValue={selectedVariant.variantId} onValueChange={(value) => onVariantChange(variants.find(v => v.variantId === value))}>
        {variants.map((variant) => (
          <div key={variant.variantId} className="flex items-center space-x-2">
            <RadioGroupItem value={variant.variantId} id={variant.variantId} />
            <Label htmlFor={variant.variantId}>{variant.name} - {variant.pricing.finalPrice}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

