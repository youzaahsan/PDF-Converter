import { Button } from "@/components/ui/button";
import { Upload, Cloud } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          PDF to WORD Converter
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Convert your PDF to WORD documents with incredible accuracy.
        </p>

        {/* Upload Section */}
        <div className="bg-card rounded-2xl shadow-xl p-12 border">
          <Button variant="hero" size="xl" className="gap-3 mb-6">
            <Upload className="w-5 h-5" />
            Select PDF file
          </Button>

          {/* Cloud Storage Options */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Cloud className="w-5 h-5" />
              <span>From Drive</span>
            </button>
            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.004 3.5A5.5 5.5 0 0 0 1.5 9c0 1.863.949 3.505 2.387 4.463L8.004 18h8l4.117-4.537A5.48 5.48 0 0 0 22.5 9a5.5 5.5 0 0 0-5.5-5.5c-1.862 0-3.505.949-4.463 2.387L12 6.5l-.537-.613A5.48 5.48 0 0 0 7.004 3.5z"/>
              </svg>
              <span>From Dropbox</span>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">100% Accurate</h3>
            <p className="text-sm text-muted-foreground">
              Preserve your document formatting with precision conversion technology.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your files are encrypted and automatically deleted after processing.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Convert your PDF files in seconds with our optimized processing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
