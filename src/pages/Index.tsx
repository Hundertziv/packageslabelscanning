
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

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { 
    extractText, 
    isExtracting, 
    extractedText, 
    recipientName, 
    apartment, 
    resetResults 
  } = useTextExtractor();

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    resetResults();
  };

  const handleAnalyzeClick = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image selected",
        description: "Please upload a package label image first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await extractText(uploadedImage);
    } catch (error) {
      toast({
        title: "Extraction failed",
        description: "Failed to extract text from the image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-3">Package Label Analyzer</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a package label image to extract the recipient's name and apartment number 
            using advanced OCR technology.
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
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleAnalyzeClick} 
                  disabled={!uploadedImage || isExtracting}
                  className="w-full max-w-xs"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Analyze Label
                    </>
                  )}
                </Button>
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
                Recipient details extracted from the label
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultDisplay 
                extractedText={extractedText}
                recipientName={recipientName}
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
