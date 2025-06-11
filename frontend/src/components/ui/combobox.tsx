import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxProps<T>
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  options: T[];
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
  emptyMessage?: string;
  displayField: keyof T;
  valueField: keyof T;
}

export function Combobox<T extends Record<string, any>>({
  options,
  value,
  onValueChange,
  placeholder = "Selecione...",
  emptyMessage = "Nenhum item encontrado.",
  displayField,
  valueField,
  ...props
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option[valueField] === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", props.className)}
        >
          {selectedOption ? selectedOption[displayField] : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" {...props}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {(options ?? []).filter(Boolean).map((option) => {
                const itemValue = String(option[valueField] ?? '');
                const itemDisplay = String(option[displayField] ?? '');

                return (
                  <CommandItem
                    key={itemValue}
                    value={itemDisplay}
                    onSelect={() => {
                      onValueChange(option[valueField] === value ? undefined : itemValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === itemValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {itemDisplay}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 