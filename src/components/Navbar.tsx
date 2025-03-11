
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, History } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white py-4 shadow-sm">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-blue-800">LabelLookup</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"} 
                className={cn("gap-2", location.pathname === "/" && "bg-blue-600")}
              >
                <FileText className="h-4 w-4" />
                Scanner
              </Button>
            </Link>
            <Link to="/history">
              <Button 
                variant={location.pathname === "/history" ? "default" : "ghost"}
                className={cn("gap-2", location.pathname === "/history" && "bg-blue-600")}
              >
                <History className="h-4 w-4" />
                History
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
