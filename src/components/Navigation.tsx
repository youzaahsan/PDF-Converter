import { Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { ConvertDropdown } from "./ConvertDropdown";
import { MegaDropdown } from "./MegaDropdown";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  const [showAllToolsMenu, setShowAllToolsMenu] = useState(false);
  const navigate = useNavigate();
  const convertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allToolsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleConvertMouseEnter = () => {
    if (convertTimeoutRef.current) {
      clearTimeout(convertTimeoutRef.current);
    }
    setShowConvertMenu(true);
  };

  const handleConvertMouseLeave = () => {
    convertTimeoutRef.current = setTimeout(() => {
      setShowConvertMenu(false);
    }, 300);
  };

  const handleAllToolsMouseEnter = () => {
    if (allToolsTimeoutRef.current) {
      clearTimeout(allToolsTimeoutRef.current);
    }
    setShowAllToolsMenu(true);
  };

  const handleAllToolsMouseLeave = () => {
    allToolsTimeoutRef.current = setTimeout(() => {
      setShowAllToolsMenu(false);
    }, 300);
  };

  return (
    <nav className="bg-card shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <span>I</span>
            <Heart className="w-5 h-5 fill-primary text-primary" />
            <span>PDF</span>
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => navigate('/merge')}
              className="hover:text-primary transition-colors"
            >
              MERGE PDF
            </button>
            <button 
              onClick={() => navigate('/split')}
              className="hover:text-primary transition-colors"
            >
              SPLIT PDF
            </button>
            <button 
              onClick={() => navigate('/compress')}
              className="hover:text-primary transition-colors"
            >
              COMPRESS PDF
            </button>
            <div className="relative">
              <button
                className="hover:text-primary transition-colors flex items-center gap-1"
                onMouseEnter={handleConvertMouseEnter}
                onMouseLeave={handleConvertMouseLeave}
              >
                CONVERT PDF
                <ChevronDown className="w-4 h-4" />
              </button>
              {showConvertMenu && (
                <div
                  onMouseEnter={handleConvertMouseEnter}
                  onMouseLeave={handleConvertMouseLeave}
                >
                  <ConvertDropdown />
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="hover:text-primary transition-colors flex items-center gap-1"
                onMouseEnter={handleAllToolsMouseEnter}
                onMouseLeave={handleAllToolsMouseLeave}
              >
                ALL PDF TOOLS
                <ChevronDown className="w-4 h-4" />
              </button>
              {showAllToolsMenu && (
                <div
                  onMouseEnter={handleAllToolsMouseEnter}
                  onMouseLeave={handleAllToolsMouseLeave}
                >
                  <MegaDropdown />
                </div>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button variant="default" size="sm">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
