
import { Skeleton } from "@/components/ui/skeleton";
import { User, Home, AlertCircle, Barcode } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  extractedText: string;
  recipientName: string;
  apartment: string;
  barcodeValue?: string;
  isExtracting: boolean;
}

const ResultDisplay = ({
  extractedText,
  recipientName,
  apartment,
  barcodeValue = "Not found",
  isExtracting
}: ResultDisplayProps) => {
  if (isExtracting) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!extractedText) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p className="text-sm">
          Upload and analyze a package label to see the extracted information
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-medium">
          <User className="h-5 w-5" />
          <h3>Most potential recipient name found</h3>
        </div>
        <div className={cn(
          "p-3 rounded-md font-medium text-lg border",
          recipientName === "Not found" ? "text-red-500 border-red-200 bg-red-50" : "border-green-200 bg-green-50 text-green-800"
        )}>
          {recipientName === "Not found" ? (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              No recipient name detected
            </div>
          ) : recipientName}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-medium">
          <Home className="h-5 w-5" />
          <h3>Apartment/Unit</h3>
        </div>
        <div className={cn(
          "p-3 rounded-md font-medium text-lg border",
          apartment === "Not found" ? "text-red-500 border-red-200 bg-red-50" : "border-green-200 bg-green-50 text-green-800"
        )}>
          {apartment === "Not found" ? (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              No apartment number detected
            </div>
          ) : apartment}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-medium">
          <Barcode className="h-5 w-5" />
          <h3>Tracking/Barcode ID</h3>
        </div>
        <div className={cn(
          "p-3 rounded-md font-medium text-lg border",
          barcodeValue === "Not found" ? "text-red-500 border-red-200 bg-red-50" : "border-green-200 bg-green-50 text-green-800"
        )}>
          {barcodeValue === "Not found" ? (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              No barcode detected
            </div>
          ) : barcodeValue}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="font-medium text-gray-700 mb-2">
          Full extracted text:
        </div>
        <div className="p-3 bg-gray-50 rounded border text-gray-700 whitespace-pre-wrap text-left">
          {extractedText || "No text extracted"}
        </div>
      </div>
    </div>
  );
};

// Fallback icon if import fails
const FileTextIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none" 
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default ResultDisplay;
