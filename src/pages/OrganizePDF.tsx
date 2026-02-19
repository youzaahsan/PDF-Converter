import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Download, GripVertical, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

interface PageItem {
  pageNumber: number;
  selected: boolean;
}

const OrganizePDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [organized, setOrganized] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    const pageItems: PageItem[] = Array.from({ length: pageCount }, (_, i) => ({
      pageNumber: i + 1,
      selected: false,
    }));
    
    setPages(pageItems);
    toast.success(`PDF loaded with ${pageCount} pages`);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPages = [...pages];
    const draggedItem = newPages[draggedIndex];
    newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedItem);
    
    setPages(newPages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleOrganize = async () => {
    if (!file || pages.length === 0) return;

    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      for (const page of pages) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [page.pageNumber - 1]);
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'organized.pdf';
      a.click();

      setProcessing(false);
      setOrganized(true);
      toast.success("PDF organized successfully!");
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to organize PDF");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Organize PDF</h1>
          <p className="text-lg text-muted-foreground">
            Reorder pages by dragging and dropping
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !organized ? (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{pages.length} pages</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
                {pages.map((page, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative border-2 rounded-lg p-4 cursor-move hover:border-primary transition-colors ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <GripVertical className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
                    <div className="aspect-[3/4] bg-muted rounded flex items-center justify-center">
                      <span className="text-2xl font-bold">{page.pageNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleOrganize}
              disabled={processing}
            >
              <ArrowUpDown className="w-5 h-5" />
              {processing ? "Organizing..." : "Organize PDF"}
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
              <h2 className="text-2xl font-bold mb-2">PDF Organized Successfully!</h2>
              <p className="text-muted-foreground">Your file has been downloaded</p>
            </div>

            <Button 
              variant="outline" 
              size="xl" 
              onClick={() => {
                setFile(null);
                setPages([]);
                setOrganized(false);
              }}
            >
              Organize Another File
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizePDF;
