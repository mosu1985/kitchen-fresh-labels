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
      {/* Modern Tech Header */}
      <header className="relative overflow-hidden glass-effect border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-glow/5 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_hsl(var(--primary))_0%,_transparent_50%)] opacity-10"></div>
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 surface-tech rounded-2xl">
              <ChefHatIcon className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                EcoLabel Pro
              </h1>
              <p className="text-foreground/70 text-xl">Умная система печати этикеток для экологичной кухни</p>
              <div className="flex gap-3 mt-3">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium glass-effect">
                  Эко-технологии
                </span>
                <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium glass-effect">
                  Smart Kitchen
                </span>
              </div>
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
