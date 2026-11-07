import * as React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const noValue = "__none__"

type OptionSelectProps = {
  options: { value: string; label: string }[]
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  id?: string
  className?: string
  disabled?: boolean
  "aria-label"?: string
  "aria-invalid"?: boolean
}

function OptionSelect({
  options,
  placeholder,
  value,
  defaultValue = "",
  onValueChange,
  name,
  id,
  className,
  disabled,
  ...aria
}: OptionSelectProps) {
  const [ownValue, setOwnValue] = React.useState(defaultValue)
  const current = value ?? ownValue
  const hasEmptyChoice = placeholder !== undefined

  const choose = (next: string) => {
    const chosen = next === noValue ? "" : next
    setOwnValue(chosen)
    onValueChange?.(chosen)
  }

  return (
    <Select
      value={current === "" ? (hasEmptyChoice ? noValue : "") : current}
      onValueChange={choose}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn("w-full", className)} {...aria}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      {name !== undefined && <input type="hidden" name={name} value={current} />}
      <SelectContent>
        {hasEmptyChoice && <SelectItem value={noValue}>{placeholder}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { OptionSelect }
