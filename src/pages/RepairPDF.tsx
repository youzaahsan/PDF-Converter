import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Wrench } from "lucide-react";
import { toast } from "sonner";

const RepairPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repaired, setRepaired] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);

  const handleFileSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    toast.success("PDF loaded successfully");
  };

  const handleRepair = async () => {
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
    }, 300);

    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate finding and fixing issues
    setIssues([
      "Fixed corrupted metadata",
      "Repaired broken cross-references",
      "Restored missing page references",
      "Fixed font encoding issues"
    ]);

    setProcessing(false);
    setRepaired(true);
    toast.success("PDF repaired successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Repair PDF</h1>
          <p className="text-lg text-muted-foreground">
            Fix corrupted or damaged PDF files
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !repaired ? (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-medium mb-1">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                Ready to scan and repair
              </p>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scanning and repairing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleRepair}
              disabled={processing}
            >
              <Wrench className="w-5 h-5" />
              {processing ? "Repairing..." : "Repair PDF"}
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
              <h2 className="text-2xl font-bold mb-2">PDF Repaired Successfully!</h2>
              
              <div className="bg-card p-6 rounded-lg border text-left mt-4 max-w-md mx-auto">
                <h3 className="font-semibold mb-3">Issues Fixed:</h3>
                <ul className="space-y-2">
                  {issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="xl" className="gap-3" onClick={() => toast.success("Download started!")}>
                <Download className="w-5 h-5" />
                Download Repaired PDF
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => {
                  setFile(null);
                  setRepaired(false);
                  setProgress(0);
                  setIssues([]);
                }}
              >
                Repair Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RepairPDF;
