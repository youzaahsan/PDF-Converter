import { FileImage, FileText, FileSpreadsheet, Presentation, Code, Image } from "lucide-react";
import { Link } from "react-router-dom";

const convertToPdfOptions = [
  { name: "JPG to PDF", icon: FileImage, iconColor: "text-yellow-500", bgColor: "bg-yellow-50", path: "/jpg-to-pdf" },
  { name: "WORD to PDF", icon: FileText, iconColor: "text-blue-500", bgColor: "bg-blue-50", path: "/word-to-pdf" },
  { name: "POWERPOINT to PDF", icon: Presentation, iconColor: "text-orange-500", bgColor: "bg-orange-50", path: "/ppt-to-pdf" },
  { name: "EXCEL to PDF", icon: FileSpreadsheet, iconColor: "text-green-500", bgColor: "bg-green-50", path: "/excel-to-pdf" },
  { name: "HTML to PDF", icon: Code, iconColor: "text-yellow-600", bgColor: "bg-yellow-50", path: "/html-to-pdf" },
];

const convertFromPdfOptions = [
  { name: "PDF to JPG", icon: Image, iconColor: "text-pink-500", bgColor: "bg-pink-50", path: "/pdf-to-jpg" },
  { name: "PDF to WORD", icon: FileText, iconColor: "text-blue-600", bgColor: "bg-blue-50", path: "/pdf-to-word" },
  { name: "PDF to POWERPOINT", icon: Presentation, iconColor: "text-orange-600", bgColor: "bg-orange-50", path: "/pdf-to-ppt" },
  { name: "PDF to EXCEL", icon: FileSpreadsheet, iconColor: "text-green-600", bgColor: "bg-green-50", path: "/pdf-to-excel" },
  { name: "PDF to PDF/A", icon: FileText, iconColor: "text-purple-600", bgColor: "bg-purple-50", path: "/pdf-to-pdfa" },
];

export const ConvertDropdown = () => {
  return (
    <div className="absolute top-full left-0 mt-2 w-[600px] bg-card rounded-xl shadow-lg border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
      <div className="grid grid-cols-2 divide-x">
        {/* Convert TO PDF Section */}
        <div>
          <div className="p-3 bg-muted/50 border-b">
            <h3 className="font-semibold text-sm">CONVERT TO PDF</h3>
          </div>
          <div className="py-2">
            {convertToPdfOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Link
                  key={option.name}
                  to={option.path}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${option.bgColor}`}>
                    <Icon className={`w-5 h-5 ${option.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium">{option.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Convert FROM PDF Section */}
        <div>
          <div className="p-3 bg-muted/50 border-b">
            <h3 className="font-semibold text-sm">CONVERT FROM PDF</h3>
          </div>
          <div className="py-2">
            {convertFromPdfOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Link
                  key={option.name}
                  to={option.path}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${option.bgColor}`}>
                    <Icon className={`w-5 h-5 ${option.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium">{option.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
