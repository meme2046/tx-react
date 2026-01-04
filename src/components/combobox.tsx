import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import type { NV } from "@/types/KV";

interface ComboboxProps {
  list: NV[];
  onchange?: (value: string) => void;
  width?: number;
}

export function Combobox(props: ComboboxProps) {
  const { list, onchange, width } = { width: 144, ...props };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{ width: `${width}px` }}
        >
          <span>
            {value
              ? list.find((item) => item.value === value)?.name
              : "Select..."}
          </span>
          <span>&nbsp;</span>
          <CaretSortIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: `${width}px` }}>
        <Command>
          <CommandInput placeholder="Search..." className="h-7" />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const v = currentValue === value ? "" : currentValue;
                    setValue(v);
                    onchange?.(v);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {item.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
