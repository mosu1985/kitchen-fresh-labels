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
    <Card className="w-full max-w-md">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Package2Icon className="h-5 w-5" />
          Создание этикетки
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
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
          <div className="bg-muted p-3 rounded-md space-y-1">
            <div className="text-sm">
              <span className="font-medium">Срок годности:</span> {getSelectedCategory()?.shelfLife} дней
            </div>
            <div className="text-sm">
              <span className="font-medium">Температура хранения:</span> {getSelectedCategory()?.temp}
            </div>
            <div className="text-sm">
              <span className="font-medium">Годен до:</span> {formatDate(calculateExpiryDate(productionDate, getSelectedCategory()?.shelfLife || 0).toISOString().split('T')[0])}
            </div>
          </div>
        )}

        <Button 
          onClick={handlePrint} 
          disabled={!productName || !selectedCategory}
          className="w-full"
        >
          <PrinterIcon className="mr-2 h-4 w-4" />
          Печать этикетки
        </Button>
      </CardContent>
    </Card>
  );
}