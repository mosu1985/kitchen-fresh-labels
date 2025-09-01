import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, CalendarIcon, ThermometerIcon } from "lucide-react";

interface LabelData {
  name: string;
  category: string;
  shelfLifeDays: number;
  temperature: string;
  productionDate: Date;
  expiryDate: Date;
}

interface LabelPreviewProps {
  labelData: LabelData | null;
}

export function LabelPreview({ labelData }: LabelPreviewProps) {
  if (!labelData) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="bg-muted">
          <CardTitle className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            Предварительный просмотр
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Заполните форму для предварительного просмотра этикетки
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = (): boolean => {
    const today = new Date();
    const daysUntilExpiry = Math.ceil((labelData.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 2;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-muted">
        <CardTitle className="flex items-center gap-2">
          <EyeIcon className="h-5 w-5" />
          Предварительный просмотр
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Имитация термо-этикетки */}
        <div className="border-2 border-dashed border-muted-foreground p-4 bg-white rounded-lg">
          <div className="space-y-3 text-center">
            {/* Название продукта */}
            <div className="font-bold text-lg border-b border-gray-300 pb-2">
              {labelData.name.toUpperCase()}
            </div>
            
            {/* Категория */}
            <div className="flex justify-center">
              <Badge variant="secondary">{labelData.category}</Badge>
            </div>
            
            {/* Даты */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Изготовлено:</span>
                <span>{formatDate(labelData.productionDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Время:</span>
                <span>{formatTime(labelData.productionDate)}</span>
              </div>
              <div className={`flex items-center justify-between font-bold ${isExpiringSoon() ? 'text-destructive' : 'text-foreground'}`}>
                <span>Годен до:</span>
                <span>{formatDate(labelData.expiryDate)}</span>
              </div>
            </div>
            
            {/* Условия хранения */}
            <div className="border-t border-gray-300 pt-2">
              <div className="flex items-center justify-center gap-1 text-xs">
                <ThermometerIcon className="h-3 w-3" />
                <span>Хранить при {labelData.temperature}</span>
              </div>
            </div>
            
            {/* Штрих-код имитация */}
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="w-1 h-6 bg-black" style={{ width: Math.random() > 0.5 ? '2px' : '1px' }} />
                ))}
              </div>
              <div className="text-xs mt-1 font-mono">
                {Math.random().toString().slice(2, 14)}
              </div>
            </div>
          </div>
        </div>
        
        {isExpiringSoon() && (
          <div className="mt-3 p-2 bg-destructive/10 border border-destructive rounded-md">
            <div className="text-destructive text-sm font-medium text-center">
              ⚠️ Срок годности истекает через {Math.ceil((labelData.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} дн.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}