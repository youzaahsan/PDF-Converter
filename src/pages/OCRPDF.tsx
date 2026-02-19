import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, FileSearch } from "lucide-react";
import { toast } from "sonner";

const OCRPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(false);
  const [stats, setStats] = useState({ pages: 0, words: 0 });

  const handleFileSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    toast.success("PDF loaded successfully");
  };

  const handleOCR = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);

    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Simulate OCR results
    setStats({
      pages: Math.floor(Math.random() * 20) + 5,
      words: Math.floor(Math.random() * 5000) + 1000
    });

    setProcessing(false);
    setProcessed(true);
    toast.success("OCR processing completed!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">OCR PDF</h1>
          <p className="text-lg text-muted-foreground">
            Extract text from scanned documents and images
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !processed ? (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-medium mb-1">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                Ready for OCR processing
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> OCR will analyze your document and extract all text,
                making it searchable and editable.
              </p>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing with OCR...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleOCR}
              disabled={processing}
            >
              <FileSearch className="w-5 h-5" />
              {processing ? "Processing..." : "Start OCR"}
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
              <h2 className="text-2xl font-bold mb-2">OCR Processing Complete!</h2>
              
              <div className="bg-card p-6 rounded-lg border inline-block mt-4">
                <div className="flex gap-8 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pages Processed</p>
                    <p className="text-3xl font-bold text-primary">{stats.pages}</p>
                  </div>
                  <div className="border-l pl-8">
                    <p className="text-sm text-muted-foreground mb-1">Words Extracted</p>
                    <p className="text-3xl font-bold text-primary">{stats.words.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Your PDF is now searchable and text can be selected
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="xl" className="gap-3" onClick={() => toast.success("Download started!")}>
                <Download className="w-5 h-5" />
                Download Searchable PDF
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => {
                  setFile(null);
                  setProcessed(false);
                  setProgress(0);
                }}
              >
                Process Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OCRPDF;
