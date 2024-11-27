import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import Image from "next/image"

interface Option {
  value: string
  label: string
  image?: string
}

interface MultiSelectProps {
  options: Option[]
  value: Option[]
  onChange: (value: Option[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options..."
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const safeOptions = Array.isArray(options) ? options : []
  const safeValue = Array.isArray(value) ? value : []

  const handleSelect = (option: Option) => {
    const isSelected = safeValue.some((item) => item.value === option.value)
    if (isSelected) {
      onChange(safeValue.filter((item) => item.value !== option.value))
    } else {
      onChange([...safeValue, option])
    }
    setInputValue("")
  }

  const handleRemove = (optionValue: string) => {
    onChange(safeValue.filter((item) => item.value !== optionValue))
  }

  const filteredOptions = safeOptions.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <Command className="overflow-visible bg-white">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {safeValue.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="hover:bg-secondary/80"
            >
              {option.image && (
                <Image
                  src={option.image}
                  alt={option.label}
                  width={16}
                  height={16}
                  className="mr-1 rounded"
                />
              )}
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemove(option.value)
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            onFocus={() => setOpen(true)}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && filteredOptions.length > 0 && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-60">
              {filteredOptions.map((option) => {
                const isSelected = safeValue.some((item) => item.value === option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="flex items-center gap-2">
                      {option.image && (
                        <Image
                          src={option.image}
                          alt={option.label}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                      )}
                      <span>{option.label}</span>
                      {isSelected && <X className="h-4 w-4 ml-auto" />}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
} 