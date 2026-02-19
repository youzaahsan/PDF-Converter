import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Split } from "lucide-react";
import { toast } from "sonner";

interface PageData {
  pageNumber: number;
  selected: boolean;
}

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [processing, setProcessing] = useState(false);
  const [split, setSplit] = useState(false);

  const handleFileSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
    // Simulate PDF page detection (in real app, use PDF.js)
    const mockPageCount = Math.floor(Math.random() * 10) + 5;
    const mockPages = Array.from({ length: mockPageCount }, (_, i) => ({
      pageNumber: i + 1,
      selected: false
    }));
    setPages(mockPages);
    toast.success("PDF loaded successfully");
  };

  const togglePage = (pageNumber: number) => {
    setPages(prev => prev.map(p => 
      p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p
    ));
  };

  const selectAll = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: false })));
  };

  const handleSplit = async () => {
    const selectedPages = pages.filter(p => p.selected);
    if (selectedPages.length === 0) {
      toast.error("Please select at least one page");
      return;
    }

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    setSplit(true);
    toast.success("PDF split successfully!");
  };

  const handleDownload = () => {
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Split PDF file</h1>
          <p className="text-lg text-muted-foreground">
            Extract specific pages from your PDF document
          </p>
        </div>

        {!file ? (
          <FileUploadZone 
            onFilesSelected={handleFileSelected}
            title="Select PDF file"
            subtitle="or drag and drop here"
          />
        ) : !split ? (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border">
              <p className="font-medium mb-1">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {pages.length} pages • {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={selectAll}>Select All</Button>
              <Button variant="outline" onClick={deselectAll}>Deselect All</Button>
              <div className="flex-1" />
              <span className="text-sm text-muted-foreground self-center">
                {pages.filter(p => p.selected).length} of {pages.length} pages selected
              </span>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {pages.map((page) => (
                <div
                  key={page.pageNumber}
                  onClick={() => togglePage(page.pageNumber)}
                  className={`aspect-[3/4] border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    page.selected ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
                  }`}
                >
                  <div className="flex flex-col items-center justify-between h-full">
                    <Checkbox 
                      checked={page.selected}
                      className="mb-2"
                    />
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full h-full bg-white rounded shadow-sm" />
                    </div>
                    <p className="text-sm font-medium mt-2">Page {page.pageNumber}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full gap-3"
              onClick={handleSplit}
              disabled={processing}
            >
              <Split className="w-5 h-5" />
              {processing ? "Splitting PDF..." : "Split PDF"}
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
              <h2 className="text-2xl font-bold mb-2">PDF Split Successfully!</h2>
              <p className="text-muted-foreground">
                {pages.filter(p => p.selected).length} pages extracted
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="xl" className="gap-3" onClick={handleDownload}>
                <Download className="w-5 h-5" />
                Download Split PDF
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => {
                  setFile(null);
                  setPages([]);
                  setSplit(false);
                }}
              >
                Split Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SplitPDF;
