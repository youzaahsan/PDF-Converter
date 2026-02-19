import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Download, Scan, X } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

const ScanToPDF = () => {
  const [images, setImages] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error("Please select image files");
      return;
    }
    setImages(prev => [...prev, ...imageFiles]);
    toast.success(`${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} added`);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imageFile of images) {
        const imageBytes = await imageFile.arrayBuffer();
        let image;
        
        if (imageFile.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          continue;
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scanned.pdf';
      a.click();

      setProcessing(false);
      setConverted(true);
      toast.success("Images converted to PDF successfully!");
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to convert images to PDF");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Scan to PDF</h1>
          <p className="text-lg text-muted-foreground">
            Convert images to PDF document
          </p>
        </div>

        {!converted ? (
          <div className="space-y-6">
            <FileUploadZone 
              onFilesSelected={handleFilesSelected}
              accept="image/*"
              multiple
              title="Select images"
              subtitle="or drag and drop here (JPG, PNG)"
            />

            {images.length > 0 && (
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium">{images.length} image{images.length > 1 ? 's' : ''} added</p>
                </div>
                
                <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative border-2 rounded-lg p-2 group">
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="aspect-[3/4] bg-muted rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Page ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 text-muted-foreground truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleConvert}
              disabled={processing || images.length === 0}
            >
              <Scan className="w-5 h-5" />
              {processing ? "Converting..." : "Convert to PDF"}
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
              <h2 className="text-2xl font-bold mb-2">PDF Created Successfully!</h2>
              <p className="text-muted-foreground">Your file has been downloaded</p>
            </div>

            <Button 
              variant="outline" 
              size="xl" 
              onClick={() => {
                setImages([]);
                setConverted(false);
              }}
            >
              Convert More Images
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScanToPDF;
