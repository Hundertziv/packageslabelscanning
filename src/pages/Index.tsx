
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, User, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import ImageUploader from "@/components/ImageUploader";
import { useTextExtractor } from "@/hooks/use-text-extractor";
import ResultDisplay from "@/components/ResultDisplay";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const { toast } = useToast();
  const { 
    extractText, 
    isExtracting, 
    extractedText, 
    recipientName, 
    apartment, 
    matchedRecipients,
    searchQuery,
    filterRecipients,
    resetResults 
  } = useTextExtractor();

  const handleImageUpload = async (imageUrl: string) => {
    setUploadedImage(imageUrl);
    resetResults();
    setSelectedRecipient("");
    
    // Automatically extract text when image is uploaded
    try {
      await extractText(imageUrl);
    } catch (error) {
      toast({
        title: "Extraction failed",
        description: "Failed to extract text from the image.",
        variant: "destructive",
      });
    }
  };

  const handleSelectRecipient = (recipient: string) => {
    setSelectedRecipient(recipient);
    toast({
      title: "Recipient selected",
      description: `Selected recipient: ${recipient}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-3">Package Label Analyzer</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a package label image to extract the recipient's information and find matches in our database.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Label Image
              </CardTitle>
              <CardDescription>
                Upload a clear photo of your package label
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader onImageUpload={handleImageUpload} />
              
              <div className="mt-6">
                {isExtracting ? (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <span className="text-sm text-blue-700">Analyzing label...</span>
                  </div>
                ) : (
                  <div className="mt-4">
                    <SearchBar
                      matchedRecipients={matchedRecipients}
                      searchQuery={searchQuery}
                      onSearch={filterRecipients}
                      onSelect={handleSelectRecipient}
                      isExtracting={isExtracting}
                    />
                    
                    {matchedRecipients.length > 0 && (
                      <div className="mt-3 text-sm text-gray-600">
                        Found {matchedRecipients.length} potential matches
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={cn("shadow-md", extractedText ? "bg-white" : "bg-gray-50")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Extraction Results
              </CardTitle>
              <CardDescription>
                {selectedRecipient 
                  ? `Selected recipient: ${selectedRecipient}`
                  : "Recipient details extracted from the label"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultDisplay 
                extractedText={extractedText}
                recipientName={selectedRecipient || recipientName}
                apartment={apartment}
                isExtracting={isExtracting}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link to="/history">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              View Previous Extractions
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
