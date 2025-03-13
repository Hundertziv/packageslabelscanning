
import { useState, useRef, useEffect } from "react";
import { Search, X, User, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  matchedRecipients: string[];
  searchQuery: string;
  onSearch: (query: string) => string[] | undefined;
  onSelect: (recipient: string) => void;
  isExtracting: boolean;
}

const SearchBar = ({
  matchedRecipients,
  searchQuery,
  onSearch,
  onSelect,
  isExtracting
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredRecipients, setFilteredRecipients] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update filtered recipients when matched recipients change
  useEffect(() => {
    setFilteredRecipients(matchedRecipients);
  }, [matchedRecipients]);

  // Set the input value when searchQuery changes
  useEffect(() => {
    if (inputRef.current && searchQuery) {
      inputRef.current.value = searchQuery;
    }
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const results = onSearch(query);
    if (results) {
      setFilteredRecipients(results);
    }
    setIsOpen(!!query && filteredRecipients.length > 0);
  };

  const handleSelectRecipient = (recipient: string) => {
    onSelect(recipient);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.value = recipient;
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    onSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for recipient..."
          className="pl-10 pr-10"
          onChange={handleInputChange}
          disabled={isExtracting || matchedRecipients.length === 0}
          defaultValue={searchQuery}
        />
        {inputRef.current?.value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>

      {isOpen && filteredRecipients.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border">
          <ul className="py-1">
            {filteredRecipients.map((recipient, index) => (
              <li
                key={index}
                className="px-4 py-2 flex items-center justify-between hover:bg-blue-50 cursor-pointer"
                onClick={() => handleSelectRecipient(recipient)}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{recipient}</span>
                </div>
                <Check className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {matchedRecipients.length === 0 && !isExtracting && (
        <p className="text-sm text-gray-500 mt-2">
          Upload an image to find matching recipients
        </p>
      )}
    </div>
  );
};

export default SearchBar;
