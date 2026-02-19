import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Download, RotateCw, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, degrees } from "pdf-lib";

const RotatePDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState<string>("");
  const [rotation, setRotation] = useState(0);

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setRotatedPdfUrl("");
    setRotation(0);
    toast.success("PDF loaded");
  };

  const handleRotate = async (angle: number) => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setRotatedPdfUrl(url);
      setRotation((rotation + angle) % 360);
      toast.success("PDF rotated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to rotate PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!rotatedPdfUrl) return;
    
    const link = document.createElement("a");
    link.href = rotatedPdfUrl;
    link.download = `rotated-${file?.name || "document.pdf"}`;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rotate PDF</h1>
          <p className="text-lg text-muted-foreground">
            Rotate all pages in your PDF document
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border">
              <p className="font-medium mb-2">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleRotate(-90)}
                disabled={processing}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Rotate Left 90°
              </Button>
              <Button
                onClick={() => handleRotate(90)}
                disabled={processing}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCw className="w-5 h-5" />
                Rotate Right 90°
              </Button>
            </div>

            {rotatedPdfUrl && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">PDF Rotated!</h3>
                  <p className="text-muted-foreground">Current rotation: {rotation}°</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleDownload} variant="hero" size="xl" className="gap-2">
                    <Download className="w-5 h-5" />
                    Download Rotated PDF
                  </Button>
                  <Button 
                    onClick={() => {
                      setFile(null);
                      setRotatedPdfUrl("");
                      setRotation(0);
                    }}
                    variant="outline"
                    size="xl"
                  >
                    Rotate Another File
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RotatePDF;
