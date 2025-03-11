
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Home, Calendar, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

interface HistoryItem {
  id: string;
  date: string;
  imageUrl: string;
  extractedText: string;
  recipientName: string;
  apartment: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('labelHistory') || '[]');
      setHistory(savedHistory);
    } catch (error) {
      console.error("Failed to load history:", error);
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('labelHistory');
    setHistory([]);
  };

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('labelHistory', JSON.stringify(updatedHistory));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Extraction History</h1>
          {history.length > 0 && (
            <Button 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={clearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">No extraction history yet</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Scan package labels to see your extraction history here
              </p>
              <Link to="/">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Go to Scanner
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <Card key={item.id} className="shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 bg-gray-100 flex items-center justify-center p-4">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt="Package label" 
                        className="max-h-[180px] object-contain rounded" 
                      />
                    ) : (
                      <div className="bg-gray-200 h-[150px] w-full rounded flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No image</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-3/4 p-6">
                    <div className="text-sm text-gray-500 mb-4">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {formatDate(item.date)}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <div className="flex items-center gap-1 text-blue-700 text-sm mb-1">
                          <User className="h-3.5 w-3.5" />
                          <span>Recipient</span>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-2 rounded">
                          {item.recipientName}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1 text-blue-700 text-sm mb-1">
                          <Home className="h-3.5 w-3.5" />
                          <span>Apartment</span>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-2 rounded">
                          {item.apartment}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
