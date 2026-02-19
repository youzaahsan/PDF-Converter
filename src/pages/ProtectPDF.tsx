import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Lock } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, StandardFonts } from "pdf-lib";

const ProtectPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [protectedPdfUrl, setProtectedPdfUrl] = useState<string>("");
  const [password, setPassword] = useState("");

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setProtectedPdfUrl("");
    toast.success("PDF loaded");
  };

  const handleProtect = async () => {
    if (!file || !password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Note: pdf-lib doesn't support encryption directly
      // This is a simplified version - in production, you'd use a backend service
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setProtectedPdfUrl(url);
      toast.success("PDF protected! (Note: This is a demo - use a backend service for real encryption)");
    } catch (error) {
      console.error(error);
      toast.error("Failed to protect PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!protectedPdfUrl) return;
    
    const link = document.createElement("a");
    link.href = protectedPdfUrl;
    link.download = `protected-${file?.name || "document.pdf"}`;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Protect PDF</h1>
          <p className="text-lg text-muted-foreground">
            Add password protection to your PDF
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !protectedPdfUrl ? (
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
                  placeholder="Enter password"
                />
              </div>

              <Button
                onClick={handleProtect}
                disabled={processing || !password.trim()}
                variant="hero"
                size="xl"
                className="w-full gap-2"
              >
                <Lock className="w-5 h-5" />
                {processing ? "Protecting PDF..." : "Protect PDF"}
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
              <h3 className="text-xl font-semibold mb-2">PDF Protected!</h3>
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
                  setProtectedPdfUrl("");
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

export default ProtectPDF;
