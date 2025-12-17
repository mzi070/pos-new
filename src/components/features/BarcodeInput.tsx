import { useRef } from 'react';

interface BarcodeInputProps {
  onScan: (barcode: string) => void;
}

export default function BarcodeInput({ onScan }: BarcodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const value = inputRef.current?.value.trim();
      if (value) {
        onScan(value);
        if (inputRef.current) inputRef.current.value = '';
      }
    }
  }

  return (
    <input
      ref={inputRef}
      className="border rounded px-3 py-2 w-full"
      placeholder="Scan barcode..."
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
}
