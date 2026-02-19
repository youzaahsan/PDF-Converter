import { 
  Merge, Split, Trash2, FileBox, Scan, 
  Minimize2, Wrench, FileSearch,
  FileImage, FileText, Presentation, FileSpreadsheet, Code,
  Image, RotateCw, Hash, Droplet, Crop,
  Lock, Unlock, FileSignature, Eye, GitCompare, Edit
} from "lucide-react";
import { Link } from "react-router-dom";

const toolSections = [
  {
    title: "Organize PDF",
    tools: [
      { name: "Merge PDF", icon: Merge, color: "text-red-500", bg: "bg-red-50", path: "/merge" },
      { name: "Split PDF", icon: Split, color: "text-blue-500", bg: "bg-blue-50", path: "/split" },
      { name: "Remove pages", icon: Trash2, color: "text-orange-500", bg: "bg-orange-50", path: "/remove-pages" },
      { name: "Extract pages", icon: FileBox, color: "text-green-500", bg: "bg-green-50", path: "/extract-pages" },
      { name: "Scan to PDF", icon: Scan, color: "text-purple-500", bg: "bg-purple-50", path: "/scan" },
    ],
  },
  {
    title: "Optimize PDF",
    tools: [
      { name: "Compress PDF", icon: Minimize2, color: "text-indigo-500", bg: "bg-indigo-50", path: "/compress" },
      { name: "Repair PDF", icon: Wrench, color: "text-yellow-500", bg: "bg-yellow-50", path: "/repair" },
      { name: "OCR PDF", icon: FileSearch, color: "text-teal-500", bg: "bg-teal-50", path: "/ocr" },
    ],
  },
  {
    title: "Convert to PDF",
    tools: [
      { name: "JPG to PDF", icon: FileImage, color: "text-yellow-500", bg: "bg-yellow-50", path: "/jpg-to-pdf" },
      { name: "Word to PDF", icon: FileText, color: "text-blue-500", bg: "bg-blue-50", path: "/word-to-pdf" },
      { name: "PowerPoint to PDF", icon: Presentation, color: "text-orange-500", bg: "bg-orange-50", path: "/ppt-to-pdf" },
      { name: "Excel to PDF", icon: FileSpreadsheet, color: "text-green-500", bg: "bg-green-50", path: "/excel-to-pdf" },
      { name: "HTML to PDF", icon: Code, color: "text-yellow-600", bg: "bg-yellow-50", path: "/html-to-pdf" },
    ],
  },
  {
    title: "Convert from PDF",
    tools: [
      { name: "PDF to JPG", icon: Image, color: "text-pink-500", bg: "bg-pink-50", path: "/pdf-to-jpg" },
      { name: "PDF to Word", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", path: "/pdf-to-word" },
      { name: "PDF to PowerPoint", icon: Presentation, color: "text-orange-600", bg: "bg-orange-50", path: "/pdf-to-ppt" },
      { name: "PDF to Excel", icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50", path: "/pdf-to-excel" },
    ],
  },
  {
    title: "Edit PDF",
    tools: [
      { name: "Rotate PDF", icon: RotateCw, color: "text-cyan-500", bg: "bg-cyan-50", path: "/rotate" },
      { name: "Add page numbers", icon: Hash, color: "text-violet-500", bg: "bg-violet-50", path: "/page-numbers" },
      { name: "Watermark", icon: Droplet, color: "text-blue-400", bg: "bg-blue-50", path: "/watermark" },
      { name: "Crop PDF", icon: Crop, color: "text-lime-500", bg: "bg-lime-50", path: "/crop" },
      { name: "Edit PDF", icon: Edit, color: "text-amber-500", bg: "bg-amber-50", path: "/edit" },
    ],
  },
  {
    title: "PDF Security",
    tools: [
      { name: "Unlock PDF", icon: Unlock, color: "text-emerald-500", bg: "bg-emerald-50", path: "/unlock" },
      { name: "Protect PDF", icon: Lock, color: "text-red-600", bg: "bg-red-50", path: "/protect" },
      { name: "Sign PDF", icon: FileSignature, color: "text-indigo-600", bg: "bg-indigo-50", path: "/sign" },
      { name: "Redact PDF", icon: Eye, color: "text-slate-500", bg: "bg-slate-50", path: "/redact" },
      { name: "Compare PDF", icon: GitCompare, color: "text-fuchsia-500", bg: "bg-fuchsia-50", path: "/compare" },
    ],
  },
];

export const MegaDropdown = () => {
  return (
    <div className="absolute top-full left-0 mt-2 bg-card rounded-xl shadow-lg border w-[750px] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="p-4 grid grid-cols-4 gap-4">
        {toolSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold text-xs mb-2 text-foreground/70 uppercase tracking-wide">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    to={tool.path}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-all group"
                  >
                    <div className={`p-1.5 rounded-lg ${tool.bg} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-3.5 h-3.5 ${tool.color}`} />
                    </div>
                    <span className="text-xs font-medium">{tool.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
