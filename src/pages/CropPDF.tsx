import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Crop } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

const CropPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [croppedPdfUrl, setCroppedPdfUrl] = useState<string>("");
  const [margins, setMargins] = useState({ top: 20, bottom: 20, left: 20, right: 20 });

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setCroppedPdfUrl("");
    toast.success("PDF loaded");
  };

  const handleCrop = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.setCropBox(
          margins.left,
          margins.bottom,
          width - margins.left - margins.right,
          height - margins.top - margins.bottom
        );
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setCroppedPdfUrl(url);
      toast.success("PDF cropped successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to crop PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!croppedPdfUrl) return;
    
    const link = document.createElement("a");
    link.href = croppedPdfUrl;
    link.download = `cropped-${file?.name || "document.pdf"}`;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Crop PDF</h1>
          <p className="text-lg text-muted-foreground">
            Adjust margins and crop your PDF pages
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !croppedPdfUrl ? (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border">
              <p className="font-medium mb-2">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(["top", "bottom", "left", "right"] as const).map(side => (
                  <div key={side}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {side} Margin (px)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="200"
                      value={margins[side]}
                      onChange={(e) => setMargins(prev => ({
                        ...prev,
                        [side]: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={handleCrop}
                disabled={processing}
                variant="hero"
                size="xl"
                className="w-full gap-2"
              >
                <Crop className="w-5 h-5" />
                {processing ? "Cropping PDF..." : "Crop PDF"}
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
              <h3 className="text-xl font-semibold mb-2">PDF Cropped!</h3>
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
                  setCroppedPdfUrl("");
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

export default CropPDF;
