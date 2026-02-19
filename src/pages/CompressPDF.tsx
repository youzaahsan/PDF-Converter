import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Minimize2 } from "lucide-react";
import { toast } from "sonner";

type CompressionLevel = "extreme" | "recommended" | "less";

const compressionLevels = [
  { id: "extreme" as const, label: "Extreme Compression", reduction: 70 },
  { id: "recommended" as const, label: "Recommended", reduction: 50 },
  { id: "less" as const, label: "Less Compression", reduction: 30 },
];

const CompressPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("recommended");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressed, setCompressed] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFileSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    toast.success("PDF loaded successfully");
  };

  const handleCompress = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);

    // Simulate compression with progress
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
    
    // Calculate compressed size based on level
    const level = compressionLevels.find(l => l.id === compressionLevel);
    const newSize = originalSize * (1 - (level?.reduction || 50) / 100);
    setCompressedSize(newSize);

    setProcessing(false);
    setCompressed(true);
    toast.success("PDF compressed successfully!");
  };

  const handleDownload = () => {
    toast.success("Download started!");
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Compress PDF</h1>
          <p className="text-lg text-muted-foreground">
            Reduce PDF file size while maintaining quality
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !compressed ? (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-medium mb-1">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                Original size: {formatSize(originalSize)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Compression Level</h3>
              <div className="grid gap-3">
                {compressionLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setCompressionLevel(level.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      compressionLevel === level.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{level.label}</p>
                        <p className="text-sm text-muted-foreground">
                          ~{level.reduction}% size reduction
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatSize(originalSize * (1 - level.reduction / 100))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compressing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleCompress}
              disabled={processing}
            >
              <Minimize2 className="w-5 h-5" />
              {processing ? "Compressing..." : "Compress PDF"}
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
              <h2 className="text-2xl font-bold mb-2">PDF Compressed Successfully!</h2>
              <div className="bg-card p-6 rounded-lg border inline-block mt-4">
                <div className="flex gap-8 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Original Size</p>
                    <p className="text-xl font-bold">{formatSize(originalSize)}</p>
                  </div>
                  <div className="border-l pl-8">
                    <p className="text-sm text-muted-foreground mb-1">Compressed Size</p>
                    <p className="text-xl font-bold text-green-600">{formatSize(compressedSize)}</p>
                  </div>
                  <div className="border-l pl-8">
                    <p className="text-sm text-muted-foreground mb-1">Saved</p>
                    <p className="text-xl font-bold text-primary">
                      {((1 - compressedSize / originalSize) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="xl" className="gap-3" onClick={handleDownload}>
                <Download className="w-5 h-5" />
                Download Compressed PDF
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => {
                  setFile(null);
                  setCompressed(false);
                  setProgress(0);
                }}
              >
                Compress Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompressPDF;
