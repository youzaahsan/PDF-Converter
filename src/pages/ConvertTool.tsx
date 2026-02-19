import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const conversionTypes: Record<string, { title: string; from: string; to: string; accept: string }> = {
  "jpg-to-pdf": { title: "JPG to PDF", from: "JPG", to: "PDF", accept: "image/jpeg,image/jpg" },
  "word-to-pdf": { title: "Word to PDF", from: "Word", to: "PDF", accept: ".doc,.docx" },
  "ppt-to-pdf": { title: "PowerPoint to PDF", from: "PowerPoint", to: "PDF", accept: ".ppt,.pptx" },
  "excel-to-pdf": { title: "Excel to PDF", from: "Excel", to: "PDF", accept: ".xls,.xlsx" },
  "html-to-pdf": { title: "HTML to PDF", from: "HTML", to: "PDF", accept: ".html" },
  "pdf-to-jpg": { title: "PDF to JPG", from: "PDF", to: "JPG", accept: ".pdf" },
  "pdf-to-word": { title: "PDF to Word", from: "PDF", to: "Word", accept: ".pdf" },
  "pdf-to-ppt": { title: "PDF to PowerPoint", from: "PDF", to: "PowerPoint", accept: ".pdf" },
  "pdf-to-excel": { title: "PDF to Excel", from: "PDF", to: "Excel", accept: ".pdf" },
  "pdf-to-pdfa": { title: "PDF to PDF/A", from: "PDF", to: "PDF/A", accept: ".pdf" },
};

const ConvertTool = () => {
  const location = useLocation();
  const tool = location.pathname.slice(1); // Remove leading slash to get tool name
  const config = conversionTypes[tool] || null;
  
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [converted, setConverted] = useState(false);

  if (!config) {
    return <div>Tool not found</div>;
  }

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    toast.success("File loaded successfully");
  };

  const handleConvert = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 12.5;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessing(false);
    setConverted(true);
    toast.success("Conversion completed!");
  };

  const handleDownload = () => {
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{config.title}</h1>
          <p className="text-lg text-muted-foreground">
            Convert {config.from} files to {config.to} format
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            accept={config.accept}
            title={`Select ${config.from} file`}
            subtitle="or drag and drop here"
          />
        ) : !converted ? (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-medium mb-1">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting to {config.to}...</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleConvert}
              disabled={processing}
            >
              <RefreshCw className="w-5 h-5" />
              {processing ? `Converting to ${config.to}...` : `Convert to ${config.to}`}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Conversion Successful!</h2>
              <p className="text-muted-foreground">
                Your {config.to} file is ready to download
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="xl" className="gap-3" onClick={handleDownload}>
                <Download className="w-5 h-5" />
                Download {config.to}
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => {
                  setFile(null);
                  setConverted(false);
                  setProgress(0);
                }}
              >
                Convert Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConvertTool;
