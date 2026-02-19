import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { toast } from "sonner";

const EditPDF = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    toast.success("PDF loaded");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Edit PDF</h1>
          <p className="text-lg text-muted-foreground">
            Edit text and images in your PDF document
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

            <div className="p-8 bg-muted/20 rounded-lg border-2 border-dashed text-center">
              <Edit className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">PDF Editor Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Advanced PDF editing features are being developed. 
                For now, use our other tools to rotate, add page numbers, watermark, and more.
              </p>
              <Button 
                onClick={() => setFile(null)}
                variant="outline"
              >
                Upload Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditPDF;
