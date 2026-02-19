import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Download, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ComparePDF = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<any>(null);

  const handleFile1Selected = (files: File[]) => {
    setFile1(files[0]);
    setComparisonResults(null);
    toast.success("First PDF loaded");
  };

  const handleFile2Selected = (files: File[]) => {
    setFile2(files[0]);
    setComparisonResults(null);
    toast.success("Second PDF loaded");
  };

  const handleCompare = async () => {
    if (!file1 || !file2) {
      toast.error("Please upload both PDF files");
      return;
    }

    setProcessing(true);
    try {
      const reader1 = new FileReader();
      const reader2 = new FileReader();

      reader1.readAsDataURL(file1);
      const base64_1 = await new Promise<string>((resolve) => {
        reader1.onload = () => resolve((reader1.result as string).split(',')[1]);
      });

      reader2.readAsDataURL(file2);
      const base64_2 = await new Promise<string>((resolve) => {
        reader2.onload = () => resolve((reader2.result as string).split(',')[1]);
      });

      const { data, error } = await supabase.functions.invoke('compare-pdf', {
        body: { 
          pdf1Base64: base64_1,
          pdf2Base64: base64_2
        }
      });

      if (error) throw error;

      setComparisonResults(data);
      toast.success("PDFs compared successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to compare PDFs");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Compare PDFs</h1>
          <p className="text-lg text-muted-foreground">
            Compare two PDF documents to find differences
          </p>
        </div>

        {!comparisonResults ? (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">First PDF</h3>
                {!file1 ? (
                  <FileUploadZone 
                    onFilesSelected={handleFile1Selected}
                    title="Select first PDF"
                    subtitle="or drag and drop"
                  />
                ) : (
                  <div className="p-6 bg-card rounded-lg border">
                    <p className="font-medium mb-2">{file1.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file1.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile1(null)}
                      className="mt-2"
                    >
                      Change File
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-4">Second PDF</h3>
                {!file2 ? (
                  <FileUploadZone 
                    onFilesSelected={handleFile2Selected}
                    title="Select second PDF"
                    subtitle="or drag and drop"
                  />
                ) : (
                  <div className="p-6 bg-card rounded-lg border">
                    <p className="font-medium mb-2">{file2.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file2.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile2(null)}
                      className="mt-2"
                    >
                      Change File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {file1 && file2 && (
              <Button
                onClick={handleCompare}
                disabled={processing}
                variant="hero"
                size="xl"
                className="w-full gap-2"
              >
                <GitCompare className="w-5 h-5" />
                {processing ? "Comparing PDFs..." : "Compare PDFs"}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comparison Complete!</h3>
              <p className="text-muted-foreground">
                {comparisonResults.differences || 0} differences found
              </p>
            </div>

            {comparisonResults.summary && (
              <div className="p-6 bg-card rounded-lg border">
                <h4 className="font-semibold mb-3">Summary</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {comparisonResults.summary}
                </p>
              </div>
            )}

            <Button 
              onClick={() => {
                setFile1(null);
                setFile2(null);
                setComparisonResults(null);
              }}
              variant="outline"
              size="xl"
              className="w-full"
            >
              Compare More PDFs
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComparePDF;
