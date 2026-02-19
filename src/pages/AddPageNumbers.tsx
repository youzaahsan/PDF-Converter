import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Download, Hash } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, rgb } from "pdf-lib";

const AddPageNumbers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [numberedPdfUrl, setNumberedPdfUrl] = useState<string>("");
  const [position, setPosition] = useState<"bottom-center" | "bottom-right" | "bottom-left">("bottom-center");

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setNumberedPdfUrl("");
    toast.success("PDF loaded");
  };

  const handleAddPageNumbers = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumber = `${index + 1}`;
        
        let x = width / 2 - 10;
        if (position === "bottom-right") x = width - 50;
        if (position === "bottom-left") x = 30;
        
        page.drawText(pageNumber, {
          x,
          y: 30,
          size: 12,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setNumberedPdfUrl(url);
      toast.success("Page numbers added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add page numbers");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!numberedPdfUrl) return;
    
    const link = document.createElement("a");
    link.href = numberedPdfUrl;
    link.download = `numbered-${file?.name || "document.pdf"}`;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Add Page Numbers</h1>
          <p className="text-lg text-muted-foreground">
            Automatically number all pages in your PDF
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !numberedPdfUrl ? (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border">
              <p className="font-medium mb-2">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Position</label>
                <div className="flex gap-3">
                  {[
                    { value: "bottom-left", label: "Bottom Left" },
                    { value: "bottom-center", label: "Bottom Center" },
                    { value: "bottom-right", label: "Bottom Right" }
                  ].map(opt => (
                    <Button
                      key={opt.value}
                      onClick={() => setPosition(opt.value as typeof position)}
                      variant={position === opt.value ? "default" : "outline"}
                      className="flex-1"
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddPageNumbers}
                disabled={processing}
                variant="hero"
                size="xl"
                className="w-full gap-2"
              >
                <Hash className="w-5 h-5" />
                {processing ? "Adding Page Numbers..." : "Add Page Numbers"}
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
              <h3 className="text-xl font-semibold mb-2">Page Numbers Added!</h3>
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
                  setNumberedPdfUrl("");
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

export default AddPageNumbers;
