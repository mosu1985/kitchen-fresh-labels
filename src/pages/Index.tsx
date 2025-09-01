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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <ChefHatIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Система печати этикеток</h1>
              <p className="text-primary-foreground/80">Управление сроками годности для кухни ресторана</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Form */}
          <ProductForm onPrint={handlePrint} />
          
          {/* Preview */}
          <LabelPreview labelData={currentLabel} />
        </div>

        <Separator className="my-8" />

        {/* Recent Labels */}
        <RecentLabels 
          labels={printedLabels}
          onReprint={handleReprint}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Index;
