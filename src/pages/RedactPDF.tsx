import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RedactPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [redactedPdfUrl, setRedactedPdfUrl] = useState<string>("");
  const [redactionResults, setRedactionResults] = useState<any>(null);

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setRedactedPdfUrl("");
    setRedactionResults(null);
    toast.success("PDF loaded");
  };

  const handleRedact = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke('redact-pdf', {
          body: { pdfBase64: base64.split(',')[1] }
        });

        if (error) throw error;

        setRedactionResults(data);
        setRedactedPdfUrl(data.redactedPdfUrl);
        toast.success("PDF analyzed for sensitive information!");
      };
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!redactedPdfUrl) return;
    
    const link = document.createElement("a");
    link.href = redactedPdfUrl;
    link.download = `redacted-${file?.name || "document.pdf"}`;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Redact PDF</h1>
          <p className="text-lg text-muted-foreground">
            Automatically detect and redact sensitive information
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !redactedPdfUrl ? (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border">
              <p className="font-medium mb-2">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <Button
              onClick={handleRedact}
              disabled={processing}
              variant="hero"
              size="xl"
              className="w-full gap-2"
            >
              <Eye className="w-5 h-5" />
              {processing ? "Analyzing PDF..." : "Detect & Redact Sensitive Info"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              AI will detect emails, phone numbers, SSNs, and other sensitive data
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">PDF Analyzed!</h3>
              {redactionResults && (
                <p className="text-muted-foreground">
                  Found {redactionResults.itemsRedacted || 0} sensitive items
                </p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleDownload} variant="hero" size="xl" className="gap-2">
                <Download className="w-5 h-5" />
                Download Redacted PDF
              </Button>
              <Button 
                onClick={() => {
                  setFile(null);
                  setRedactedPdfUrl("");
                  setRedactionResults(null);
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

export default RedactPDF;
