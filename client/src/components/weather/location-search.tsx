import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const searchLocations = async (query: string) => {
    if (!query) {
      setLocations([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/locations?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Search location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search locations..."
              value={value}
              onValueChange={(value) => {
                setValue(value);
                searchLocations(value);
              }}
              className="h-9 border-0 focus-visible:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              {value ? "No locations found." : "Start typing to search..."}
            </CommandEmpty>
            <CommandGroup>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                locations.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={location.name}
                    onSelect={() => {
                      setValue(location.name);
                      onLocationSelect(location);
                      setOpen(false);
                    }}
                    className="px-3 py-2 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === location.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {location.name}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}