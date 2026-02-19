import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Droplet } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, rgb, degrees } from "pdf-lib";

const WatermarkPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [watermarkedPdfUrl, setWatermarkedPdfUrl] = useState<string>("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setWatermarkedPdfUrl("");
    toast.success("PDF loaded");
  };

  const handleAddWatermark = async () => {
    if (!file || !watermarkText.trim()) {
      toast.error("Please enter watermark text");
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * 10),
          y: height / 2,
          size: 48,
          color: rgb(0.8, 0.8, 0.8),
          opacity: 0.3,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setWatermarkedPdfUrl(url);
      toast.success("Watermark added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add watermark");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!watermarkedPdfUrl) return;
    
    const link = document.createElement("a");
    link.href = watermarkedPdfUrl;
    link.download = `watermarked-${file?.name || "document.pdf"}`;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Add Watermark</h1>
          <p className="text-lg text-muted-foreground">
            Add a custom watermark to your PDF pages
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !watermarkedPdfUrl ? (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border">
              <p className="font-medium mb-2">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Watermark Text</label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark text"
                  maxLength={50}
                />
              </div>

              <Button
                onClick={handleAddWatermark}
                disabled={processing || !watermarkText.trim()}
                variant="hero"
                size="xl"
                className="w-full gap-2"
              >
                <Droplet className="w-5 h-5" />
                {processing ? "Adding Watermark..." : "Add Watermark"}
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
              <h3 className="text-xl font-semibold mb-2">Watermark Added!</h3>
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
                  setWatermarkedPdfUrl("");
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

export default WatermarkPDF;
