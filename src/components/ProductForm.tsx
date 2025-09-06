import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PrinterIcon, Package2Icon } from "lucide-react";

interface Product {
  name: string;
  category: string;
  shelfLifeDays: number;
  temperature: string;
}

const PRODUCT_CATEGORIES = [
  { name: "Мясо", shelfLife: 3, temp: "0-4°C" },
  { name: "Рыба", shelfLife: 2, temp: "0-2°C" },
  { name: "Молочные продукты", shelfLife: 5, temp: "2-6°C" },
  { name: "Овощи", shelfLife: 7, temp: "0-8°C" },
  { name: "Готовые блюда", shelfLife: 2, temp: "0-4°C" },
  { name: "Соусы", shelfLife: 10, temp: "2-8°C" },
  { name: "Десерты", shelfLife: 3, temp: "2-6°C" },
];

interface ProductFormProps {
  onPrint: (product: Product & { productionDate: Date; expiryDate: Date }) => void;
}

export function ProductForm({ onPrint }: ProductFormProps) {
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productionDate, setProductionDate] = useState(new Date().toISOString().split('T')[0]);

  const calculateExpiryDate = (production: string, shelfLifeDays: number): Date => {
    const date = new Date(production);
    date.setDate(date.getDate() + shelfLifeDays);
    return date;
  };

  const handlePrint = () => {
    if (!productName || !selectedCategory) return;
    
    const category = PRODUCT_CATEGORIES.find(cat => cat.name === selectedCategory);
    if (!category) return;

    const production = new Date(productionDate);
    const expiry = calculateExpiryDate(productionDate, category.shelfLife);

    onPrint({
      name: productName,
      category: selectedCategory,
      shelfLifeDays: category.shelfLife,
      temperature: category.temp,
      productionDate: production,
      expiryDate: expiry
    });
  };

  const getSelectedCategory = () => {
    return PRODUCT_CATEGORIES.find(cat => cat.name === selectedCategory);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  return (
    <Card className="w-full max-w-md card-gradient fade-in">
      <CardHeader className="glass-effect rounded-t-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20"></div>
        <CardTitle className="flex items-center gap-3 text-lg font-semibold relative z-10">
          <div className="p-2 rounded-lg bg-primary/20 glass-effect">
            <Package2Icon className="h-5 w-5 text-primary" />
          </div>
          Создание этикетки
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="product-name">Название продукта</Label>
          <Input
            id="product-name"
            placeholder="Введите название продукта"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Категория</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name} ({category.shelfLife} дн.)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="production-date">Дата производства</Label>
          <div className="relative">
            <Input
              id="production-date"
              type="date"
              value={productionDate}
              onChange={(e) => setProductionDate(e.target.value)}
            />
            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {selectedCategory && (
          <div className="surface-tech p-5 rounded-xl space-y-4 slide-up relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <span className="font-medium text-foreground">Срок годности:</span> 
                <span className="px-3 py-1.5 bg-success/20 text-success rounded-full text-sm font-semibold border border-success/30">
                  {getSelectedCategory()?.shelfLife} дней
                </span>
              </div>
              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <span className="font-medium text-foreground">Температура:</span> 
                <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30">
                  {getSelectedCategory()?.temp}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <span className="font-medium text-foreground">Годен до:</span> 
                <span className="px-3 py-1.5 bg-warning/20 text-warning rounded-full text-sm font-semibold border border-warning/30">
                  {formatDate(calculateExpiryDate(productionDate, getSelectedCategory()?.shelfLife || 0).toISOString().split('T')[0])}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handlePrint} 
          disabled={!productName || !selectedCategory}
          className="w-full btn-primary-gradient text-white font-semibold py-3 h-12 text-base rounded-xl"
        >
          <PrinterIcon className="mr-3 h-5 w-5" />
          Печать этикетки
        </Button>
      </CardContent>
    </Card>
  );
}