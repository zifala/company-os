import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react"
import * as React from "react"

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type ComboboxProps = {
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
  createLabel?: string
  onCreate?: (search: string) => void
  onSearchChange?: (search: string) => void
  onOpenChange?: (open: boolean) => void
}

function Combobox({
  options,
  placeholder,
  value,
  defaultValue = "",
  onValueChange,
  name,
  id,
  className,
  disabled,
  createLabel,
  onCreate,
  onSearchChange,
  onOpenChange,
  ...aria
}: ComboboxProps) {
  const [open, setOpenState] = React.useState(false)
  const [search, setSearchState] = React.useState("")
  const setOpen = (next: boolean) => {
    setOpenState(next)
    onOpenChange?.(next)
  }
  const setSearch = (next: string) => {
    setSearchState(next)
    onSearchChange?.(next)
  }
  const [ownValue, setOwnValue] = React.useState(defaultValue)
  const typed = search.trim()
  const canCreate = onCreate !== undefined && typed !== "" && !options.some((option) => option.label.toLowerCase() === typed.toLowerCase())
  const current = value ?? ownValue
  const choices = placeholder === undefined ? options : [{ value: "", label: placeholder }, ...options]
  const selected = choices.find((option) => option.value === current)

  const choose = (next: string) => {
    setOwnValue(next)
    onValueChange?.(next)
    setSearch("")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          {...aria}
          className={cn(
            "border-input flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-card/70 px-3 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
            className
          )}
        >
          <span className={cn("truncate", !current && "text-slate-400")}>{selected?.label ?? placeholder ?? ""}</span>
          <ChevronDownIcon className="size-4 shrink-0 self-center text-slate-400" />
        </button>
      </PopoverTrigger>
      {name !== undefined && <input type="hidden" name={name} value={current} />}
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
        <Command shouldFilter={onSearchChange === undefined}>
          <CommandInput placeholder="Search" value={search} onValueChange={setSearch} />
          <CommandList>
            {!canCreate && <CommandEmpty>Nothing matches.</CommandEmpty>}
            {canCreate && (
              <CommandItem value={`create ${typed}`} forceMount onSelect={() => { onCreate(typed); setSearch(""); setOpen(false) }}>
                <PlusIcon />
                <span className="truncate">{createLabel ?? "Create"} “{typed}”</span>
              </CommandItem>
            )}
            {choices.map((option) => (
              <CommandItem key={option.value} value={`${option.label} ${option.value}`} onSelect={() => choose(option.value)}>
                <CheckIcon className={cn(option.value === current ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{option.label}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
export type { ComboboxProps }
