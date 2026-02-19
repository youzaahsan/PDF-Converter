import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

interface PageItem {
  pageNumber: number;
  selected: boolean;
}

const RemovePages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [removed, setRemoved] = useState(false);

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

  const togglePage = (index: number) => {
    setPages(prev => prev.map((page, i) => 
      i === index ? { ...page, selected: !page.selected } : page
    ));
  };

  const selectAll = () => {
    setPages(prev => prev.map(page => ({ ...page, selected: true })));
  };

  const deselectAll = () => {
    setPages(prev => prev.map(page => ({ ...page, selected: false })));
  };

  const handleRemove = async () => {
    const selectedCount = pages.filter(p => p.selected).length;
    
    if (selectedCount === 0) {
      toast.error("Please select at least one page to remove");
      return;
    }

    if (selectedCount === pages.length) {
      toast.error("Cannot remove all pages");
      return;
    }

    if (!file) return;

    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      for (let i = 0; i < pages.length; i++) {
        if (!pages[i].selected) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
        }
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'removed-pages.pdf';
      a.click();

      setProcessing(false);
      setRemoved(true);
      toast.success(`${selectedCount} pages removed successfully!`);
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to remove pages");
    }
  };

  const selectedCount = pages.filter(p => p.selected).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Remove Pages</h1>
          <p className="text-lg text-muted-foreground">
            Select pages to remove from your PDF
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !removed ? (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCount} of {pages.length} pages selected
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAll}>
                    Deselect All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
                {pages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => togglePage(index)}
                    className={`relative border-2 rounded-lg p-4 transition-all ${
                      page.selected
                        ? 'border-destructive bg-destructive/10'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-muted rounded flex items-center justify-center">
                      <span className="text-2xl font-bold">{page.pageNumber}</span>
                    </div>
                    {page.selected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleRemove}
              disabled={processing || selectedCount === 0}
            >
              <Trash2 className="w-5 h-5" />
              {processing ? "Removing..." : `Remove ${selectedCount} Page${selectedCount !== 1 ? 's' : ''}`}
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
              <h2 className="text-2xl font-bold mb-2">Pages Removed Successfully!</h2>
              <p className="text-muted-foreground">Your file has been downloaded</p>
            </div>

            <Button 
              variant="outline" 
              size="xl" 
              onClick={() => {
                setFile(null);
                setPages([]);
                setRemoved(false);
              }}
            >
              Remove Pages from Another File
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RemovePages;
