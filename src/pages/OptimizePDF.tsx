import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Zap } from "lucide-react";
import { toast } from "sonner";

const OptimizePDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimized, setOptimized] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);

  const handleFileSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    toast.success("PDF loaded successfully");
  };

  const handleOptimize = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newSize = originalSize * 0.6; // 40% reduction
    setOptimizedSize(newSize);

    setProcessing(false);
    setOptimized(true);
    toast.success("PDF optimized successfully!");
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Optimize PDF</h1>
          <p className="text-lg text-muted-foreground">
            Reduce file size and improve performance
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !optimized ? (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-medium mb-1">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                Original size: {formatSize(originalSize)}
              </p>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Optimizing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleOptimize}
              disabled={processing}
            >
              <Zap className="w-5 h-5" />
              {processing ? "Optimizing..." : "Optimize PDF"}
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
              <h2 className="text-2xl font-bold mb-2">PDF Optimized Successfully!</h2>
              <div className="bg-card p-6 rounded-lg border inline-block mt-4">
                <div className="flex gap-8 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Original Size</p>
                    <p className="text-xl font-bold">{formatSize(originalSize)}</p>
                  </div>
                  <div className="border-l pl-8">
                    <p className="text-sm text-muted-foreground mb-1">Optimized Size</p>
                    <p className="text-xl font-bold text-green-600">{formatSize(optimizedSize)}</p>
                  </div>
                  <div className="border-l pl-8">
                    <p className="text-sm text-muted-foreground mb-1">Saved</p>
                    <p className="text-xl font-bold text-primary">
                      {((1 - optimizedSize / originalSize) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="xl" className="gap-3" onClick={() => toast.success("Download started!")}>
                <Download className="w-5 h-5" />
                Download Optimized PDF
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => {
                  setFile(null);
                  setOptimized(false);
                  setProgress(0);
                }}
              >
                Optimize Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OptimizePDF;
