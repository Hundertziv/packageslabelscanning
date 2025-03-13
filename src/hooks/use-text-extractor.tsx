
import { useState } from "react";
import { createWorker } from "tesseract.js";
import { useToast } from "@/hooks/use-toast";
import { findBestRecipientMatch } from "@/utils/recipient-list";

export const useTextExtractor = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [apartment, setApartment] = useState("");
  const [matchedRecipients, setMatchedRecipients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bestMatch, setBestMatch] = useState<string>("");
  const { toast } = useToast();

  const resetResults = () => {
    setExtractedText("");
    setRecipientName("");
    setApartment("");
    setMatchedRecipients([]);
    setSearchQuery("");
    setBestMatch("");
  };

  const extractText = async (imageUrl: string) => {
    setIsExtracting(true);
    resetResults();
    
    try {
      // Initialize the worker with proper options object
      const worker = await createWorker({
        logger: m => console.log(m),
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      });
      
      // Load and initialize with English language
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      toast({
        title: "Processing image",
        description: "Extracting text from the label...",
      });
      
      // Extract text from the package label image
      const { data: { text } } = await worker.recognize(imageUrl);
      console.log("Extracted Text:", text);
      setExtractedText(text);
      
      // Split text into lines
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      
      let foundName = '';
      let foundApartment = '';
      
      // Process each line to find name and apartment
      for (const line of lines) {
        // Check for recipient name
        if (line.match(/^(To:|Recipient:|Deliver to:|Attention:|ATTN:)/i)) {
          foundName = line.replace(/^(To:|Recipient:|Deliver to:|Attention:|ATTN:)/i, '').trim();
        } else if (!foundName && line.match(/^[A-Z][a-z]*(\s+[A-Z][a-z]*)+$/)) {
          // Fallback: assume capitalized words could be the name
          foundName = line;
        }
        
        // Check for apartment
        const aptMatch = line.match(/(Apt|Apartment|Unit|Suite|#)\s*\.?\s*([\dA-Za-z-]+)/i);
        if (aptMatch) {
          foundApartment = aptMatch[2];
        } else if (line.match(/\d+[A-Za-z]?\s*,/)) {
          // Try to find apartment in address format "123A, Street Name"
          const aptCandidate = line.match(/(\d+[A-Za-z]?)\s*,/);
          if (aptCandidate) {
            foundApartment = aptCandidate[1];
          }
        }
      }
      
      setRecipientName(foundName || "Not found");
      setApartment(foundApartment || "Not found");
      
      // Find matching recipients
      const possibleMatches = findBestRecipientMatch(text);
      setMatchedRecipients(possibleMatches);
      
      // Automatically select the best match (first one from the sorted list)
      if (possibleMatches.length > 0) {
        const bestMatchName = possibleMatches[0];
        setBestMatch(bestMatchName);
        setSearchQuery(bestMatchName);
      }
      
      // Save to history
      saveToHistory({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        imageUrl,
        extractedText: text,
        recipientName: foundName || "Not found",
        apartment: foundApartment || "Not found",
        matchedRecipients: possibleMatches,
        bestMatch: possibleMatches.length > 0 ? possibleMatches[0] : ""
      });
      
      await worker.terminate();
      
      toast({
        title: "Extraction complete",
        description: possibleMatches.length > 0 
          ? `Best match: ${possibleMatches[0]}` 
          : "Couldn't find matching recipients",
      });
    } catch (error) {
      console.error("Text extraction error:", error);
      toast({
        title: "Extraction failed",
        description: "There was an error processing the image.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const saveToHistory = (item) => {
    try {
      const history = JSON.parse(localStorage.getItem('labelHistory') || '[]');
      history.unshift(item);
      // Keep only last 10 items
      if (history.length > 10) {
        history.pop();
      }
      localStorage.setItem('labelHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  };

  const filterRecipients = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return;
    
    // If we have matched recipients, filter them further
    if (matchedRecipients.length > 0) {
      const filteredResults = matchedRecipients.filter(
        name => name.toLowerCase().includes(query.toLowerCase())
      );
      return filteredResults;
    }
    
    return [];
  };

  return {
    extractText,
    isExtracting,
    extractedText,
    recipientName,
    apartment,
    matchedRecipients,
    searchQuery,
    setSearchQuery,
    filterRecipients,
    resetResults,
    bestMatch
  };
};
