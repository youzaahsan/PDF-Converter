import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MergePDF from "./pages/MergePDF";
import SplitPDF from "./pages/SplitPDF";
import CompressPDF from "./pages/CompressPDF";
import ConvertTool from "./pages/ConvertTool";
import RotatePDF from "./pages/RotatePDF";
import AddPageNumbers from "./pages/AddPageNumbers";
import WatermarkPDF from "./pages/WatermarkPDF";
import CropPDF from "./pages/CropPDF";
import UnlockPDF from "./pages/UnlockPDF";
import ProtectPDF from "./pages/ProtectPDF";
import SignPDF from "./pages/SignPDF";
import RedactPDF from "./pages/RedactPDF";
import ComparePDF from "./pages/ComparePDF";
import EditPDF from "./pages/EditPDF";
import OrganizePDF from "./pages/OrganizePDF";
import RemovePages from "./pages/RemovePages";
import ExtractPages from "./pages/ExtractPages";
import ScanToPDF from "./pages/ScanToPDF";
import OptimizePDF from "./pages/OptimizePDF";
import RepairPDF from "./pages/RepairPDF";
import OCRPDF from "./pages/OCRPDF";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/merge" element={<MergePDF />} />
          <Route path="/split" element={<SplitPDF />} />
          <Route path="/compress" element={<CompressPDF />} />
          
          {/* Convert routes */}
          <Route path="/jpg-to-pdf" element={<ConvertTool />} />
          <Route path="/word-to-pdf" element={<ConvertTool />} />
          <Route path="/ppt-to-pdf" element={<ConvertTool />} />
          <Route path="/excel-to-pdf" element={<ConvertTool />} />
          <Route path="/html-to-pdf" element={<ConvertTool />} />
          <Route path="/pdf-to-jpg" element={<ConvertTool />} />
          <Route path="/pdf-to-word" element={<ConvertTool />} />
          <Route path="/pdf-to-ppt" element={<ConvertTool />} />
          <Route path="/pdf-to-excel" element={<ConvertTool />} />
          <Route path="/pdf-to-pdfa" element={<ConvertTool />} />
          
          {/* Edit PDF routes */}
          <Route path="/rotate" element={<RotatePDF />} />
          <Route path="/page-numbers" element={<AddPageNumbers />} />
          <Route path="/watermark" element={<WatermarkPDF />} />
          <Route path="/crop" element={<CropPDF />} />
          <Route path="/edit" element={<EditPDF />} />
          
          {/* PDF Security routes */}
          <Route path="/unlock" element={<UnlockPDF />} />
          <Route path="/protect" element={<ProtectPDF />} />
          <Route path="/sign" element={<SignPDF />} />
          <Route path="/redact" element={<RedactPDF />} />
          <Route path="/compare" element={<ComparePDF />} />
          
          {/* Organize & Manage routes */}
          <Route path="/organize" element={<OrganizePDF />} />
          <Route path="/remove-pages" element={<RemovePages />} />
          <Route path="/extract-pages" element={<ExtractPages />} />
          <Route path="/scan" element={<ScanToPDF />} />
          <Route path="/optimize" element={<OptimizePDF />} />
          <Route path="/repair" element={<RepairPDF />} />
          <Route path="/ocr" element={<OCRPDF />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
