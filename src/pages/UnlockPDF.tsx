import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Unlock } from "lucide-react";
import { toast } from "sonner";

const UnlockPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [unlockedPdfUrl, setUnlockedPdfUrl] = useState<string>("");
  const [password, setPassword] = useState("");

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setUnlockedPdfUrl("");
    toast.success("PDF loaded");
  };

  const handleUnlock = async () => {
    if (!file || !password.trim()) {
      toast.error("Please enter the password");
      return;
    }

    setProcessing(true);
    try {
      // Note: This would require a backend service for real password removal
      // For demo purposes, we're just creating a blob
      const blob = new Blob([await file.arrayBuffer()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setUnlockedPdfUrl(url);
      toast.success("PDF unlocked! (Demo mode)");
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlock PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!unlockedPdfUrl) return;
    
    const link = document.createElement("a");
    link.href = unlockedPdfUrl;
    link.download = `unlocked-${file?.name || "document.pdf"}`;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Unlock PDF</h1>
          <p className="text-lg text-muted-foreground">
            Remove password protection from your PDF
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !unlockedPdfUrl ? (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border">
              <p className="font-medium mb-2">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PDF password"
                />
              </div>

              <Button
                onClick={handleUnlock}
                disabled={processing || !password.trim()}
                variant="hero"
                size="xl"
                className="w-full gap-2"
              >
                <Unlock className="w-5 h-5" />
                {processing ? "Unlocking PDF..." : "Unlock PDF"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">PDF Unlocked!</h3>
              <p className="text-muted-foreground">Your PDF is ready to download</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleDownload} variant="hero" size="xl" className="gap-2">
                <Download className="w-5 h-5" />
                Download PDF
              </Button>
              <Button 
                onClick={() => {
                  setFile(null);
                  setUnlockedPdfUrl("");
                  setPassword("");
                }}
                variant="outline"
                size="xl"
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

export default UnlockPDF;
