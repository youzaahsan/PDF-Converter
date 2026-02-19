import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { GripVertical, X, Download, Merge } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  file: File;
  id: string;
}

const MergePDF = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [merged, setMerged] = useState(false);

  const handleFilesSelected = (newFiles: File[]) => {
    const uploadedFiles = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
    toast.success(`${newFiles.length} file(s) added`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files to merge");
      return;
    }

    setProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    setMerged(true);
    toast.success("PDFs merged successfully!");
  };

  const handleDownload = () => {
    toast.success("Download started!");
    // In a real app, this would trigger actual download
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Merge PDF files</h1>
          <p className="text-lg text-muted-foreground">
            Combine multiple PDFs into one document
          </p>
        </div>

        {!merged ? (
          <>
            <FileUploadZone 
              onFilesSelected={handleFilesSelected}
              multiple
              title="Select PDF files"
              subtitle="or drag and drop multiple files here"
            />

            {files.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-lg">Files to merge ({files.length})</h3>
                
                <div className="space-y-2">
                  {files.map((uploadedFile, index) => (
                    <div 
                      key={uploadedFile.id}
                      className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-sm"
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveFile(index, "up")}
                          disabled={index === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <GripVertical className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">{uploadedFile.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        onClick={() => removeFile(uploadedFile.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="hero" 
                  size="xl" 
                  className="w-full gap-3"
                  onClick={handleMerge}
                  disabled={processing || files.length < 2}
                >
                  <Merge className="w-5 h-5" />
                  {processing ? "Merging PDFs..." : "Merge PDF"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">PDFs Merged Successfully!</h2>
              <p className="text-muted-foreground">Your merged PDF is ready to download</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="xl" className="gap-3" onClick={handleDownload}>
                <Download className="w-5 h-5" />
                Download Merged PDF
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => {
                  setFiles([]);
                  setMerged(false);
                }}
              >
                Merge More Files
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MergePDF;
