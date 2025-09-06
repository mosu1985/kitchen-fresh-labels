import { useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { LabelPreview } from "@/components/LabelPreview";
import { RecentLabels } from "@/components/RecentLabels";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { PrinterIcon, ChefHatIcon } from "lucide-react";

interface PrintedLabel {
  id: string;
  name: string;
  category: string;
  temperature: string;
  shelfLifeDays: number;
  productionDate: Date;
  expiryDate: Date;
  printedAt: Date;
}

const Index = () => {
  const [currentLabel, setCurrentLabel] = useState<PrintedLabel | null>(null);
  const [printedLabels, setPrintedLabels] = useState<PrintedLabel[]>([]);
  const { toast } = useToast();

  const handlePrint = (productData: any) => {
    const newLabel: PrintedLabel = {
      id: Math.random().toString(36).substr(2, 9),
      ...productData,
      printedAt: new Date(),
    };

    setCurrentLabel(newLabel);
    setPrintedLabels(prev => [newLabel, ...prev.slice(0, 9)]); // Keep last 10 labels

    toast({
      title: "Этикетка отправлена на печать",
      description: `Этикетка для "${productData.name}" успешно напечатана.`,
    });
  };

  const handleReprint = (label: PrintedLabel) => {
    const reprintLabel = {
      ...label,
      id: Math.random().toString(36).substr(2, 9),
      printedAt: new Date(),
    };

    setPrintedLabels(prev => [reprintLabel, ...prev.slice(0, 9)]);
    
    toast({
      title: "Этикетка перепечатана",
      description: `Этикетка для "${label.name}" перепечатана.`,
    });
  };

  const handleDelete = (id: string) => {
    setPrintedLabels(prev => prev.filter(label => label.id !== id));
    
    toast({
      title: "Запись удалена",
      description: "Запись об этикетке удалена из истории.",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="btn-primary-gradient text-primary-foreground shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
        <div className="container mx-auto px-6 py-8 relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <ChefHatIcon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Система печати этикеток</h1>
              <p className="text-primary-foreground/90 text-lg mt-1">Управление сроками годности для кухни ресторана</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Form */}
          <div className="slide-up">
            <ProductForm onPrint={handlePrint} />
          </div>
          
          {/* Preview */}
          <div className="slide-up" style={{ animationDelay: '0.1s' }}>
            <LabelPreview labelData={currentLabel} />
          </div>
        </div>

        <div className="relative my-12">
          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background px-4 text-muted-foreground text-sm font-medium">
              История печати
            </div>
          </div>
        </div>

        {/* Recent Labels */}
        <div className="slide-up" style={{ animationDelay: '0.2s' }}>
          <RecentLabels 
            labels={printedLabels}
            onReprint={handleReprint}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
